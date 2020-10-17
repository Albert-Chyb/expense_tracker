import { DOCUMENT } from '@angular/common';
import {
	ApplicationRef,
	ComponentFactoryResolver,
	ComponentRef,
	EmbeddedViewRef,
	Inject,
	Injectable,
	InjectionToken,
	Injector,
	Optional,
	Renderer2,
	RendererFactory2,
} from '@angular/core';
import {
	NotificationComponent,
	NotificationType,
} from 'src/app/components/notification/notification.component';

/** Default notifications settings. You can use this token to provide your own settings */
export const NOTIFICATIONS_GLOBAL_SETTINGS = new InjectionToken<
	INotificationsGlobalSettings
>('notifications-global-settings');

export interface INotificationsGlobalSettings {
	posX: 'left' | 'right' | 'center';
	posY: 'top' | 'bottom';
	autoDismiss: boolean;
	autoDismissTimeout: number;
}

const notificationsDefaultSettings: INotificationsGlobalSettings = {
	posX: 'left',
	posY: 'top',
	autoDismiss: true,
	autoDismissTimeout: 1000,
};

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
	private _config: INotificationsGlobalSettings;

	success(message: string, title?: string) {
		return this.displayNotification(message, title, NotificationType.Success);
	}

	danger(message: string, title?: string) {
		return this.displayNotification(message, title, NotificationType.Danger);
	}

	warning(message: string, title?: string) {
		return this.displayNotification(message, title, NotificationType.Warning);
	}

	neutral(message: string, title?: string) {
		return this.displayNotification(message, title, NotificationType.Neutral);
	}

	displayNotification(
		message: string,
		title?: string,
		type?: NotificationType
	): NotificationComponent {
		const componentFactory = this._componentResolver.resolveComponentFactory(
			NotificationComponent
		);
		const component = componentFactory.create(this._injector);

		component.instance.msg = message || '';
		component.instance.title = title || '';
		component.instance.type = type || NotificationType.Neutral;
		component.instance.componentRef = component;
		component.instance.notificationsService = this;

		this._appRef.attachView(component.hostView);
		this.attachNotificationToTheView(
			component.hostView as EmbeddedViewRef<NotificationComponent>
		);

		if (this._config.autoDismiss)
			this.scheduleDismiss(component, this._config.autoDismissTimeout);

		component.instance.onViewInit.subscribe(el => {
			/*
				When the view of the newly created notification is ready,
				position it here.
			*/
		});

		return component.instance;
	}

	destroyNotification(notificationRef: ComponentRef<NotificationComponent>) {
		this._appRef.detachView(notificationRef.hostView);
		notificationRef.destroy();

		// ! Remove this timeout
		setTimeout(
			() =>
				this.displayNotification(
					'Zamknięto powiadomienie !',
					'Powiadomienie bez sensu !',
					getRandomInt(1, 4)
				),
			300
		);
	}

	private scheduleDismiss(
		notification: ComponentRef<NotificationComponent>,
		timeout: number
	) {
		setTimeout(() => this.destroyNotification(notification), timeout);
	}

	private attachNotificationToTheView(
		notificationView: EmbeddedViewRef<NotificationComponent>
	): void {
		const htmlElement = notificationView.rootNodes[0];
		this._renderer.appendChild(this._docRef.body, htmlElement);
	}
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}
