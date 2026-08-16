export function durationToSeconds(
  duration: string,
): number {
  const match = duration.match(/^(\d+)([smhd])$/);

  if (!match) {
    throw new Error(
      `Invalid duration format: ${duration}`,
    );
  }

  const value = Number(match[1]);
  const unit = match[2];

  switch (unit) {
    case "s":
      return value;

    case "m":
      return value * 60;

    case "h":
      return value * 60 * 60;

    case "d":
      return value * 60 * 60 * 24;

    default:
      throw new Error(
        `Unsupported duration unit: ${unit}`,
      );
  }
}