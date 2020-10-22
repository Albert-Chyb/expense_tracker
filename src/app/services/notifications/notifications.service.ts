import {
	NOTIFICATIONS_GLOBAL_SETTINGS,
	INotificationsGlobalSettings,
	notificationsDefaultSettings,
	NotificationType,
} from '../../common/models/notifications';
import { DOCUMENT } from '@angular/common';
import {
	ApplicationRef,
	ComponentFactoryResolver,
	ComponentRef,
	EmbeddedViewRef,
	Inject,
	Injectable,
	Injector,
	Optional,
	Renderer2,
	RendererFactory2,
} from '@angular/core';
import { NotificationComponent } from 'src/app/components/notification/notification.component';

interface INotificationInputs {
	msg: string;
	title: string;
	type: NotificationType;
	componentRef: ComponentRef<NotificationComponent>;
	notificationsService: NotificationsService;
}

@Injectable({
	providedIn: 'root',
})
export class NotificationsService {
	constructor(
		private readonly _injector: Injector,
		private readonly _appRef: ApplicationRef,
		private readonly _componentResolver: ComponentFactoryResolver,
		private readonly _rendererFactory: RendererFactory2,
		@Inject(DOCUMENT) private readonly _docRef: Document,

		@Optional()
		@Inject(NOTIFICATIONS_GLOBAL_SETTINGS)
		config: INotificationsGlobalSettings
	) {
		this._renderer = this._rendererFactory.createRenderer(null, null);
		this._config = config
			? Object.assign(notificationsDefaultSettings, config)
			: notificationsDefaultSettings;
	}

	private readonly _renderer: Renderer2;
	private readonly _currentNotifications: NotificationComponent[] = [];
	private _config: INotificationsGlobalSettings;

	displayNotification(
		message: string,
		title = '',
		type = NotificationType.Neutral
	): NotificationComponent {
		const componentFactory = this._componentResolver.resolveComponentFactory(
			NotificationComponent
		);
		const component = componentFactory.create(this._injector);
		const that = this;
		const inputs = {
			msg: message,
			title,
			type,
			componentRef: component,
			notificationsService: that,
		};

		// TODO: Make Limited array that automatically trims itself when there is more
		// TODO: items than allowed.
		// TODO: Also it should be able to register callback on trim

		Object.assign(component.instance, inputs);
		this._appRef.attachView(component.hostView);
		this.attachNotificationToTheView(
			component.hostView as EmbeddedViewRef<NotificationComponent>
		);

		if (this._config.autoDismiss)
			this.scheduleDismiss(component, this._config.autoDismissTimeout);

		const s = component.instance.onViewInit.subscribe(() => {
			this.addNotificationToArray(component.instance);

			s.unsubscribe();
		});

		return component.instance;
	}

	destroyNotification(
		notificationRef: ComponentRef<NotificationComponent>
	): void {
		this._appRef.detachView(notificationRef.hostView);
		notificationRef.destroy();

		this.removeNotificationFromArray(notificationRef.instance);
	}

	success(message: string, title?: string): NotificationComponent {
		return this.displayNotification(message, title, NotificationType.Success);
	}

	danger(message: string, title?: string): NotificationComponent {
		return this.displayNotification(message, title, NotificationType.Danger);
	}

	warning(message: string, title?: string): NotificationComponent {
		return this.displayNotification(message, title, NotificationType.Warning);
	}

	neutral(message: string, title?: string): NotificationComponent {
		return this.displayNotification(message, title, NotificationType.Neutral);
	}

	private scheduleDismiss(
		notification: ComponentRef<NotificationComponent>,
		timeout: number
	): void {
		setTimeout(() => this.destroyNotification(notification), timeout);
	}

	private attachNotificationToTheView(
		notificationView: EmbeddedViewRef<NotificationComponent>
	): void {
		const htmlElement = notificationView.rootNodes[0];
		this._renderer.appendChild(this._docRef.body, htmlElement);
	}

	private removeNotificationFromArray(
		notification: NotificationComponent
	): void {
		const notificationIndex = this._currentNotifications.indexOf(notification);
		this._currentNotifications.splice(notificationIndex, 1);

		setTimeout(
			() => this.positionNotifications(),
			this._config.animationDuration
		);
	}

	private addNotificationToArray(notification: NotificationComponent): void {
		this._currentNotifications.push(notification);

		if (
			this._currentNotifications.length > this._config.maxNotificationOnScreen
		) {
			const lastNotification = this._currentNotifications[0];
			lastNotification.dismiss();
		}

		this.positionNotifications();
	}

	private positionNotifications(): void {
		this._currentNotifications.reduce((prevTranslation, notification) => {
			const el = notification.notificationEl.nativeElement;
			const { height } = el.getBoundingClientRect();

			this._renderer.setStyle(
				el,
				'transform',
				`translateY(${-prevTranslation}px)`
			);

			return prevTranslation + height + this._config.margin;
		}, 0);
	}
}
