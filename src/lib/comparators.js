export function randomSort(items, seed) {
  return [...items].sort(
    (i1, i2) => Math.sin(seed + i1.id) - Math.sin(seed + i2.id),
  );
}
