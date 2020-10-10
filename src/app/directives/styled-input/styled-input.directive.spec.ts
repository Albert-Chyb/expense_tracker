import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { StyledInputDirective } from './styled-input.directive';

@Component({
	template: `<input
		type="text"
		styledInput
		[placeholder]="placeholder"
		[formControl]="formControl"
	/>`,
})
class TestComponent {
	formControl = new FormControl();
	placeholder: string;
}

describe('StyledInputDirective', () => {
	let directive: StyledInputDirective;
	let fixture: ComponentFixture<TestComponent>;
	let component: TestComponent;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [StyledInputDirective, TestComponent],
			imports: [ReactiveFormsModule],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TestComponent);
		component = fixture.componentInstance;
		directive = new StyledInputDirective(null, null);
	});

	describe('onBlur', () => {
		it('should set isFocused property to false', () => {
			directive.isFocused = null;

			directive.onBlur();

			expect(directive.isFocused).toBeFalsy();
		});
	});

	describe('onFocus', () => {
		it('should set isFocused property to true', () => {
			directive.isFocused = null;

			directive.onFocus();

			expect(directive.isFocused).toBeTruthy();
		});
	});

	describe('ngOnInit', () => {
		it('should set host element placeholder attribute to a string with space if host element does not have placeholder', () => {
			const de = fixture.debugElement.query(By.directive(StyledInputDirective));
			const el: HTMLInputElement = de.nativeElement;

			el.placeholder = '';
			fixture.detectChanges();

			expect(el.placeholder).toBe(' ');
		});
	});

	describe('placeholder', () => {
		it('should set host`s placeholder attribute to the value passed in the argument', () => {
			const de = fixture.debugElement.query(By.directive(StyledInputDirective));
			const el: HTMLInputElement = de.nativeElement;

			component.placeholder = 'aaa';
			fixture.detectChanges();

			expect(el.placeholder).toBe('aaa');
		});

		it('should set host`s placeholder attribute to string with a space if no value is passed', () => {
			const de = fixture.debugElement.query(By.directive(StyledInputDirective));
			const el: HTMLInputElement = de.nativeElement;

			component.placeholder = '';
			fixture.detectChanges();

			expect(el.placeholder).toBe(' ');
		});
	});
});
