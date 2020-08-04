/**
 * Groups array of objects by given key.
 * @param data Array of objects to group
 * @param key Key to group objects
 */

export default function groupBy<T>(data: T[], key: string): Map<string, T[]> {
	const groupedData = new Map<string, T[]>();

	data.forEach(item => {
		const itemValue = item[key];

		if (!groupedData.has(itemValue)) groupedData.set(itemValue, []);

		groupedData.get(itemValue).push(item);
	});

	return groupedData;
}
