import { filter, first, map } from 'rxjs/operators';
import { transition, trigger, useAnimation } from '@angular/animations';
import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	ComponentRef,
	ElementRef,
	HostBinding,
	Inject,
	Input,
	OnInit,
	Optional,
	ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import {
	INotificationsGlobalSettings,
	notificationsDefaultSettings,
	NotificationsPosition,
	NOTIFICATIONS_GLOBAL_SETTINGS,
	NotificationType,
} from 'src/app/common/models/notifications';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';

import { fadeIn, fadeOut } from './../../animations';

@Component({
	templateUrl: './notification.component.html',
	styleUrls: ['./notification.component.scss'],
	animations: [
		trigger('notificationAnimation', [
			transition(
				':enter',
				useAnimation(fadeIn, { params: { delay: '300ms' } })
			),
			transition(':leave', useAnimation(fadeOut)),
		]),
	],
})
export class NotificationComponent implements OnInit, AfterViewInit {
	constructor(
		private readonly _changeDetector: ChangeDetectorRef,

		@Optional()
		@Inject(NOTIFICATIONS_GLOBAL_SETTINGS)
		config: INotificationsGlobalSettings
	) {
		this._config = this._config = config
			? Object.assign(notificationsDefaultSettings, config)
			: notificationsDefaultSettings;
	}

	@Input() title: string;
	@Input() msg: string;
	@Input() type: NotificationType = NotificationType.Neutral;
	@HostBinding('@notificationAnimation') t = true;
	@ViewChild('notification') notificationEl: ElementRef<HTMLElement>;

	public componentRef: ComponentRef<NotificationComponent>;
	private _notifications: NotificationsService;
	private _onViewInit = new Subject<void>();
	private _config: INotificationsGlobalSettings;

	ngOnInit(): void {}

	ngAfterViewInit() {
		this._onViewInit.next();
		this._changeDetector.detach();
	}

	dismiss() {
		this._notifications.inView.delete(this);
	}

	get classes() {
		return {
			'notification--no-title': !this.title,
			'notification--warning': this.type === NotificationType.Warning,
			'notification--danger': this.type === NotificationType.Danger,
			'notification--success': this.type === NotificationType.Success,
			'notification--neutral': this.type === NotificationType.Neutral,
			'notification--bottom':
				this._config.posY === NotificationsPosition.Bottom,
			'notification--top': this._config.posY === NotificationsPosition.Top,
			'notification--left': this._config.posX === NotificationsPosition.Left,
			'notification--right': this._config.posX === NotificationsPosition.Right,
		};
	}

	set notificationsService(service: NotificationsService) {
		this._notifications = service;
	}

	get onViewInit() {
		return this._onViewInit.pipe(first());
	}

	get config() {
		return this._config;
	}
}
