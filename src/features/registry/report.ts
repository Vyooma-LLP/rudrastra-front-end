import { CAPABILITIES } from './capabilities';
import { validateRegistryAndBuildClosure, getDependencyClosure } from './validator';
import type { FeatureKey } from './keys';

export function generateReconciliationReport(): string {
  const lines: string[] = [];
  
  lines.push('================================================================================');
  lines.push('                 CAPABILITY CONTROL PLANE RECONCILIATION REPORT                 ');
  lines.push('================================================================================');
  
  try {
    const closureCache = validateRegistryAndBuildClosure();
    
    lines.push('\n[OK] DAG VALIDATION SUCCESSFUL');
    lines.push(`     - 0 Missing Dependencies`);
    lines.push(`     - 0 Circular Dependencies`);
    lines.push(`     - ${CAPABILITIES.length} Capabilities Registered`);
    
    lines.push('\n--- EXHAUSTIVE DEPENDENCY CLOSURE ---');
    for (const capability of CAPABILITIES) {
      const closure = Array.from(getDependencyClosure(capability.key));
      lines.push(`\n[${capability.type}] ${capability.key}`);
      lines.push(`  ↳ Lifecycle: ${capability.lifecycle}`);
      lines.push(`  ↳ Transitive Dependencies (${closure.length}):`);
      for (const dep of closure) {
        lines.push(`      - ${dep}`);
      }
    }
    
    lines.push('\n================================================================================');
    lines.push('                      SYSTEM READY FOR DEPLOYMENT                               ');
    lines.push('================================================================================');
    
  } catch (error) {
    lines.push('\n[FAILED] DAG VALIDATION FAILED');
    lines.push(`\nERROR DETAILS:\n${error}`);
    lines.push('\n================================================================================');
    lines.push('                    DO NOT DEPLOY - REGISTRY CORRUPTED                          ');
    lines.push('================================================================================');
  }
  
  return lines.join('\n');
}

// If run directly via ts-node or similar
if (require.main === module) {
  console.log(generateReconciliationReport());
}
