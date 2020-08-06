import * as functions from 'firebase-functions';
import { firestore } from 'firebase-admin';

const db = firestore();
const transactionRef = functions.firestore.document(
	'users/{userId}/transactions/{transactionId}'
);
/**
 * If group property of an transaction contains id of a group, then populate it with actual group data.
 */

export const populateTransactionGroup = transactionRef.onCreate(
	async (snap, context) => {
		const transaction = snap.data() as any;

		// If group property is not a string id, then do nothing.
		if (typeof transaction.group !== 'string') return null;

		const group = await db
			.collection('users')
			.doc(context.params.userId)
			.collection('groups')
			.doc(transaction.group)
			.get();
		// If there is no group with given ID, then something went wrong.
		if (!group.exists) return console.error('No group with given ID !');

		return snap.ref.set({ group: group.data() }, { merge: true });
	}
);
