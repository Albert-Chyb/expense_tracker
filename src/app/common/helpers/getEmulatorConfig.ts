import { environment } from 'src/environments/environment';

export function getEmulatorConfig(
	type: 'firestore' | 'auth' | 'functions'
): [string, number] {
	const { host, port } = environment.firebaseEmulators[type];
	return environment.firebaseEmulators.enabled ? [host, port] : undefined;
}
