import { InjectionToken } from '@angular/core';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';

/** Default notifications settings. You can use this token to provide your own settings */
export const NOTIFICATIONS_GLOBAL_SETTINGS = new InjectionToken<INotificationsSettings>(
	'NOTIFICATIONS_GLOBAL_SETTINGS'
);

export const NOTIFICATIONS_SETTINGS = new InjectionToken<INotificationsSettings>(
	'NOTIFICATIONS_SETTINGS'
);

/**
 * To avoid circular dependency error in notification component,
 * notification service is injected by this token.
 *
 * Does nothing special other than that, so there is not need of injecting
 * notification service anywhere else by this token.
 */
export const NOTIFICATIONS_SERVICE = new InjectionToken<NotificationsService>(
	'NOTIFICATIONS_SERVICE'
);

export enum NotificationsPosition {
	Bottom = -1,
	Top = 1,
	Left = 'left',
	Right = 'right',
}

export enum NotificationType {
	Warning = 1,
	Danger = 2,
	Success = 3,
	Neutral = 4,
}

export interface INotificationsSettings {
	posX: 'left' | 'right' | 'center';
	posY: 1 | -1;
	autoDismiss: boolean;
	autoDismissTimeout: number;
	animationDuration: number;
	margin: number;
	maxNotificationsOnScreen: number;
}

export const notificationsDefaultSettings: INotificationsSettings = {
	posX: NotificationsPosition.Right,
	posY: NotificationsPosition.Bottom,
	autoDismiss: false,
	autoDismissTimeout: 3_500,
	animationDuration: 300,
	margin: 10,
	maxNotificationsOnScreen: 3,
};
