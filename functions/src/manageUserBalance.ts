import * as functions from 'firebase-functions';
import { firestore } from 'firebase-admin';

const db = firestore();
const transactionRef = functions.firestore.document(
	'users/{userId}/transactions/{transactionId}'
);

/**
 * Increases or decreases user balance based on passed amount.
 * @param id Id of an user
 * @param amount Amount to update the balance with.
 */
const updateUserBalance = async (id: string, amount: number) => {
	if (amount === 0) return null;

	const userRef = await db.collection('users').doc(id).get();
	if (!userRef.exists) return null;

	const user = userRef.data() as any;

	return userRef.ref.set({ balance: user.balance + amount }, { merge: true });
};

/**
 * Updates user's balance whenever a transaction is created.
 */

export const onCreate = transactionRef.onCreate((snap, context) => {
	const transaction = snap.data();

	return updateUserBalance(context.params.userId, transaction.amount);
});

/**
 * Updates user's balance whenever a transaction is updated.
 */

export const onUpdate = transactionRef.onUpdate((snap, context) => {
	const transactionBefore = snap.before.data();
	const transactionAfter = snap.after.data();

	// If transaction amount is not changed, then no further actions are required.
	if (transactionAfter.amount === transactionBefore.amount) return null;

	const balance = (transactionBefore.amount - transactionAfter.amount) * -1;

	return updateUserBalance(context.params.userId, balance);
});

/**
 * Updates user's balance whenever a transaction is deleted.
 */

export const onDelete = transactionRef.onDelete(async (snap, context) => {
	const transaction = snap.data();

	return updateUserBalance(context.params.userId, transaction.amount * -1);
});
