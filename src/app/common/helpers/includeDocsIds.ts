import { DocumentChangeAction } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

export function includeDocsIds<T>() {
	return map((docs: DocumentChangeAction<T>[]) =>
		docs.map(doc => ({
			...doc.payload.doc.data(),
			id: doc.payload.doc.id,
		}))
	);
}
