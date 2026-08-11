import { CAPABILITIES } from './src/features/registry/capabilities';
import { FeatureKey } from './src/features/registry/keys';

const visited = new Set<string>();
const stack = new Set<string>();

function dfs(key: string) {
  if (stack.has(key)) {
    console.log("CYCLE FOUND!", key, "Stack:", Array.from(stack));
    process.exit(1);
  }
  if (visited.has(key)) return;

  visited.add(key);
  stack.add(key);

  const def = CAPABILITIES.find(c => c.key === key);
  if (def && def.dependencies) {
    for (const dep of def.dependencies) {
      dfs(dep);
    }
  }

  stack.delete(key);
}

for (const cap of CAPABILITIES) {
  dfs(cap.key);
}
console.log("No cycles found.");
