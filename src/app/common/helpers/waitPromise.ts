/**
 * Resolves returned promise after given duration.
 * @param duration Time in milliseconds
 */

export function waitPromise(duration: number): Promise<void> {
	return new Promise((resolve, reject) => {
		setTimeout(resolve, duration);
	});
}
