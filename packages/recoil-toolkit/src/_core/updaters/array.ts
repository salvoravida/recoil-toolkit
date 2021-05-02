export const reverse = <T>(s: T[]) => s.slice().reverse();

export const filter = <T>(predicate: (value: T, index: number, array: T[]) => boolean) => (
   s: T[],
) => s.filter(predicate);

export const push = <T>(item: T, maxSize?: number) => (s: T[]) =>
   maxSize === undefined || s.length < maxSize
      ? [...s, item]
      : [...[...s, item].slice(s.length + 1 - maxSize, s.length + 1)];

export const unshift = <T>(item: T, maxSize?: number) => (s: T[]) =>
   maxSize === undefined || s.length < maxSize ? [item, ...s] : [item, ...s.slice(0, maxSize - 1)];

export const updateObj = <T extends { [k: string]: any }>(item: Partial<T>, match: Partial<T>) => (
   s: T[],
) => s.map(el => (Object.keys(match).every(k => match[k] === el[k]) ? { ...el, ...item } : el));

export const removeObj = <T extends { [k: string]: any }>(match: Partial<T>) =>
   filter<T>(el => !Object.keys(match).every(k => match[k] === el[k]));

//alias
export const pushTop = unshift;
