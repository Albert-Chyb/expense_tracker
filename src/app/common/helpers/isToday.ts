/**
 * Check if passed timestamp contains the current day.
 * By default it uses local machine time,
 * if you don't want this behavior, you can pass your own today timestamp.
 *
 * @param timestamp Timestamp to check against.
 * @param todayTimestamp Timestamp of the current day.
 */

export default function isToday(
	timestamp: number,
	todayTimestamp?: number
): boolean {
	const today = todayTimestamp ? new Date(todayTimestamp) : new Date();
	const inputDate = new Date(timestamp);

	return today.setHours(0, 0, 0, 0) === inputDate.setHours(0, 0, 0, 0);
}
