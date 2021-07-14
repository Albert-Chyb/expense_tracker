/**
 * Picks properties from source object, that are listed in keys array.
 * If property does not exist, it won't be included.
 */

export const pick = <T>(source: T, keys: Array<keyof T>) =>
	Object.fromEntries(
		Object.entries(source).filter(([key]) => keys.includes(<any>key))
	);
