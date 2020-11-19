import { UserService } from './services/user/user.service';
import { UserDataInitializer } from './common/initializers/user-data';
import { GlobalErrorHandler } from './common/errors/globalErrorHandler';
import { FormErrorsDirective } from './directives/form-errors/form-errors.directive';
import { FormErrorsComponent } from './components/form-errors/form-errors.component';
import { environment } from './../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import {
	NgModule,
	LOCALE_ID,
	ErrorHandler,
	APP_INITIALIZER,
} from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, SETTINGS } from '@angular/fire/firestore';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

/*
	To speed up development process, app uses date picker and select component from Angular Material.
*/
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { SummaryCardComponent } from './components/summary-card/summary-card.component';
import { TransactionCardComponent } from './components/transaction-card/transaction-card.component';
import { MainHeaderComponent } from './components/main-header/main-header.component';
import { ManageTransactionComponent } from './pages/manage-transaction/manage-transaction.component';
import { StyledInputComponent } from './components/styled-input/styled-input.component';
import { StyledInputDirective } from './directives/styled-input/styled-input.directive';
import { StyledInputSuffixDirective } from './directives/styled-input-suffix/styled-input-suffix.directive';
import { TransactionGroupComponent } from './components/transaction-group/transaction-group.component';
import { GroupIconComponent } from './components/group-icon/group-icon.component';
import { AddGroupComponent } from './pages/add-group/add-group.component';
import { ManageGroupsComponent } from './pages/manage-groups/manage-groups.component';
import { AppSettingsComponent } from './pages/app-settings/app-settings.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { PeriodsComponent } from './pages/periods/periods.component';
import { LoginComponent } from './pages/login/login.component';
import { ZippyComponent } from './components/zippy-components/zippy/zippy.component';
import { ZippyStaticComponent } from './components/zippy-components/zippy-static/zippy-static.component';
import { ZippyContentComponent } from './components/zippy-components/zippy-content/zippy-content.component';
import { ZippyListComponent } from './components/zippy-components/zippy-list/zippy-list.component';
import { SetupAccountComponent } from './pages/setup-account/setup-account.component';
import { RippleDirective } from './directives/ripple/ripple.directive';
import { AddTransactionComponent } from './pages/add-transaction/add-transaction.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { ClueComponent } from './components/clue/clue.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { LoaderComponent } from './components/loader/loader.component';
import { NotificationComponent } from './components/notification/notification.component';
import { OverlayComponent } from './components/overlay/overlay.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { DialogContainerComponent } from './components/dialog-container/dialog-container.component';
import { PortalModule } from '@angular/cdk/portal';
import { ConfirmActionDirective } from './directives/confirm-action/confirm-action.directive';

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		SummaryCardComponent,
		TransactionCardComponent,
		MainHeaderComponent,
		ManageTransactionComponent,
		StyledInputComponent,
		StyledInputDirective,
		StyledInputSuffixDirective,
		TransactionGroupComponent,
		GroupIconComponent,
		AddGroupComponent,
		ManageGroupsComponent,
		AppSettingsComponent,
		ProfileComponent,
		PeriodsComponent,
		LoginComponent,
		ZippyComponent,
		ZippyStaticComponent,
		ZippyContentComponent,
		ZippyListComponent,
		SetupAccountComponent,
		RippleDirective,
		AddTransactionComponent,
		FormErrorsComponent,
		FormErrorsDirective,
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
		MatSelectModule,
		AngularFireAuthGuardModule,
		FormsModule,
		ServiceWorkerModule.register('ngsw-worker.js', {
			enabled: environment.production,
		}),
		PortalModule,
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
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
