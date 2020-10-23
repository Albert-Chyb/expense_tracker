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

/**
 * Service that manages toast notifications in the app.
 */

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
		const that = this;
		const inputs = {
			msg: message,
			title,
			type,
			componentRef: component,
			notificationsService: that,
		};

		Object.assign(component.instance, inputs);
		this._appRef.attachView(component.hostView);
		this.attachNotificationToTheView(
			component.hostView as EmbeddedViewRef<NotificationComponent>
		);

		if (this._config.autoDismiss)
			this.scheduleDismiss(component, this._config.autoDismissTimeout);

		component.instance.onViewInit.subscribe(() =>
			this.addNotificationToArray(component.instance)
		);

		return component.instance;
	}

	/**
	 * Removes notification from the view.
	 * @param notificationRef Reference to the notification`s ComponentRef
	 */
	destroyNotification(
		notificationRef: ComponentRef<NotificationComponent>
	): void {
		this._appRef.detachView(notificationRef.hostView);
		notificationRef.destroy();

		this.removeNotificationFromArray(notificationRef.instance);
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
	 * @param notification ComponentRef of the notification to remove after time.
	 * @param timeout Time after notification will be removed from the view.
	 */
	private scheduleDismiss(
		notification: ComponentRef<NotificationComponent>,
		timeout: number
	): void {
		setTimeout(() => this.destroyNotification(notification), timeout);
	}

	/**
	 * Appends notification HTML to the page body.
	 */
	private attachNotificationToTheView(
		notificationView: EmbeddedViewRef<NotificationComponent>
	): void {
		const htmlElement = notificationView.rootNodes[0];
		this._renderer.appendChild(this._docRef.body, htmlElement);
	}

	/** Removes notification from the array and re-positions other notifications. */
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

	/** Adds notification to the array, makes sure that in the view exists allowed number of notifications, and re-positions them */
	private addNotificationToArray(notification: NotificationComponent): void {
		this._currentNotifications.push(notification);

		if (
			this._currentNotifications.length > this._config.maxNotificationsOnScreen
		) {
			const lastNotification = this._currentNotifications[0];
			lastNotification.dismiss();
		}

		this.positionNotifications();
	}

	/** Positions notification in the view. */
	private positionNotifications(): void {
		this._currentNotifications.reduce((prevTranslation, notification) => {
			const el = notification.notificationEl.nativeElement;
			const { height } = el.getBoundingClientRect();

			this._renderer.setStyle(
				el,
				'transform',
				`translateY(${prevTranslation * this._config.posY}px)`
			);

			return prevTranslation + height + this._config.margin;
		}, 0);
	}
}
