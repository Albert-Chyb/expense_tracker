import * as functions from 'firebase-functions';

/**
 * It makes sure that every period's time is set to midnight.
 */
export const manageDate = functions.firestore
	.document('users/{userId}/periods/{periodId}')
	.onCreate((snap, context) => {
		const period = snap.data();
		const date = new Date(period.date.start.toDate().setHours(0, 0, 0, 0));

		return snap.ref.update({
			date: {
				start: date,
			},
		});
	});
