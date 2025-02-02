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

export const validateCategory = (
  value: string, 
  customCategory: string, 
  maxLength: number
): { isValid: boolean; error?: string } => {
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