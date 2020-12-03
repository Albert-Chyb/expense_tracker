import { merge, Observable, of, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

/**
 * Config of the Cashable decorator.
 */
export interface ICashableConfig {
	/** Table name to save data to and retrieve data from. */
	tableName: string;
}

/**
 * An interface that should be implemented by all storage strategies.
 */
export interface ICashableStorageStrategy {
	/**
	 * Saves data locally to a table. Overwrites already existing data.
	 */
	create(tableName: string, data: any): any;

	/**
	 * Retrieves all locally saved data from a table.
	 */
	read(tableName: string): any;

	/**
	 * Removes all data from a table.
	 */
	delete(tableName: string): void;

	/**
	 * Removes all tables.
	 */
	destroy(): void;
}

/**
 * Strategy that saves data in LocalStorage.
 */
export class LocaleStorageStrategy implements ICashableStorageStrategy {
	private readonly usedTables: Set<string> = new Set();
	private readonly tablePrefix: string = 'cash-';

	create(tableName: string, data: any) {
		this.usedTables.add(tableName);
		localStorage.setItem(this.tablePrefix + tableName, JSON.stringify(data));
	}

	read(tableName: string): any {
		return JSON.parse(localStorage.getItem(this.tablePrefix + tableName));
	}

	delete(tableName: string) {
		localStorage.removeItem(this.tablePrefix + tableName);
	}

	destroy() {
		this.usedTables.forEach(tableName => this.delete(tableName));
	}
}

/**
 * Contains all subscriptions from all decorated methods.
 * They should be unsubscribed from when cash is destroyed.
 */
let globalSubscriptions = new Map<string, Subscription>();

/**
 * Chosen storage strategy.
 */
let storage: ICashableStorageStrategy = new LocaleStorageStrategy();

/**
 * Method decorator that cashes data inside of returned observable.
 * Decorated method has to return an observable !
 *
 * It connects local data and data returned from the method as one observable to which you can subscribe.
 * @param config Config
 */
export function Cashable(config: ICashableConfig) {
	return (target: any, key: string, descriptor: PropertyDescriptor) => {
		const originalMethod: () => Observable<any> = descriptor.value;

		descriptor.value = function (...args: any[]) {
			const localStream: Observable<any> = of(
				storage.read(config.tableName)
			).pipe(filter(value => value !== null));
			const originalStream: Observable<any> = originalMethod.call(this, args);

			if (!globalSubscriptions.has(config.tableName)) {
				globalSubscriptions.set(
					config.tableName,
					originalStream.subscribe(data =>
						storage.create(config.tableName, data)
					)
				);
			}

			return merge(originalStream, localStream);
		};

		return descriptor;
	};
}

/**
 * Removes all cashed data
 */
export function destroyCash() {
	storage.destroy();
	globalSubscriptions.forEach(s => s.unsubscribe());
	globalSubscriptions.clear();
}
