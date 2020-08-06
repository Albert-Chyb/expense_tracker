import { initializeApp } from 'firebase-admin';
initializeApp();

import { populateTransactionGroup } from './populateTransactionGroup';
import * as manageBalance from './manageUserBalance';
import { addDefaultGroups } from './addDefaultGroups';

export const manageBalanceOnCreate = manageBalance.onCreate;
export const manageBalanceOnUpdate = manageBalance.onUpdate;
export const manageBalanceOnDelete = manageBalance.onDelete;
export const populateTransactionOnCreate = populateTransactionGroup;
export const addDefaultGroupsOnCreate = addDefaultGroups;
