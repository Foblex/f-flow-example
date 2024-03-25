export function generateId(prefix: string): string {
  return `${ prefix }-${ Math.random().toString(36).substr(2, 9) }`;
}
