import { FormControl } from '@angular/forms';
import { FormFieldInputDirective } from './form-field-input.directive';

describe('FormFieldInputDirective', () => {
	let directive: FormFieldInputDirective;
	let nativeElement: HTMLInputElement;

	beforeEach(() => {
		nativeElement = document.createElement('input');

		directive = new FormFieldInputDirective(new FormControl('') as any, {
			nativeElement,
		});
	});

	describe('onContainerClick', () => {
		it('should focus input when called', () => {
			const spy = spyOn(directive['_hostEl'].nativeElement, 'focus');

			directive.onContainerClick();

			expect(spy).toHaveBeenCalled();
		});
	});

	describe('onStateChange', () => {
		it('should emit a value whenever input is focused', done => {
			directive.onStateChange.subscribe(() => {
				expect(true).toBeTrue();
				done();
			});

			nativeElement.dispatchEvent(new Event('focus'));
		});

		it('should emit a value whenever input is blurred', done => {
			directive.onStateChange.subscribe(() => {
				expect(true).toBeTrue();
				done();
			});

			nativeElement.dispatchEvent(new Event('blur'));
		});
	});
});
