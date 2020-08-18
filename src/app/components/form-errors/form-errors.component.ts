import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { formErrorAnimation } from 'src/app/animations';
import { StateMatcher } from 'src/app/common/models/stateMatcher';

import { FormErrorsService } from './../../services/form-errors/form-errors.service';

@Component({
	selector: 'form-errors',
	templateUrl: './form-errors.component.html',
	styleUrls: ['./form-errors.component.scss'],
	animations: [formErrorAnimation],
})
export class FormErrorsComponent implements OnInit, OnDestroy {
	constructor(private readonly formErrors: FormErrorsService) {}
	private controlSubscription: Subscription;
	errors: string[] = [];

	@Input('control') control: FormControl;
	@Input('stateMatcher') private stateMatcher = new StateMatcher();

	ngOnInit() {
		if (this.control)
			this.controlSubscription = this.control.statusChanges.subscribe(
				this.renderErrors.bind(this)
			);
	}

	ngOnDestroy() {
		this.controlSubscription.unsubscribe();
	}

	private renderErrors() {
		this.errors = [];
		if (this.stateMatcher.match(this.control)) return;
		Object.keys(this.control.errors).forEach(errorName => {
			const error = this.formErrors.get(errorName);
			this.errors.push(error);
		});
	}
}
