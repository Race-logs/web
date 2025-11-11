export const formatTime = (totalSeconds: number): string => {
  const totalMs = Math.round(totalSeconds * 1000);
  const hours = Math.floor(totalMs / 3_600_000);
  const minutes = Math.floor((totalMs % 3_600_000) / 60_000);
  const seconds = Math.floor((totalMs % 60_000) / 1000);
  const milliseconds = totalMs % 1000;

  const pad = (n: number, size = 2) => n.toString().padStart(size, "0");

  const base =
    hours > 0
      ? `${hours}:${pad(minutes)}'${pad(seconds)}"`
      : `${minutes}'${pad(seconds)}"`;

  return milliseconds
    ? `${base}.${milliseconds.toString().padStart(3, "0")}`
    : base;
};
