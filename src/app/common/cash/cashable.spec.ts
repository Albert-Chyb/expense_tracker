import { of } from 'rxjs';

import {
	Cacheable,
	destroyCache,
	getStorageRef,
	ICacheableStorageStrategy,
} from './cashable';

const tableName = 'a';
const data = [1, 2, 3];

class TestClass {
	@Cacheable({ tableName })
	method() {
		return of(data);
	}
}
describe('Cache utilities', () => {
	let instance: TestClass;
	let storage: ICacheableStorageStrategy;

	beforeEach(() => {
		instance = new TestClass();
		storage = getStorageRef();
	});

	afterEach(() => {
		destroyCache();
	});

	describe('Cashable', () => {
		it('should save data emitted by method to storage', done => {
			instance.method().subscribe(data => {
				const cashed = storage.read(tableName);
				expect(cashed).toEqual(data);
				done();
			});
		});

		it('should merge cashed data with actual scream in one observable', done => {
			let index = 0;
			let emits = [];
			storage.create(tableName, [4, 5, 6]);

			instance.method().subscribe(result => {
				emits[index] = result;
				index++;

				if (emits.length === 2) {
					expect([...emits[0], ...emits[1]]).toEqual([1, 2, 3, 4, 5, 6]);
					done();
				}
			});
		});
	});

	describe('destroyCash', () => {
		it('should remove all cached data', () => {
			const spy = spyOn(storage, 'destroy');

			destroyCache();

			expect(spy).toHaveBeenCalled();
		});
	});
});
