import { AppSettingsComponent } from './pages/app-settings/app-settings.component';
import { ManageGroupsComponent } from './pages/manage-groups/manage-groups.component';
import { AddGroupComponent } from './pages/add-group/add-group.component';
import { ManageTransactionComponent } from './pages/manage-transaction/manage-transaction.component';
import { HomeComponent } from './pages/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
	{ path: '', component: HomeComponent, data: { name: 'Strona główna' } },
	{
		path: 'manage-transaction',
		component: ManageTransactionComponent,
		data: { name: 'Zarządzaj transakcją' },
	},
	{
		path: 'add-group',
		component: AddGroupComponent,
		data: { name: 'Dodaj nową grupę' },
	},
	{
		path: 'manage-groups',
		component: ManageGroupsComponent,
		data: { name: 'Zarządzaj grupami' },
	},
	{
		path: 'app-settings',
		component: AppSettingsComponent,
		data: { name: 'Ustawienia' },
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
