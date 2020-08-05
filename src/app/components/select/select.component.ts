import { Subscription } from 'rxjs';
import {
	animate,
	state,
	style,
	transition,
	trigger,
} from '@angular/animations';
import {
	AfterContentInit,
	Component,
	ContentChildren,
	forwardRef,
	OnInit,
	QueryList,
	HostListener,
	OnDestroy,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { SelectOption } from './../../common/models/selectItem';
import { SelectItemComponent } from './../select-item/select-item.component';

@Component({
	selector: 'app-select',
	templateUrl: './select.component.html',
	styleUrls: ['./select.component.scss'],
	animations: [
		trigger('listAnimation', [
			state(
				'hidden',
				style({
					height: 0,
					opacity: 0,
				})
			),
			transition('hidden => expanded', animate('200ms ease-out')),
			transition('expanded => hidden', animate('200ms ease-in')),
		]),
		trigger('arrowAnimation', [
			state('expanded', style({ transform: 'rotate(180deg)' })),
			transition('hidden <=> expanded', animate('200ms ease')),
		]),
	],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => SelectComponent),
			multi: true,
		},
	],
})
export class SelectComponent
	implements AfterContentInit, ControlValueAccessor, OnDestroy {
	constructor() {}

	@ContentChildren(SelectItemComponent) options: QueryList<SelectItemComponent>;

	isExpanded: boolean = false;
	isDisabled: boolean = false;
	selectedOption: SelectOption;
	private waitingOptionValue: string = '';
	private subscriptions = new Subscription();

	onChange: (newValue: any) => {};
	onTouched: () => {};

	toggleSelect() {
		this.isExpanded = !this.isExpanded;
		this.onTouched && this.onTouched();
	}

	closeSelect() {
		this.isExpanded = false;
	}

	openSelect() {
		this.isExpanded = true;
		this.onTouched && this.onTouched();
	}

	selectOption(option: SelectOption) {
		this.selectedOption = option;
		this.onChange && this.onChange(option.value);
		this.closeSelect();
	}

	ngAfterContentInit() {
		this.subscriptions.add(
			this.options.changes.subscribe(this.bindListeners.bind(this))
		);
		this.bindListeners();

		if (this.waitingOptionValue) this.writeValue(this.waitingOptionValue);
		else this.selectOption(this.options.first.item);
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}

	writeValue(value: string): void {
		if (!this.options) {
			this.waitingOptionValue = value;
			return;
		}
		const { item } =
			this.options.find(option => option.value === value) || this.options.first;
		this.selectOption(item);
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	setDisabledState?(isDisabled: boolean): void {
		this.isDisabled = isDisabled;
	}

	private bindListeners() {
		this.options.forEach(item =>
			item.onSelectEmitter.subscribe(this.selectOption.bind(this))
		);
	}
}
