export function formatCredits(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '— ⚡';
  }
  const n = Number(value);
  return `${n.toLocaleString('en-US')} ⚡`;
}
