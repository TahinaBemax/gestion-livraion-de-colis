export function convertEmptyToUndefined(value: any): any {
  if (value === null || value === undefined) {
    return undefined;
  }
  
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '' || trimmed.toLowerCase() === 'null') {
      return undefined;
    }
    return trimmed;
  }
  
  return value;
}