import { environment } from './../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

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
import { SelectComponent } from './components/select/select.component';
import { SelectItemComponent } from './components/select-item/select-item.component';

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
		SelectComponent,
		SelectItemComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		AngularFireModule.initializeApp(environment.firebase),
		AngularFirestoreModule,
		BrowserAnimationsModule,
		ReactiveFormsModule,
	],
	providers: [{ provide: LOCALE_ID, useValue: 'pl-PL' }],
	bootstrap: [AppComponent],
})
export class AppModule {}
