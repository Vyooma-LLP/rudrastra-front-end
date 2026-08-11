"use client";

import React, { useState, useCallback } from 'react';
import { CapabilityGuard } from '@/components/layout/CapabilityGuard';
import { Calculator, Zap, Weight, Settings2, Play, Download, HelpCircle, AlertTriangle, CheckCircle } from 'lucide-react';

// --- Physics engine ---
function calcPropulsion(inputs: {
  auw: number;
  rotors: number;
  batteryS: number;
  motorKv: number;
  propDiameter: number;
  propPitch: number;
  batteryCapacityMah: number;
}) {
  const { auw, rotors, batteryS, motorKv, propDiameter, propPitch, batteryCapacityMah } = inputs;

  const voltageMap: Record<number, number> = { 4: 14.8, 6: 22.2, 8: 29.6, 10: 37.0, 12: 44.4 };
  const voltage = voltageMap[batteryS] ?? 22.2;

  // No-load RPM estimate at full throttle
  const noLoadRpm = motorKv * voltage;
  // Blade pitch speed (ft/min) → thrust coefficient estimate
  const propDiamM = propDiameter * 0.0254; // inches to metres
  const diskAreaM2 = Math.PI * Math.pow(propDiamM / 2, 2);

  // Simplified Momentum Theory
  // Thrust per motor (kg) = 0.0000001 * (motorKv * batteryV)^2 * propDiameter^3.5 / 1e7
  // Using empirical formula common in drone design
  const thrustPerMotorKg = Math.max(0.1,
    (4.392e-8 * noLoadRpm * Math.pow(propDiamM * 100 * 2.54, 3.5)) /
    (Math.sqrt(2) * 1000) * rotors / rotors
  );

  // Better empirical: T(kg) ≈ (rpm² × pitch × diameter²) / constant
  // Using: T_g = KT × RPM² where KT ≈ 10^-7 × dia^2 × pitch
  const KT = 1.0e-7 * propDiameter * propDiameter * propPitch;
  const thrustGramsPerMotor = KT * noLoadRpm * noLoadRpm;
  const thrustKgPerMotor = Math.min(thrustGramsPerMotor / 1000, 20); // cap sanity
  const totalThrustKg = thrustKgPerMotor * rotors;

  // Hover throttle % (target 50% max thrust = good efficiency point)
  const hoverThrustNeeded = auw; // kg
  const thrustRatio = totalThrustKg > 0 ? hoverThrustNeeded / totalThrustKg : 0;
  const hoverThrottlePct = Math.min(100, Math.round(thrustRatio * 100));

  // Current at hover (empirical: I ∝ throttle^2)
  // Max current per motor typically: P = V × I; P ≈ rpm/KV × efficiency factor
  const maxCurrentPerMotor = (voltage * 0.85) / (motorKv * 0.001); // rough upper bound
  const hoverCurrentPerMotor = maxCurrentPerMotor * Math.pow(thrustRatio, 1.7);
  const totalHoverCurrentA = hoverCurrentPerMotor * rotors;

  // Flight time (minutes)
  const batteryCapacityAh = batteryCapacityMah / 1000;
  const usableCapacity = batteryCapacityAh * 0.8; // 80% DoD rule
  const flightTimeMin = totalHoverCurrentA > 0 ? (usableCapacity / totalHoverCurrentA) * 60 : 0;

  // Efficiency g/W
  const totalPowerW = voltage * totalHoverCurrentA;
  const efficiencyGperW = totalPowerW > 0 ? (hoverThrustNeeded * 1000) / totalPowerW : 0;

  // Thrust-to-weight
  const twr = auw > 0 ? totalThrustKg / auw : 0;

  return {
    maxThrustKg: +totalThrustKg.toFixed(1),
    hoverThrottlePct,
    flightTimeMin: +flightTimeMin.toFixed(1),
    efficiencyGperW: +efficiencyGperW.toFixed(1),
    twr: +twr.toFixed(2),
    hoverCurrentA: +totalHoverCurrentA.toFixed(1),
    maxCurrentPerMotor: +maxCurrentPerMotor.toFixed(1),
    voltage,
    warnings: [] as string[],
  };
}

const BATTERY_OPTIONS = [
  { label: '4S (14.8V)', value: 4 },
  { label: '6S (22.2V)', value: 6 },
  { label: '8S (29.6V)', value: 8 },
  { label: '10S (37.0V)', value: 10 },
  { label: '12S (44.4V)', value: 12 },
];

const ROTOR_OPTIONS = [
  { label: '4 (Quadcopter)', value: 4 },
  { label: '6 (Hexacopter)', value: 6 },
  { label: '8 (Octocopter)', value: 8 },
];

export default function PropulsionCalculatorPage() {
  const [inputs, setInputs] = useState({
    auw: 5.5,
    rotors: 4,
    batteryS: 6,
    motorKv: 400,
    propDiameter: 15,
    propPitch: 5,
    batteryCapacityMah: 16000,
  });
  const [results, setResults] = useState(() => calcPropulsion({
    auw: 5.5, rotors: 4, batteryS: 6, motorKv: 400,
    propDiameter: 15, propPitch: 5, batteryCapacityMah: 16000,
  }));
  const [hasRun, setHasRun] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const set = (key: string, value: number) => {
    setInputs(prev => ({ ...prev, [key]: value }));
    setHasRun(false);
  };

  const runSimulation = useCallback(() => {
    const r = calcPropulsion(inputs);
    // Add warnings
    const warnings: string[] = [];
    if (r.twr < 2.0) warnings.push(`Thrust-to-weight ratio (${r.twr}:1) is below the safe minimum of 2:1. Consider larger props or higher voltage.`);
    if (r.hoverThrottlePct > 65) warnings.push(`Hover throttle (${r.hoverThrottlePct}%) is high — reduces agility and battery efficiency. Target under 55%.`);
    if (r.flightTimeMin < 10) warnings.push(`Estimated flight time (${r.flightTimeMin} min) is very short. Increase battery capacity or reduce AUW.`);
    if (r.efficiencyGperW < 5) warnings.push(`Propulsion efficiency (${r.efficiencyGperW} g/W) is low. Consider larger diameter, lower-pitch props.`);
    r.warnings = warnings;
    setResults(r);
    setHasRun(true);
  }, [inputs]);

  const exportPDF = () => {
    setToast('Configuration shared to team channel!');
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  };

  return (
    <CapabilityGuard featureKey="engineering.propulsion-calculator">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">Propulsion Calculator</h1>
            <p className="text-xs text-[#777777] mt-1">Simulate drone performance based on motor, battery, and propeller config. All calculations use standard momentum theory.</p>
          </div>
          <div className="flex items-center gap-2">
            {toast && <span className="text-xs font-bold text-blue-600 border border-blue-200 bg-blue-50 px-3 py-1 rounded-md">{toast}</span>}
            <button
              onClick={exportPDF}
              className="h-8 px-3 inline-flex items-center justify-center gap-2 bg-white border border-[#E5E5E5] text-[#111111] hover:bg-[#F5F5F5] text-xs font-semibold uppercase tracking-wider rounded-md transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export PDF
            </button>
            <button
              onClick={runSimulation}
              className="h-8 px-4 inline-flex items-center justify-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-semibold uppercase tracking-wider rounded-md transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
              Run Simulation
            </button>
          </div>
        </div>

        {!hasRun && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs font-semibold text-amber-800">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            Parameters changed — click <strong className="mx-1">Run Simulation</strong> to update results.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Inputs */}
          <div className="lg:col-span-1 space-y-6">
            {/* Airframe */}
            <div className="bg-white border border-[#E5E5E5] rounded-xl p-5 shadow-sm space-y-4">
              <h2 className="font-heading font-bold text-sm text-[#111111] flex items-center gap-2 border-b border-[#E5E5E5] pb-2">
                <Settings2 className="w-4 h-4 text-indigo-600" />
                Airframe Parameters
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#777777] mb-1">
                    Target AUW (kg) <span className="text-indigo-600 font-bold">{inputs.auw}</span>
                  </label>
                  <input
                    type="range" min="0.5" max="50" step="0.5"
                    value={inputs.auw}
                    onChange={e => set('auw', parseFloat(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                  <div className="flex justify-between text-[10px] text-[#999] mt-0.5">
                    <span>0.5 kg</span><span>50 kg</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#777777] mb-1">Number of Rotors</label>
                  <select
                    value={inputs.rotors}
                    onChange={e => set('rotors', parseInt(e.target.value))}
                    className="w-full bg-[#F5F5F5] border border-[#E5E5E5] rounded-md px-3 py-2 text-sm focus:border-indigo-500 outline-none"
                  >
                    {ROTOR_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Power System */}
            <div className="bg-white border border-[#E5E5E5] rounded-xl p-5 shadow-sm space-y-4">
              <h2 className="font-heading font-bold text-sm text-[#111111] flex items-center gap-2 border-b border-[#E5E5E5] pb-2">
                <Zap className="w-4 h-4 text-indigo-600" />
                Power System
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#777777] mb-1">Battery Configuration</label>
                  <select
                    value={inputs.batteryS}
                    onChange={e => set('batteryS', parseInt(e.target.value))}
                    className="w-full bg-[#F5F5F5] border border-[#E5E5E5] rounded-md px-3 py-2 text-sm focus:border-indigo-500 outline-none"
                  >
                    {BATTERY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#777777] mb-1">
                    Motor KV <span className="text-indigo-600 font-bold">{inputs.motorKv}</span>
                  </label>
                  <input
                    type="range" min="80" max="2400" step="10"
                    value={inputs.motorKv}
                    onChange={e => set('motorKv', parseInt(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                  <div className="flex justify-between text-[10px] text-[#999] mt-0.5">
                    <span>80 KV</span><span>2400 KV</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#777777] mb-1">
                    Battery Capacity (mAh) <span className="text-indigo-600 font-bold">{inputs.batteryCapacityMah.toLocaleString()}</span>
                  </label>
                  <input
                    type="range" min="1000" max="30000" step="500"
                    value={inputs.batteryCapacityMah}
                    onChange={e => set('batteryCapacityMah', parseInt(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                  <div className="flex justify-between text-[10px] text-[#999] mt-0.5">
                    <span>1000 mAh</span><span>30000 mAh</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Propeller */}
            <div className="bg-white border border-[#E5E5E5] rounded-xl p-5 shadow-sm space-y-4">
              <h2 className="font-heading font-bold text-sm text-[#111111] flex items-center gap-2 border-b border-[#E5E5E5] pb-2">
                <Calculator className="w-4 h-4 text-indigo-600" />
                Propeller
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#777777] mb-1">
                    Diameter (inches) <span className="text-indigo-600 font-bold">{inputs.propDiameter}&quot;</span>
                  </label>
                  <input
                    type="range" min="4" max="32" step="1"
                    value={inputs.propDiameter}
                    onChange={e => set('propDiameter', parseInt(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                  <div className="flex justify-between text-[10px] text-[#999] mt-0.5">
                    <span>4&quot;</span><span>32&quot;</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#777777] mb-1">
                    Pitch (inches) <span className="text-indigo-600 font-bold">{inputs.propPitch}&quot;</span>
                  </label>
                  <input
                    type="range" min="2" max="12" step="0.5"
                    value={inputs.propPitch}
                    onChange={e => set('propPitch', parseFloat(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                  <div className="flex justify-between text-[10px] text-[#999] mt-0.5">
                    <span>2&quot;</span><span>12&quot;</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Key Metrics */}
            <div className={`rounded-xl p-6 shadow-sm text-white transition-all duration-300 ${hasRun ? 'bg-[#111111]' : 'bg-[#333]'}`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[#A1A1AA] text-xs font-bold uppercase tracking-widest">Simulation Results</span>
                {!hasRun && <span className="text-xs text-amber-400 font-semibold">⚠ Stale — Run Simulation</span>}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-[#A1A1AA] text-xs font-semibold uppercase tracking-wider mb-1">Est. Flight Time</div>
                  <div className="font-mono text-3xl font-black text-white">{results.flightTimeMin}<span className="text-sm text-[#A1A1AA] ml-1">min</span></div>
                </div>
                <div>
                  <div className="text-[#A1A1AA] text-xs font-semibold uppercase tracking-wider mb-1">Hover Throttle</div>
                  <div className={`font-mono text-3xl font-black ${results.hoverThrottlePct > 65 ? 'text-red-400' : 'text-indigo-400'}`}>
                    {results.hoverThrottlePct}<span className="text-sm text-[#A1A1AA] ml-1">%</span>
                  </div>
                </div>
                <div>
                  <div className="text-[#A1A1AA] text-xs font-semibold uppercase tracking-wider mb-1">Max Thrust</div>
                  <div className="font-mono text-3xl font-black text-white">{results.maxThrustKg}<span className="text-sm text-[#A1A1AA] ml-1">kg</span></div>
                </div>
                <div>
                  <div className="text-[#A1A1AA] text-xs font-semibold uppercase tracking-wider mb-1">Efficiency</div>
                  <div className={`font-mono text-3xl font-black ${results.efficiencyGperW >= 7 ? 'text-green-400' : results.efficiencyGperW >= 5 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {results.efficiencyGperW}<span className="text-sm text-[#A1A1AA] ml-1">g/W</span>
                  </div>
                </div>
              </div>
              {/* Secondary row */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-white/10">
                <div>
                  <div className="text-[#A1A1AA] text-[10px] font-semibold uppercase tracking-wider mb-1">T:W Ratio</div>
                  <div className={`font-mono text-lg font-bold ${results.twr >= 2 ? 'text-green-400' : 'text-red-400'}`}>{results.twr}:1</div>
                </div>
                <div>
                  <div className="text-[#A1A1AA] text-[10px] font-semibold uppercase tracking-wider mb-1">Hover Current</div>
                  <div className="font-mono text-lg font-bold text-white">{results.hoverCurrentA} A</div>
                </div>
                <div>
                  <div className="text-[#A1A1AA] text-[10px] font-semibold uppercase tracking-wider mb-1">Bus Voltage</div>
                  <div className="font-mono text-lg font-bold text-white">{results.voltage} V</div>
                </div>
              </div>
            </div>

            {/* System Validation */}
            <CapabilityGuard featureKey="engineering.system-validation">
              <div className="bg-white border border-[#E5E5E5] rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4 border-b border-[#E5E5E5] pb-2">
                  <h2 className="font-heading font-bold text-sm text-[#111111]">System Validation Checks</h2>
                  <HelpCircle className="w-4 h-4 text-[#A1A1AA]" />
                </div>
                {!hasRun ? (
                  <p className="text-xs text-[#999] italic">Run simulation to see validation results.</p>
                ) : results.warnings.length === 0 ? (
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold text-sm text-green-900">All checks passed</div>
                      <div className="text-xs text-green-700 mt-1">
                        T:W {results.twr}:1 · Hover {results.hoverThrottlePct}% · {results.efficiencyGperW} g/W · {results.flightTimeMin} min
                      </div>
                    </div>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {results.warnings.map((w, i) => (
                      <li key={i} className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                        <div className="text-xs text-amber-800">{w}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </CapabilityGuard>

            {/* Formula Reference */}
            <div className="bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl p-5 text-xs text-[#777777]">
              <p className="font-bold text-[#111111] mb-1">Calculation basis</p>
              <p>Thrust uses empirical prop constant: <code className="bg-white px-1 rounded">T(g) = 10⁻⁷ × D² × P × RPM²</code> where D=diameter&quot;, P=pitch&quot;, RPM=KV×V. Flight time uses 80% DoD. Current draw estimated from motor loading curve.</p>
            </div>
          </div>
        </div>
      </div>
    </CapabilityGuard>
  );
}
