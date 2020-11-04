import { DOCUMENT } from '@angular/common';
import {
	ApplicationRef,
	ComponentFactoryResolver,
	EmbeddedViewRef,
	Inject,
	Injectable,
	Injector,
	Optional,
	Renderer2,
	RendererFactory2,
} from '@angular/core';
import { NotificationComponent } from 'src/app/components/notification/notification.component';

import {
	INotificationsGlobalSettings,
	NOTIFICATIONS_GLOBAL_SETTINGS,
	notificationsDefaultSettings,
	NotificationType,
} from '../../common/models/notifications';
import {
	ILimitedArrayEvent,
	LimitedArray,
} from './../../common/models/limitedArray';

/**
 * Service that manages toast notifications in the app.
 */

@Injectable({
	providedIn: 'root',
})
export class NotificationsService {
	private readonly _renderer: Renderer2;
	private _config: INotificationsGlobalSettings;
	private _currentNotifications: LimitedArray<NotificationComponent>;

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

		this._currentNotifications = new LimitedArray(
			this._config.maxNotificationsOnScreen
		);

		this._currentNotifications.onDelete.subscribe(
			this.onNotificationsOverflowing.bind(this)
		);

		this._currentNotifications.onAdd.subscribe(() =>
			this.positionNotifications()
		);
	}

	/**
	 * Displays notification to the user.
	 * @param message Message that will be displayed to the user
	 * @param title Title of the notification
	 * @param type Theme of the notification
	 */
	displayNotification(
		message: string,
		title = '',
		type = NotificationType.Neutral
	): NotificationComponent {
		const componentFactory = this._componentResolver.resolveComponentFactory(
			NotificationComponent
		);
		const component = componentFactory.create(this._injector);
		const notificationsService = this;
		const inputs = {
			msg: message,
			title,
			type,
			notificationsService,
			componentRef: component,
		};

		Object.assign(component.instance, inputs);

		this._appRef.attachView(component.hostView);
		this.attachNotificationToTheView(
			component.hostView as EmbeddedViewRef<NotificationComponent>
		);

		if (this._config.autoDismiss)
			this.scheduleDismiss(component.instance, this._config.autoDismissTimeout);

		component.instance.onViewInit$.subscribe(() =>
			this._currentNotifications.add(component.instance)
		);

		return component.instance;
	}

	/** Displays notification with success theme. */
	success(message: string, title?: string): NotificationComponent {
		return this.displayNotification(message, title, NotificationType.Success);
	}

	/** Displays notification with danger theme. */
	danger(message: string, title?: string): NotificationComponent {
		return this.displayNotification(message, title, NotificationType.Danger);
	}

	/** Displays notification with warning theme. */
	warning(message: string, title?: string): NotificationComponent {
		return this.displayNotification(message, title, NotificationType.Warning);
	}

	/** Displays notification with neutral theme. */
	neutral(message: string, title?: string): NotificationComponent {
		return this.displayNotification(message, title, NotificationType.Neutral);
	}

	/**
	 * Removes notification automatically after specified timeout.
	 * @param notification Notification to remove after time.
	 * @param timeout Time after notification will be removed from the view.
	 */
	private scheduleDismiss(
		notification: NotificationComponent,
		timeout: number
	): void {
		setTimeout(() => notification.dismiss(), timeout);
	}

	/**
	 * Appends notification`s layout to the page body.
	 */
	private attachNotificationToTheView(
		notificationView: EmbeddedViewRef<NotificationComponent>
	): void {
		const htmlElement = notificationView.rootNodes[0];
		this._renderer.appendChild(this._docRef.body, htmlElement);
	}

	/** Positions notifications in the view. */
	private positionNotifications(): void {
		this._currentNotifications.array.reduce((prevTranslation, notification) => {
			notification.translationY = prevTranslation * this._config.posY;

			return prevTranslation + notification.height + this._config.margin;
		}, 0);
	}

	/**
	 * Removes a notification from the view.
	 * @param notification Notification to remove
	 */
	private onNotificationsOverflowing({
		item: notification,
	}: ILimitedArrayEvent<NotificationComponent>): void {
		notification.componentRef.destroy();

		setTimeout(
			() => this.positionNotifications(),
			this._config.animationDuration
		);
	}

	/** Contains all notifications that are currently visible to the user */
	get inView() {
		return this._currentNotifications;
	}
}
