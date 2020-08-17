import * as functions from 'firebase-functions';
import { firestore } from 'firebase-admin';

const db = firestore();
const transactionRef = functions.firestore.document(
	'users/{userId}/transactions/{transactionId}'
);

/**
 * If group property of an transaction contains id of a group, then populate it with actual group data.
 */

export const populateNewTransactionGroup = transactionRef.onCreate(
	async (snap, context) => {
		const transaction = snap.data() as any;

		// Check if transaction' group requires population.
		if (!transaction.group || typeof transaction.group !== 'string')
			return null;

		const group = await db
			.doc(`users/${context.params.userId}/groups/${transaction.group}`)
			.get();

		// If requested group does not exists at the time this function runs, then something went wrong.
		if (!group.exists) return console.error('No group with given ID !');

		return snap.ref.set({ group: group.data() }, { merge: true });
	}
);

export const populateUpdatedTransactionGroup = transactionRef.onUpdate(
	async (change, context) => {
		const transactionAfter = change.after.data(); // Transaction after change
		const transactionBefore = change.before.data(); // Transaction before change

		// Check if transaction' group requires population.
		if (
			typeof transactionAfter.group !== 'string' ||
			transactionAfter.group === transactionBefore.group.id
		)
			return null;

		const group = await db
			.doc(`users/${context.params.userId}/groups/${transactionAfter.group}`)
			.get();

		// If requested group does not exists at the time this function runs, then something went wrong.
		if (!group.exists) return console.error('No group with given ID !');

		return change.after.ref.set({ group: group.data() }, { merge: true });
	}
);
