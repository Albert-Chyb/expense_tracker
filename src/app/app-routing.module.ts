import { DataAvailableGuard } from './guards/data-available/data-available.guard';
import { AddTransactionComponent } from './pages/add-transaction/add-transaction.component';
import { UnAuthGuard } from './guards/un-auth/un-auth.guard';
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
import { AuthGuard } from './guards/auth/auth.guard';

const routes: Routes = [
	{
		path: '',
		component: HomeComponent,
		data: { name: 'Strona główna' },
		canActivate: [AuthGuard, DataAvailableGuard],
	},
	{
		path: 'manage-transaction/:id',
		component: ManageTransactionComponent,
		data: { name: 'Zarządzaj transakcją' },
		canActivate: [AuthGuard, DataAvailableGuard],
	},
	{
		path: 'add-transaction',
		component: AddTransactionComponent,
		data: { name: 'Dodaj transakcję' },
		canActivate: [AuthGuard, DataAvailableGuard],
	},
	{
		path: 'add-group',
		component: AddGroupComponent,
		data: { name: 'Dodaj nową grupę' },
		canActivate: [AuthGuard, DataAvailableGuard],
	},
	{
		path: 'manage-groups',
		component: ManageGroupsComponent,
		data: { name: 'Zarządzaj grupami' },
		canActivate: [AuthGuard, DataAvailableGuard],
	},
	{
		path: 'app-settings',
		component: AppSettingsComponent,
		data: { name: 'Ustawienia' },
		canActivate: [AuthGuard, DataAvailableGuard],
	},
	{
		path: 'profile',
		component: ProfileComponent,
		data: { name: 'Profil' },
		canActivate: [AuthGuard, DataAvailableGuard],
	},
	{
		path: 'periods',
		component: PeriodsComponent,
		data: { name: 'Okresy' },
		canActivate: [AuthGuard, DataAvailableGuard],
	},
	{
		path: 'login',
		component: LoginComponent,
		data: { name: 'Zaloguj się' },
		canActivate: [UnAuthGuard],
	},
	{
		path: 'setup-account',
		component: SetupAccountComponent,
		data: { name: 'Zakończ rejestrację' },
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
