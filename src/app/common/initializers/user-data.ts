import { UserService } from './../../services/user/user.service';

/**
 * Returns a function that returns a promise resolved when app finished determining if user has created his data.
 * @param user User service
 * @param auth Auth service
 */
export function UserDataInitializer(user: UserService): () => Promise<any> {
	return () => user.hasCreatedData;
}
