import { NotFoundComponent } from './pages/not-found/not-found.component';
import { DataUnavailableGuard } from './guards/data-unavailable/data-unavailable.guard';
import { DataAvailableGuard } from './guards/data-available/data-available.guard';
import { AddTransactionComponent } from './pages/add-transaction/add-transaction.component';
import { SetupAccountComponent } from './pages/setup-account/setup-account.component';
import { LoginComponent } from './pages/login/login.component';
import { PeriodsComponent } from './pages/periods/periods.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AppSettingsComponent } from './pages/app-settings/app-settings.component';
import { ManageGroupsComponent } from './pages/manage-groups/manage-groups.component';
import { AddGroupComponent } from './pages/add-group/add-group.component';
import { ManageTransactionComponent } from './pages/manage-transaction/manage-transaction.component';
import { HomeComponent } from './pages/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
	AngularFireAuthGuard,
	redirectUnauthorizedTo,
	redirectLoggedInTo,
} from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['']);

const routes: Routes = [
	{
		path: '',
		component: HomeComponent,
		data: { name: 'Strona główna' },
		canActivate: [DataAvailableGuard],
	},
	{
		path: 'manage-transaction/:id',
		component: ManageTransactionComponent,
		data: {
			name: 'Zarządzaj transakcją',
			authGuardPipe: redirectUnauthorizedToLogin,
		},
		canActivate: [AngularFireAuthGuard, DataAvailableGuard],
	},
	{
		path: 'add-transaction',
		component: AddTransactionComponent,
		data: {
			name: 'Dodaj transakcję',
			authGuardPipe: redirectUnauthorizedToLogin,
		},
		canActivate: [AngularFireAuthGuard, DataAvailableGuard],
	},
	{
		path: 'add-group',
		component: AddGroupComponent,
		data: {
			name: 'Dodaj nową grupę',
			authGuardPipe: redirectUnauthorizedToLogin,
		},
		canActivate: [AngularFireAuthGuard, DataAvailableGuard],
	},
	{
		path: 'manage-groups',
		component: ManageGroupsComponent,
		data: {
			name: 'Zarządzaj grupami',
			authGuardPipe: redirectUnauthorizedToLogin,
		},
		canActivate: [AngularFireAuthGuard, DataAvailableGuard],
	},
	{
		path: 'app-settings',
		component: AppSettingsComponent,
		data: { name: 'Ustawienia', authGuardPipe: redirectUnauthorizedToLogin },
		canActivate: [AngularFireAuthGuard, DataAvailableGuard],
	},
	{
		path: 'profile',
		component: ProfileComponent,
		data: { name: 'Profil', authGuardPipe: redirectUnauthorizedToLogin },
		canActivate: [AngularFireAuthGuard, DataAvailableGuard],
	},
	{
		path: 'periods',
		component: PeriodsComponent,
		data: { name: 'Okresy', authGuardPipe: redirectUnauthorizedToLogin },
		canActivate: [AngularFireAuthGuard, DataAvailableGuard],
	},
	{
		path: 'login',
		component: LoginComponent,
		data: { name: 'Zaloguj się', authGuardPipe: redirectLoggedInToHome },
		canActivate: [AngularFireAuthGuard],
	},
	{
		path: 'setup-account',
		component: SetupAccountComponent,
		data: {
			name: 'Zakończ rejestrację',
			authGuardPipe: redirectUnauthorizedToLogin,
		},
		canActivate: [DataUnavailableGuard, AngularFireAuthGuard],
	},
	{
		path: '**',
		component: NotFoundComponent,
		data: { name: 'Nie znaleziono strony' },
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
