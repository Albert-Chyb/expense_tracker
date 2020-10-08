import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { environment } from './../../../environments/environment';
import { MainNavComponent } from './main-nav.component';

@Component({})
class FakeComponent {}

describe('MainNavComponent', () => {
	let component: MainNavComponent;
	let fixture: ComponentFixture<MainNavComponent>;
	let programmableLinkSelector: string;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MainNavComponent],
			imports: [
				AngularFireModule.initializeApp(environment.firebase),
				RouterTestingModule,
			],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MainNavComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	beforeEach(() => (programmableLinkSelector = '.main-nav__link:nth-child(3)'));

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('programmable link biddings', () => {
		it('should display text of the current button', () => {
			const de = fixture.debugElement.query(By.css(programmableLinkSelector));
			const el: HTMLLinkElement = de.nativeElement;

			component.button = {
				iconUnicode: '',
				description: 'aaa',
				route: '',
			};
			fixture.detectChanges();

			expect(el.innerText.trim()).toBe('aaa');
		});

		it('should point to the route described in button', () => {
			const de = fixture.debugElement.query(By.css(programmableLinkSelector));
			const el: HTMLLinkElement = de.nativeElement;

			component.button = {
				iconUnicode: '',
				description: 'aaa',
				route: '/route',
			};
			fixture.detectChanges();

			expect(el.getAttribute('href')).toBe('/route');
		});
	});

	describe('changeButton', () => {
		it('should set button property with the value passed in the argument', () => {
			component.button = '' as any;

			component.changeButton('btn' as any);

			expect(component.button).toBe('btn' as any);
		});
	});

	describe('restoreDefaultButton', () => {
		it('should set button property with the value of defaultButton property', () => {
			component.button = '' as any;

			component.restoreDefaultButton();

			expect(component.button).toBe(component['defaultButton']);
		});
	});

	describe('ngAfterViewInit', () => {
		it('should set css variable --icon on programmable link', () => {
			const de = fixture.debugElement.query(By.css(programmableLinkSelector));
			const el: HTMLLinkElement = de.nativeElement;

			component.button.iconUnicode = 'aaa';
			component.ngAfterViewInit();
			fixture.detectChanges();

			expect(el.style.getPropertyValue('--icon')).toBe('"aaa"');
		});
	});
});
