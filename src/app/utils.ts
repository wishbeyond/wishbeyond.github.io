export function deepEquals(a: any, b: any): boolean {
  if (a === b) return true; // Handle primitives and identical references

  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null)
    return false; // If one is not an object or null, they are not equal

  if (Array.isArray(a) !== Array.isArray(b)) return false; // One is an array, the other is not

  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => deepEquals(item, b[index])); // Check arrays recursively
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) return false; // Ensure same number of keys
  if (!keysA.every(key => keysB.includes(key))) return false; // Ensure same keys

  return keysA.every(key => deepEquals(a[key], b[key])); // Recursively compare values
}
