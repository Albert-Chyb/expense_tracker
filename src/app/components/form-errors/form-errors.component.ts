import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { StateMatcher } from 'src/app/common/models/stateMatcher';

import { FormErrorsService } from './../../services/form-errors/form-errors.service';
import { transition, trigger, style, animate } from '@angular/animations';

@Component({
	selector: 'form-errors',
	templateUrl: './form-errors.component.html',
	styleUrls: ['./form-errors.component.scss'],
	animations: [
		trigger('errorAnimation', [
			transition(':enter', [
				style({
					transform: 'translateY(-100%)',
				}),
				animate(
					'200ms ease-out',
					style({ transform: 'translateY(0%)', opacity: 1 })
				),
			]),
			transition(':leave', [
				style({
					transform: 'translateY(-100%)',
					position: 'absolute',
					top: 0,
					left: 0,
				}),
				animate(
					'200ms ease-in',
					style({ transform: 'translateY(0%)', opacity: 0 })
				),
			]),
		]),
	],
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
