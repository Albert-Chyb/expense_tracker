import { PortalModule } from '@angular/cdk/portal';
import {
	APP_INITIALIZER,
	ErrorHandler,
	LOCALE_ID,
	NgModule,
} from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { AngularFirestoreModule, SETTINGS } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';

import { environment } from './../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GlobalErrorHandler } from './common/errors/globalErrorHandler';
import { UserDataInitializer } from './common/initializers/user-data';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { ClueComponent } from './components/clue/clue.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { DialogContainerComponent } from './components/dialog-container/dialog-container.component';
import { FormFieldModule } from './components/form-field/form-field.module';
import { FormSelectModule } from './components/form-select/form-select.module';
import { GroupIconComponent } from './components/group-icon/group-icon.component';
import { LoaderComponent } from './components/loader/loader.component';
import { MainHeaderComponent } from './components/main-header/main-header.component';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { NotificationComponent } from './components/notification/notification.component';
import { OverlayComponent } from './components/overlay/overlay.component';
import { SummaryCardComponent } from './components/summary-card/summary-card.component';
import { TransactionCardComponent } from './components/transaction-card/transaction-card.component';
import { TransactionGroupComponent } from './components/transaction-group/transaction-group.component';
import { ZippyModule } from './components/zippy-components/zippy.module';
import { ConfirmActionDirective } from './directives/confirm-action/confirm-action.directive';
import { RippleDirective } from './directives/ripple/ripple.directive';
import { FormFieldErrorsModule } from './form-field-errors.module';
import { AddGroupComponent } from './pages/add-group/add-group.component';
import { AddTransactionComponent } from './pages/add-transaction/add-transaction.component';
import { AppSettingsComponent } from './pages/app-settings/app-settings.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ManageGroupsComponent } from './pages/manage-groups/manage-groups.component';
import { ManageTransactionComponent } from './pages/manage-transaction/manage-transaction.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PeriodsComponent } from './pages/periods/periods.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SetupAccountComponent } from './pages/setup-account/setup-account.component';
import { ExposedInjector } from './services/dialog/dialog.service';
import { UserService } from './services/user/user.service';
import { DatepickerModule } from './components/datepicker/datepicker.module';

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		SummaryCardComponent,
		TransactionCardComponent,
		MainHeaderComponent,
		ManageTransactionComponent,
		TransactionGroupComponent,
		GroupIconComponent,
		AddGroupComponent,
		ManageGroupsComponent,
		AppSettingsComponent,
		ProfileComponent,
		PeriodsComponent,
		LoginComponent,
		SetupAccountComponent,
		RippleDirective,
		AddTransactionComponent,
		NotFoundComponent,
		CheckboxComponent,
		ClueComponent,
		MainNavComponent,
		LoaderComponent,
		NotificationComponent,
		OverlayComponent,
		ConfirmDialogComponent,
		DialogContainerComponent,
		ConfirmActionDirective,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		AngularFireModule.initializeApp(environment.firebase),
		AngularFirestoreModule,
		AngularFireAuthModule,
		BrowserAnimationsModule,
		ReactiveFormsModule,
		MatDatepickerModule,
		MatFormFieldModule,
		MatNativeDateModule,
		MatInputModule,
		AngularFireAuthGuardModule,
		FormsModule,
		ServiceWorkerModule.register('ngsw-worker.js', {
			enabled: environment.production,
		}),
		PortalModule,
		FormFieldModule,
		FormFieldErrorsModule,
		FormSelectModule,
		ZippyModule,
		DatepickerModule,
	],
	providers: [
		{ provide: LOCALE_ID, useValue: 'pl-PL' },
		MatDatepickerModule,
		{
			provide: SETTINGS,
			useValue: environment.firebaseEmulators.enabled
				? environment.firebaseEmulators.firestore
				: undefined,
		},
		{ provide: ErrorHandler, useClass: GlobalErrorHandler },
		{
			provide: APP_INITIALIZER,
			multi: true,
			useFactory: user => UserDataInitializer(user),
			deps: [UserService],
		},
		ExposedInjector,
	],
	bootstrap: [AppComponent],
})
export class AppModule {
	constructor(exposedInjector: ExposedInjector) {}
}
