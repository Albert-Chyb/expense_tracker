/**
 * Groups array of objects by given key.
 * Field normalizer function contains logic to transform value in key field.
 * @param data Array of objects to group.
 * @param key Key to group objects.
 * @param fieldNormalizer Normalizes field value.
 */

export default function groupBy<T>(
	data: T[],
	key: string,
	fieldNormalizer?: any
): Map<string, T[]> {
	const groupedData = new Map<string, T[]>();

	data.forEach(item => {
		let itemValue = item[key];
		itemValue = fieldNormalizer ? fieldNormalizer(itemValue) : itemValue;

		if (!groupedData.has(itemValue)) groupedData.set(itemValue, []);

		groupedData.get(itemValue).push(item);
	});

	return groupedData;
}
