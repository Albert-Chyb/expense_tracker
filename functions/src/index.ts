import { initializeApp } from 'firebase-admin';
initializeApp();

export { addDefaultGroups } from './addDefaultGroups';
export { autoEndPeriod } from './autoEndPeriod';
export { manageDate } from './managePeriodDate';
export {
	populateNewTransactionGroup,
	populateUpdatedTransactionGroup,
} from './populateTransactionGroup';
export {
	manageBalanceOnCreate,
	manageBalanceOnUpdate,
	manageBalanceOnDelete,
} from './manageUserBalance';
