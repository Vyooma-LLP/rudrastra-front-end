import type { FeatureKey } from './keys';
import { CAPABILITIES } from './capabilities';

/**
 * Validates the capability registry on startup to ensure:
 * 1. No missing dependencies (a capability requires a key that doesn't exist).
 * 2. No circular dependencies (A -> B -> A).
 * 3. Precomputes the full dependency closure for O(1) runtime lookups.
 */

// Global cache for the resolved dependency closure
const dependencyClosureCache = new Map<FeatureKey, Set<FeatureKey>>();

export function validateRegistryAndBuildClosure(): Map<FeatureKey, Set<FeatureKey>> {
  if (dependencyClosureCache.size > 0) {
    return dependencyClosureCache;
  }

  const capabilityMap = new Map(CAPABILITIES.map(c => [c.key, c]));

  // 1. Verify all dependencies actually exist
  for (const capability of CAPABILITIES) {
    for (const dep of capability.dependencies || []) {
      if (!capabilityMap.has(dep)) {
        throw new Error(
          `CapabilityRegistryError: Capability '${capability.key}' depends on '${dep}', which does not exist in the registry.`
        );
      }
    }
  }

  // 2. Detect cycles and build the closure
  // We use DFS to detect back-edges (cycles) and accumulate transitive dependencies.

  const visited = new Set<FeatureKey>();
  const visiting = new Set<FeatureKey>();

  function resolveDependencies(key: FeatureKey): Set<FeatureKey> {
    if (dependencyClosureCache.has(key)) {
      return dependencyClosureCache.get(key)!;
    }

    if (visiting.has(key)) {
      throw new Error(`CapabilityRegistryCycleError: Circular dependency detected involving '${key}'.`);
    }

    visiting.add(key);

    const capability = capabilityMap.get(key)!;
    const allDependencies = new Set<FeatureKey>();

    // Add direct dependencies
    for (const dep of capability.dependencies || []) {
      allDependencies.add(dep);
      
      // Recursively add transitive dependencies
      const transitiveDeps = resolveDependencies(dep);
      for (const tDep of transitiveDeps) {
        allDependencies.add(tDep);
      }
    }

    visiting.delete(key);
    visited.add(key);
    
    dependencyClosureCache.set(key, allDependencies);
    return allDependencies;
  }

  for (const capability of CAPABILITIES) {
    if (!visited.has(capability.key)) {
      resolveDependencies(capability.key);
    }
  }

  return dependencyClosureCache;
}

// Ensure the registry is validated at startup
validateRegistryAndBuildClosure();

/**
 * Returns the fully resolved dependency closure for a given capability.
 * This prevents recursively hitting PostgreSQL or doing runtime graph traversal.
 */
export function getDependencyClosure(key: FeatureKey): Set<FeatureKey> {
  const closure = dependencyClosureCache.get(key);
  if (!closure) {
    throw new Error(`CapabilityRegistryError: Unknown capability '${key}'`);
  }
  return closure;
}
