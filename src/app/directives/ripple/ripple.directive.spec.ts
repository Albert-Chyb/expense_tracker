import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RippleDirective } from './ripple.directive';
import { waitPromise } from '../../common/helpers/waitPromise';

@Component({
	template: `<button ripple>Test</button>`,
})
class TestComponent {}

describe('RippleDirective', () => {
	let component: TestComponent;
	let fixture: ComponentFixture<TestComponent>;
	let directive: RippleDirective;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [RippleDirective, TestComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TestComponent);
		component = fixture.componentInstance;
		directive = fixture.debugElement
			.query(By.directive(RippleDirective))
			.injector.get(RippleDirective);
		fixture.detectChanges();
	});

	describe('positionRipple', () => {
		it('should return null if isRippling is set to true', () => {
			directive['isRippling'] = true;

			expect(directive.positionRipple(null)).toBeNull();
		});

		it('should CSS variables on host element that centers it', done => {
			const de = fixture.debugElement.query(By.directive(RippleDirective));
			const el: HTMLButtonElement = de.nativeElement;
			const rippleSize = 100;
			const clientX = 10;
			const clientY = 70;

			el.style.setProperty('width', `${rippleSize}px`);
			el.style.setProperty('height', `${rippleSize}px`);

			el.addEventListener('mousedown', $event => {
				const centerCoords = {
					x: $event.offsetX - rippleSize / 2,
					y: $event.offsetY - rippleSize / 2,
				};

				expect(el.style.getPropertyValue('--ripple-x')).toBe(
					`${centerCoords.x}px`
				);
				expect(el.style.getPropertyValue('--ripple-y')).toBe(
					`${centerCoords.y}px`
				);

				done();
			});

			el.dispatchEvent(
				new MouseEvent('mousedown', {
					clientX,
					clientY,
				})
			);
		});

		it('should add rippling class to the host element', () => {
			const de = fixture.debugElement.query(By.directive(RippleDirective));
			const el: HTMLButtonElement = de.nativeElement;

			el.style.setProperty('--ripple-duration', '100s');
			el.dispatchEvent(new MouseEvent('mousedown'));

			expect(el.classList.contains(directive['ripplingClass'])).toBeTruthy();
		});

		it('should set isRippling property to true', () => {
			const de = fixture.debugElement.query(By.directive(RippleDirective));
			const el: HTMLButtonElement = de.nativeElement;

			(directive as any)['animationDuration'] = Infinity;
			el.dispatchEvent(new MouseEvent('mousedown'));

			expect(directive['isRippling']).toBeTruthy();
		});

		it('should remove rippling class after animation finishes', async () => {
			const de = fixture.debugElement.query(By.directive(RippleDirective));
			const el: HTMLButtonElement = de.nativeElement;
			const duration = 1;

			(directive as any)['animationDuration'] = duration;
			el.style.setProperty('--ripple-duration', `${duration}ms`);
			el.dispatchEvent(new MouseEvent('mousedown'));

			expect(el.classList.contains(directive['ripplingClass'])).toBeTruthy();
			await waitPromise(duration);

			expect(el.classList.contains(directive['ripplingClass'])).toBeFalsy();
		});

		it('should set isRippling property to false after animation completes', async () => {
			const de = fixture.debugElement.query(By.directive(RippleDirective));
			const el: HTMLButtonElement = de.nativeElement;
			const duration = 1;

			(directive as any)['animationDuration'] = duration;
			el.style.setProperty('--ripple-duration', `${duration}ms`);
			el.dispatchEvent(new MouseEvent('mousedown'));

			await waitPromise(duration);

			expect(directive['isRippling']).toBeFalsy();
		});
	});

	describe('setRippleProperty', () => {
		it('should set CSS variables on host element with --ripple- prefix', () => {
			const de = fixture.debugElement.query(By.directive(RippleDirective));
			const el: HTMLButtonElement = de.nativeElement;

			directive['setRippleProperty']('x', '20px');
			expect(el.style.getPropertyValue('--ripple-x')).toBe('20px');
		});
	});

	describe('ngOnInit', () => {
		it('should set animation duration on host element', () => {
			const de = fixture.debugElement.query(By.directive(RippleDirective));
			const el: HTMLButtonElement = de.nativeElement;

			expect(el.style.getPropertyValue('--ripple-duration')).toBe(
				`${directive['animationDuration']}ms`
			);
		});
	});
});
