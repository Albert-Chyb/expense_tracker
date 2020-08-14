import * as functions from 'firebase-functions';
import { firestore } from 'firebase-admin';

const db = firestore();

export const deleteUserData = functions.auth
	.user()
	.onDelete(async (user, context) => {
		const dataRef = db.doc(`users/${user.uid}`);
		const data = await dataRef.get();

		if (!data.exists) return null;

		return dataRef.delete();
	});
