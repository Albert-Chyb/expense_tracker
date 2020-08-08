import { map } from 'rxjs/internal/operators/map';
import { ITransactionGroup } from '../models/group';
import { DocumentSnapshot, Action } from '@angular/fire/firestore/interfaces';

export function includeDocId<T>() {
	return map((doc: Action<DocumentSnapshot<ITransactionGroup>>) => ({
		...doc.payload.data(),
		id: doc.payload.id,
	}));
}
