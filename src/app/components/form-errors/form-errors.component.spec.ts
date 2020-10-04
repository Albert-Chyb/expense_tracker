import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormErrorsService } from './../../services/form-errors/form-errors.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormErrorsComponent } from './form-errors.component';
import { FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('FormErrorsComponent', () => {
	let component: FormErrorsComponent;
	let fixture: ComponentFixture<FormErrorsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [FormErrorsComponent],
			imports: [BrowserAnimationsModule],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(FormErrorsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});
});
