import { Subject } from 'rxjs';

export interface ILimitedArrayEvent<T> {
	item: T;
	action: 'delete' | 'add';
}

export class LimitedArray<T> {
	constructor(private readonly _maxLength: number) {}
	private readonly _array: T[] = [];
	private readonly _onAdd = new Subject<ILimitedArrayEvent<T>>();
	private readonly _onDelete = new Subject<ILimitedArrayEvent<T>>();

	add(newItem: T) {
		const isOverflowing = this._array.length >= this._maxLength;
		if (isOverflowing) {
			this.delete(this._array[0]);
		}

		this._array.push(newItem);
		this._onAdd.next({
			item: newItem,
			action: 'add',
		});
	}

	delete(item: T) {
		const itemIndex = this._array.indexOf(item);
		this._array.splice(itemIndex, 1);
		this._onDelete.next({
			item,
			action: 'delete',
		});
	}

	get onDelete() {
		return this._onDelete.pipe();
	}

	get onAdd() {
		return this._onAdd.pipe();
	}

	get array() {
		return this._array;
	}
}
