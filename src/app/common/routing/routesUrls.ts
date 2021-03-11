/**
 * Contains all routes urls within app.
 * All urls have slash before them.
 */

export enum Pages {
	/** Main page, where all summaries and transactions in current period are displayed */
	Home = '/',

	/**
	 * Page where a transaction's data can be changed
	 *
	 * Requires id param !
	 */
	ManageTransaction = '/manage-transaction',

	/** Page where a transaction can be added to database */
	AddTransaction = '/add-transaction',

	/** Page where a transaction group can be added to database */
	AddGroup = '/add-group',

	/** Page where all groups are displayed */
	ManageGroups = '/manage-groups',

	/** Page where app settings can be displayed and changed */
	AppSettings = '/app-settings',

	/** Page where information about user can be found, and further links */
	Profile = '/profile',

	/** Page where all periods are displayed */
	Periods = '/periods',

	/** Page where login action can be performed */
	Login = '/login',

	/** Page where initial data can be created */
	SetupAccount = '/setup-account',

	/** Page with dashboard */
	Dashboard = '/dashboard',

	/** 404 fallback */
	NotFound = '**',
}
