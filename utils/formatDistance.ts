export function formatDistance(meters: number) {
  if (meters < 1000) {
    return `${meters}m`;
  } else {
    const kilometers = meters / 1000;
    return `${Number(kilometers.toFixed(1))}km`;
  }
}
