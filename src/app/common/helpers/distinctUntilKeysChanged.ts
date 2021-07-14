import { distinctUntilChanged } from 'rxjs/operators';

export function distinctUntilKeysChanged<T>(keys: string[]) {
	return distinctUntilChanged<T>((prev, curr) =>
		keys.every(watchedKey => prev[watchedKey] === curr[watchedKey])
	);
}
