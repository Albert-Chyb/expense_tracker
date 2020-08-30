import * as functions from 'firebase-functions';
import { firestore } from 'firebase-admin';
import * as moment from 'moment';

const db = firestore();

/**
 * This functions runs at the start of every day at midnight (00:01).
 * Checks each user if there is a need of closing current period and opening a new one.
 */

export const autoEndPeriod = functions.pubsub
	.schedule('0 0 * * *')
	.timeZone('Europe/Warsaw')
	.onRun(async context => {
		const users = await db.collection('users').listDocuments();

		users.forEach(async userDoc => {
			// Get users balance and settings
			const { settings, balance } = (await userDoc.get()).data() as any;

			// Get current period
			const activePeriod = (await getCurrentPeriod(userDoc)).data();
			// Check if current period is ended
			const isPeriodEnded = !!activePeriod.date.end;

			// If current period isn't ended and user is not interested in auto closing period - terminate the function.
			if (!isPeriodEnded && !settings.autoEndPeriod) return;

			// Additional information that will be included to every ended period.
			const closedPeriodStats = {
				isClosed: true,
				...(await calculateStats(userDoc, activePeriod)),
				balance,
			};

			// Calculate how many days have passed since start of current period.
			const periodStartDate = moment(activePeriod.date.start.toDate());
			const daysPassed = moment(Date.now()).diff(periodStartDate, 'days');
			// Check if passed enough days (based on user settings).
			const hasPassedEnoughDays = daysPassed >= settings.autoEndAfter;

			if (isPeriodEnded) {
				await closePeriod(userDoc, closedPeriodStats);
			} else if (settings.autoEndPeriod && hasPassedEnoughDays) {
				const stats = {
					...closedPeriodStats,
					'date.end': firestore.FieldValue.serverTimestamp(),
				};
				await closePeriod(userDoc, stats);
			}
		});
	});

/**
 * Closes currently closed period and inserts new open period.
 * @param userDoc User firestore document reference.
 * @param data Data that should be included in closed period.
 */

async function closePeriod(
	userDoc: firestore.DocumentReference<firestore.DocumentData>,
	data: any
) {
	const periodsCollection = userDoc.collection('periods');
	const activePeriodRef = await getCurrentPeriod(userDoc);

	await activePeriodRef.ref.update(data);
	return periodsCollection.add({
		isClosed: false,
		date: {
			start: firestore.FieldValue.serverTimestamp(),
		},
	});
}

/**
 * Returns currently opened period
 * @param userDoc User firebase document reference.
 */

async function getCurrentPeriod(
	userDoc: firestore.DocumentReference<firestore.DocumentData>
) {
	const periods = await userDoc
		.collection('periods')
		.where('isClosed', '==', false)
		.get();
	return periods.docs[0];
}

/**
 * Calculates stats in given period.
 * @param userDoc User firestore document reference
 * @param period Period that defines which transactions should participate in stats calculation.
 */

async function calculateStats(
	userDoc: firestore.DocumentReference<firestore.DocumentData>,
	period: any
) {
	const stats = {
		incomes: 0,
		outcomes: 0,
	};

	const transactions = await userDoc
		.collection('transactions')
		.where('date', '>=', period.date.start)
		.get();

	transactions.docs.forEach(transactionDoc => {
		const transaction = transactionDoc.data();
		const type = transaction.amount > 0 ? 'incomes' : 'outcomes';
		stats[type] += transaction.amount;
	});

	return stats;
}
