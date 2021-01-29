import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';

import { FormFieldControl } from '../form-field-control';
import { FormFieldComponent } from './form-field.component';

describe('FormFieldComponent', () => {
	let component: FormFieldComponent;
	let fixture: ComponentFixture<FormFieldComponent>;
	let control: FormFieldControl;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [FormFieldComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(FormFieldComponent);
		component = fixture.componentInstance;
		control = {
			ngControl: new FormControl() as any,
			shouldLabelFloat: false,
			isFocused: false,
			onStateChange: new Subject(),
		};

		// Prevent Angular from setting the control field with the result of @ContentChild()
		// We provide our own fake FormFieldControl object
		Object.defineProperty(component, 'control', {
			set: () => {},
			get: () => control,
		});

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('TemplateBindings', () => {
		it('should have `form-field--disabled` class if isDisabled returns true', () => {
			const de = fixture.debugElement.query(By.css('.form-field'));
			const el = de.nativeElement as HTMLElement;

			spyOnProperty(component, 'isDisabled').and.returnValue(true);

			component['_changeDetector'].detectChanges();

			expect(el.classList.contains('form-field--disabled')).toBeTrue();
		});

		it('should have `form-field--focused` class if control is focused', () => {
			const de = fixture.debugElement.query(By.css('.form-field'));
			const el = de.nativeElement as HTMLElement;

			control.isFocused = true;

			component['_changeDetector'].detectChanges();

			expect(el.classList.contains('form-field--focused')).toBeTrue();
		});

		it('should have `form-field--touched` class if isTouched returns true', () => {
			const de = fixture.debugElement.query(By.css('.form-field'));
			const el = de.nativeElement as HTMLElement;

			spyOnProperty(component, 'isTouched').and.returnValue(true);

			component['_changeDetector'].detectChanges();

			expect(el.classList.contains('form-field--touched')).toBeTrue();
		});

		it('should have `form-field--invalid` class if isInvalid returns true', () => {
			const de = fixture.debugElement.query(By.css('.form-field'));
			const el = de.nativeElement as HTMLElement;

			spyOnProperty(component, 'isInvalid').and.returnValue(true);

			component['_changeDetector'].detectChanges();

			expect(el.classList.contains('form-field--invalid')).toBeTrue();
		});

		it('should have `form-field--valid` class if isValid returns true', () => {
			const de = fixture.debugElement.query(By.css('.form-field'));
			const el = de.nativeElement as HTMLElement;

			spyOnProperty(component, 'isValid').and.returnValue(true);

			component['_changeDetector'].detectChanges();

			expect(el.classList.contains('form-field--valid')).toBeTrue();
		});

		it('should have `form-field--label-should-float` class if shouldLabelFloat returns true', () => {
			const de = fixture.debugElement.query(By.css('.form-field'));
			const el = de.nativeElement as HTMLElement;

			spyOnProperty(component, 'shouldLabelFloat').and.returnValue(true);

			component['_changeDetector'].detectChanges();

			expect(
				el.classList.contains('form-field--label-should-float')
			).toBeTrue();
		});

		it('should call onClick method when if user clicked on the host element', () => {
			const spy = spyOn(component, 'onClick');

			fixture.debugElement.triggerEventHandler('click', null);

			expect(spy).toHaveBeenCalled();
		});
	});

	describe('onClick', () => {
		it('should call control`s onContainerClick method if it contains such method', () => {
			control.onContainerClick = () => null;
			const spy = spyOn(control, 'onContainerClick');
			const el = fixture.nativeElement as HTMLElement;

			component.onClick();

			expect(spy).toHaveBeenCalled();
		});
	});
});
