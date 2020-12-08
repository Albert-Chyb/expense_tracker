import { initializeApp } from 'firebase-admin';
initializeApp();

import {
	populateNewTransactionGroup,
	populateUpdatedTransactionGroup,
} from './populateTransactionGroup';
import * as manageBalance from './manageUserBalance';
import { addDefaultGroups } from './addDefaultGroups';
import { autoEndPeriod } from './autoEndPeriod';
import { manageDate } from './managePeriodDate';

export const manageBalanceOnCreate = manageBalance.onCreate;
export const manageBalanceOnUpdate = manageBalance.onUpdate;
export const manageBalanceOnDelete = manageBalance.onDelete;
export const populateTransactionOnCreate = populateNewTransactionGroup;
export const populateTransactionOnUpdate = populateUpdatedTransactionGroup;
export const addDefaultGroupsOnCreate = addDefaultGroups;
export const autoEndPeriodOnDayBeginning = autoEndPeriod;
export const managePeriodDateOnCreate = manageDate;
