export async function fetchAll(
  generator,
  setResult,
  setStartLoading,
  removeOld,
) {
  setStartLoading();
  let done = false;
  let results = [];
  let counter = 0;
  while (!done) {
    let value = [];
    ({ value, done } = await generator.next());
    results.push(...value);
    if (++counter % 5 === 0) {
      setResult(results);
      results = [];
    }
  }
  setResult(results);
  removeOld();
}
