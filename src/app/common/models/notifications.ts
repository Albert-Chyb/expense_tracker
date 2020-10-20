import { InjectionToken } from '@angular/core';

/** Default notifications settings. You can use this token to provide your own settings */
export const NOTIFICATIONS_GLOBAL_SETTINGS = new InjectionToken<
	INotificationsGlobalSettings
>('notifications-global-settings');

export interface INotificationsGlobalSettings {
	posX: 'left' | 'right' | 'center';
	posY: 'top' | 'bottom';
	autoDismiss: boolean;
	autoDismissTimeout: number;
	animationDuration: number;
	margin: number;
	maxNotificationOnScreen: number;
}

export const notificationsDefaultSettings: INotificationsGlobalSettings = {
	posX: 'right',
	posY: 'bottom',
	autoDismiss: false,
	autoDismissTimeout: 1000,
	animationDuration: 300,
	margin: 10,
	maxNotificationOnScreen: 3,
};

export enum NotificationType {
	Warning = 1,
	Danger = 2,
	Success = 3,
	Neutral = 4,
}
