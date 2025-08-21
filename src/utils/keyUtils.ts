// Key generation utilities to prevent React duplicate key errors

export const generateSafeKey = (
  primaryKey: string | number | undefined | null,
  fallbackValue: string | number,
  index?: number
): string => {
  // Ensure we always have a non-empty string key
  const safeKey = primaryKey?.toString().trim() || fallbackValue.toString()
  return index !== undefined ? `${safeKey}-${index}` : safeKey
}

export const generateArrayKey = (
  item: Record<string, unknown>,
  index: number,
  keyField?: string
): string => {
  // Try primary key field first, then fallback to index
  const primaryKey = keyField ? item[keyField] : (item.id || item.key || item.name || item.title)
  const safeKey = typeof primaryKey === 'string' || typeof primaryKey === 'number' ? primaryKey : null
  return generateSafeKey(safeKey, `item-${index}`, index)
}

// Common patterns for map functions with safe keys
export const mapWithSafeKeys = <T extends Record<string, unknown>>(
  array: T[],
  renderFn: (item: T, index: number, key: string) => React.ReactNode,
  keyField?: string
) => {
  return array.map((item, index) => {
    const key = generateArrayKey(item, index, keyField)
    return renderFn(item, index, key)
  })
}

// Validation helper
export const validateKeys = (keys: (string | number)[]): boolean => {
  const stringKeys = keys.map(k => k?.toString().trim()).filter(Boolean)
  const uniqueKeys = new Set(stringKeys)
  
  if (stringKeys.length !== uniqueKeys.size) {
    console.warn('Duplicate keys detected:', stringKeys)
    return false
  }
  
  if (stringKeys.some(key => !key || key === '')) {
    console.warn('Empty keys detected:', stringKeys)
    return false
  }
  
  return true
}
