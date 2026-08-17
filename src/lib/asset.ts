/**
 * Public-folder assets are not rewritten by Next when `basePath` is set, so
 * every hand-written href to /public goes through here.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function asset(path: string): string {
  return `${basePath}${path}`;
}
