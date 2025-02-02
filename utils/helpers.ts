export const truncateText = (text: string, maxLength: number) => {
    if (text) {
        const textWithoutUnderscores = text.replace(/_/g, " ");
        if (textWithoutUnderscores.length > maxLength) {
            return textWithoutUnderscores.substring(0, maxLength) + "...";
        } else {
            return textWithoutUnderscores;
        }
    }
};

export const formatTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds}s`
    }
  
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
  
    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`
    }
  
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`
    }
  
    return `${seconds}s`
  }

export const calculateTimerProgress = (duration: number, remainingTime: number): number => {
  if (duration === 0) return 0;
  return Math.min(100, ((duration - remainingTime) / duration) * 100);
};

export const getTimerUpdateInterval = (lastUpdated: number | undefined, now: number): number => {
  if (!lastUpdated) return 1;
  const elapsed = Math.floor((now - lastUpdated) / 1000);
  return Math.max(1, elapsed);
};

export const validateDuration = (value: string): { isValid: boolean; error?: string } => {
  if (!value) {
    return { isValid: false, error: 'Duration is required' };
  }

  if (!/^\d*$/.test(value)) {
    return { isValid: false };
  }

  const durationNum = parseInt(value);
  if (value.length > 5) {
    return { isValid: false, error: 'Duration is too long' };
  }
  if (isNaN(durationNum) || durationNum <= 0) {
    return { isValid: false, error: 'Duration must be a positive number' };
  }
  if (durationNum > 86400) {
    return { isValid: false, error: 'Duration cannot exceed 24 hours' };
  }
  return { isValid: true };
};

export const validateCategory = (value: string, customCategory: string, maxLength: number): { isValid: boolean; error?: string } => {
  if (!value.trim()) {
    return { isValid: false, error: 'Category is required' };
  }
  if (value === 'Custom' && !customCategory.trim()) {
    return { isValid: false, error: 'Please enter a custom category name' };
  }
  if (value.trim().length > maxLength) {
    return { isValid: false, error: `Category name cannot exceed ${maxLength} characters` };
  }
  return { isValid: true };
};
