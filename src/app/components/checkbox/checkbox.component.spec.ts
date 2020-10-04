import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxComponent } from './checkbox.component';
import { By } from '@angular/platform-browser';

fdescribe('CheckboxComponent', () => {
	let component: CheckboxComponent;
	let fixture: ComponentFixture<CheckboxComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [CheckboxComponent],
			imports: [FormsModule],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CheckboxComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('input`s bindings', () => {
		it('should bound id property to input`s id attribute', () => {
			const selector = '.checkbox__vanilla-checkbox';
			const de = fixture.debugElement.query(By.css(selector));
			const el: HTMLInputElement = de.nativeElement;

			component.id = 'a';
			fixture.detectChanges();

			expect(el.id).toBe('a');
		});

		it('should call check() method whenever change event is fired on the input and pass input`s value as argument', () => {
			const selector = '.checkbox__vanilla-checkbox';
			const de = fixture.debugElement.query(By.css(selector));
			const el: HTMLInputElement = de.nativeElement;
			const spy = spyOn(component, 'check');

			el.checked = true;
			el.dispatchEvent(new Event('change'));

			expect(spy).toHaveBeenCalledWith(true);
		});
	});

	describe('label`s bindings', () => {
		it('should bound id property to label`s for attribute', () => {
			const de = fixture.debugElement.query(By.css('.checkbox__label'));
			const el: HTMLLabelElement = de.nativeElement;

			component.id = 'a';
			fixture.detectChanges();

			expect(el.getAttribute('for')).toBe('a');
		});
	});

	describe('writeValue', () => {
		it('should set isChecked property to the value passed in the argument', () => {
			component.isChecked = false;
			component.writeValue(true);
			expect(component.isChecked).toBeTruthy();

			component.isChecked = true;
			component.writeValue(false);
			expect(component.isChecked).toBeFalsy();
		});
	});

	describe('registerOnChange', () => {
		it('should set onChange property to the value passed in the argument', () => {
			const fakeValue = () => null as any;

			component['onChange'] = null;
			component.registerOnChange(fakeValue);

			expect(component['onChange']).toEqual(fakeValue);
		});
	});

	describe('registerOnTouched', () => {
		it('should set onTouched property to the value passed in the argument', () => {
			const fakeValue = () => null as any;

			component['onTouched'] = null;
			component.registerOnTouched(fakeValue);

			expect(component['onTouched']).toEqual(fakeValue);
		});
	});

	describe('setDisabledState', () => {
		it('should set isDisabled property to the value passed in the argument', () => {
			component.isDisabled = false;
			component.setDisabledState(true);
			expect(component.isDisabled).toBeTruthy();

			component.isDisabled = true;
			component.setDisabledState(false);
			expect(component.isDisabled).toBeFalsy();
		});
	});

	describe('check', () => {
		it('should return null if isDisabled property is set to true', () => {
			component.isDisabled = true;
			const result = component.check(true);

			expect(result).toBeNull();
		});

		it('should call onChange() method and pass to it received argument`s value', () => {
			component.registerOnChange(() => null);
			component.registerOnTouched(() => null);
			const spy = spyOn(component as any, 'onChange');

			component.isDisabled = false;
			component.check(true);

			expect(spy).toHaveBeenCalledWith(true);
		});

		it('should call onTouched() method', () => {
			component.registerOnChange(() => null);
			component.registerOnTouched(() => null);
			const spy = spyOn(component as any, 'onTouched');

			component.isDisabled = false;
			component.check(true);

			expect(spy).toHaveBeenCalled();
		});
	});
});
