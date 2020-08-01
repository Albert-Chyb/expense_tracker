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
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
