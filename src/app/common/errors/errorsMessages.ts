/**
 * Contains errors messages that should be displayed to the user.
 */

export enum ErrorsMessages {
	/**
	 * Associated with `auth/popup-closed-by-user` error
	 */
	PopupClosedByUser = 'Za wcześnie zamknięto okno logowania.',

	/**
	 * Associated with `auth/popup-blocked` error
	 */
	PopupBlocked = 'Okno logowania zostało zablokowane przez przeklądarkę.',

	/**
	 * Associated with `auth/cancelled-popup-request` error
	 */
	CancelledPopupRequest = 'Anulowano działanie okna logowania. Tylko jedno okno może być aktywne w tym samym czasie.',
}
