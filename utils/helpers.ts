export const truncateText = (text: string, maxLength: number) => {
  if (text) {
    const textWithoutUnderscores = text.replace(/_/g, " ");
    if (textWithoutUnderscores.length > maxLength) {
      return textWithoutUnderscores.substring(0, maxLength) + "...";
    }
    return textWithoutUnderscores;
  }
};

export const formatTime = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  }

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }

  return `${seconds}s`;
};

export const calculateTimerProgress = (duration: number, remainingTime: number): number => {
  if (duration === 0) return 0;
  return Math.min(100, ((duration - remainingTime) / duration) * 100);
};

export const getTimerUpdateInterval = (lastUpdated: number | undefined, now: number): number => {
  if (!lastUpdated) return 1;
  const elapsed = Math.floor((now - lastUpdated) / 1000);
  return Math.max(1, elapsed);
};
