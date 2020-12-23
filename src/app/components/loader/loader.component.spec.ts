import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { LoaderComponent } from './loader.component';

describe('LoaderComponent', () => {
	let component: LoaderComponent;
	let fixture: ComponentFixture<LoaderComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [LoaderComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(LoaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('classes', () => {
		it('should add `loader--fixed` class to loader element when isFixed property is set to true', () => {
			const de = fixture.debugElement.query(By.css('.loader-container'));
			const el: HTMLElement = de.nativeElement;

			component.isFixed = true;
			fixture.detectChanges();

			expect(el.classList.contains('loader-container--fixed')).toBeTruthy();
		});

		it('should add `loader--centered` class to loader element when isCenteredAbsolute property is set to true', () => {
			const de = fixture.debugElement.query(By.css('.loader-container'));
			const el: HTMLElement = de.nativeElement;

			component.isCenteredAbsolutely = true;
			fixture.detectChanges();

			expect(el.classList.contains('loader-container--centered')).toBeTruthy();
		});
	});
});
