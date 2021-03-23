import { Injectable, Injector } from '@angular/core';

import { CRUDMixins } from '../collection-base/collection-base';
import { Create, Delete, Read } from '../collection-base/models';
import { ITransactionGroup } from './../../common/models/group';

interface AttachedMethods
	extends Create<ITransactionGroup>,
		Read<ITransactionGroup>,
		Delete {}

@Injectable({
	providedIn: 'root',
})
export class TransactionsGroupsService extends CRUDMixins<AttachedMethods>(
	'c',
	'r',
	'd'
) {
	constructor(injector: Injector) {
		super('groups', injector);
	}
}
