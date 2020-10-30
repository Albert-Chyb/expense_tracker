import { async, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NotificationType } from './../../common/models/notifications';
import { NotificationsService } from './notifications.service';

describe('NotificationsService', () => {
	let service: NotificationsService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [BrowserAnimationsModule],
		});
		service = TestBed.inject(NotificationsService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('displayNotification', () => {
		it('should attach component view to the app', () => {
			const spy = spyOn(service['_appRef'], 'attachView');

			service.displayNotification.call(service);

			expect(spy).toHaveBeenCalled();
		});

		it('should append HTML view of the notification to the body', () => {
			const spy = spyOn(service as any, 'attachNotificationToTheView');

			service.displayNotification.call(service);

			expect(spy).toHaveBeenCalled();
		});

		it('should automatically dismiss notification if this option is enabled in config', () => {
			service['_config'].autoDismiss = true;
			const spy = spyOn(service as any, 'scheduleDismiss');

			service.displayNotification.call(service);

			expect(spy).toHaveBeenCalled();
		});
	});

	describe('success', () => {
		it('should display notification with success type', () => {
			const spy = spyOn(service, 'displayNotification');

			service.success('a', 'b');

			expect(spy).toHaveBeenCalledWith('a', 'b', NotificationType.Success);
		});
	});

	describe('danger', () => {
		it('should display notification with danger type', () => {
			const spy = spyOn(service, 'displayNotification');

			service.danger('a', 'b');

			expect(spy).toHaveBeenCalledWith('a', 'b', NotificationType.Danger);
		});
	});

	describe('warning', () => {
		it('should display notification with warning type', () => {
			const spy = spyOn(service, 'displayNotification');

			service.warning('a', 'b');

			expect(spy).toHaveBeenCalledWith('a', 'b', NotificationType.Warning);
		});
	});

	describe('neutral', () => {
		it('should display notification with neutral type', () => {
			const spy = spyOn(service, 'displayNotification');

			service.neutral('a', 'b');

			expect(spy).toHaveBeenCalledWith('a', 'b', NotificationType.Neutral);
		});
	});

	describe('scheduleDismiss', () => {
		it('should dismiss passed notification after specified timeout', async(() => {
			const fakeNotification = {
				dismiss: () => null,
			} as any;
			const spy = spyOn(fakeNotification, 'dismiss');
			const timeout = 30;

			service['scheduleDismiss'](fakeNotification, timeout);

			setTimeout(() => {
				expect(spy).toHaveBeenCalled();
			}, timeout + 1);
		}));
	});

	describe('attachNotificationToTheView', () => {
		it('should append notification`s layout to the page body', () => {
			const fakeNotificationView = {
				rootNodes: ['a'],
			} as any;
			const spy = spyOn(service['_renderer'], 'appendChild');

			service['attachNotificationToTheView'](fakeNotificationView);

			expect(spy).toHaveBeenCalledWith(
				service['_docRef'].body,
				fakeNotificationView.rootNodes[0]
			);
		});
	});

	describe('onNotificationsOverflowing', () => {
		it('should destroy overflowing notification', () => {
			const fakeNotification = {
				componentRef: {
					destroy: () => null,
				},
			} as any;
			const spy = spyOn(fakeNotification.componentRef, 'destroy');

			service['onNotificationsOverflowing'].call(service, {
				item: fakeNotification,
			});

			expect(spy).toHaveBeenCalled();
		});

		it('should position other notifications after after overflowing notification`s animation completes', async(() => {
			const fakeNotification = {
				componentRef: {
					destroy: () => null,
				},
			} as any;
			const spy = spyOn(service as any, 'positionNotifications');

			service['_config'].animationDuration = 1;
			service['onNotificationsOverflowing']({ item: fakeNotification } as any);

			setTimeout(() => {
				expect(spy).toHaveBeenCalled();
			}, service['_config'].animationDuration + 1);
		}));
	});
});
