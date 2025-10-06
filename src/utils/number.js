export function formatNumber(number) {
  return number?.toLocaleString?.(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
