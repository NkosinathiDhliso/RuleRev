/**
 * A tiny utility for constructing className strings conditionally
 * Lightweight alternative to classnames/clsx
 */

type ClassValue = string | number | boolean | undefined | null | ClassArray | ClassDict;
type ClassArray = ClassValue[];
type ClassDict = Record<string, any>;

export function clsx(...classes: ClassValue[]): string {
  const result: string[] = [];

  for (const cls of classes) {
    if (!cls) continue;

    const type = typeof cls;

    if (type === 'string' || type === 'number') {
      result.push(cls as string);
    } else if (type === 'object') {
      if (Array.isArray(cls)) {
        const inner = clsx(...cls);
        if (inner) result.push(inner);
      } else {
        for (const key in cls as ClassDict) {
          if ((cls as ClassDict)[key]) result.push(key);
        }
      }
    }
  }

  return result.join(' ');
}