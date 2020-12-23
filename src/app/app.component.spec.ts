import { TestBed, waitForAsync } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { RouterTestingModule } from '@angular/router/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from 'src/environments/environment';

import { AppComponent } from './app.component';
import { userServiceTestProvider } from './common/test-stubs/user.service-stub';
import { MainHeaderComponent } from './components/main-header/main-header.component';
import { MainNavComponent } from './components/main-nav/main-nav.component';

describe('AppComponent', () => {
	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			imports: [
				RouterTestingModule,
				AngularFireModule.initializeApp(environment.firebase),
				ServiceWorkerModule.register('ngsw-worker.js', {
					enabled: environment.production,
				}),
			],
			declarations: [AppComponent, MainHeaderComponent, MainNavComponent],
			providers: [userServiceTestProvider],
		}).compileComponents();
	}));

	it('should create the app', () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.debugElement.componentInstance;
		expect(app).toBeTruthy();
	});
});
