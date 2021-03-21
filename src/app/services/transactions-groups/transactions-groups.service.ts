import { Injectable, Injector } from '@angular/core';

import { CRUDBuilder } from '../collection-base/collection-base';
import { Create, Delete, Read } from '../collection-base/models';
import { ITransactionGroup } from './../../common/models/group';

interface AttachedMethods
	extends Create<ITransactionGroup>,
		Read<ITransactionGroup>,
		Delete {}

const Class = new CRUDBuilder().with('c', 'r', 'd').build<AttachedMethods>();

@Injectable({
	providedIn: 'root',
})
export class TransactionsGroupsService extends Class {
	constructor(injector: Injector) {
		super('groups', injector);
	}
}
