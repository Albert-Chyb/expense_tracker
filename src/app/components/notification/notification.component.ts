import { transition, trigger, useAnimation } from '@angular/animations';
import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	ComponentRef,
	ElementRef,
	HostBinding,
	Input,
	OnInit,
	ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import { NotificationType } from 'src/app/common/models/notifications';
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
	constructor(private readonly _changeDetector: ChangeDetectorRef) {}

	@Input() title: string;
	@Input() msg: string;
	@Input() type: NotificationType = NotificationType.Neutral;
	@HostBinding('@notificationAnimation') t = true;
	@ViewChild('notification') notificationEl: ElementRef<HTMLElement>;

	private _componentRef: ComponentRef<NotificationComponent>;
	private _notifications: NotificationsService;
	private _onViewInit = new Subject<void>();

	ngOnInit(): void {}

	ngAfterViewInit() {
		this._onViewInit.next();
		this._changeDetector.detach();
	}

	dismiss() {
		this._notifications.destroyNotification(this._componentRef);
	}

	get classes() {
		return {
			'notification--no-title': !this.title,
			'notification--warning': this.type === NotificationType.Warning,
			'notification--danger': this.type === NotificationType.Danger,
			'notification--success': this.type === NotificationType.Success,
			'notification--neutral': this.type === NotificationType.Neutral,
		};
	}

	set componentRef(component: ComponentRef<NotificationComponent>) {
		this._componentRef = component;
	}

	set notificationsService(service: NotificationsService) {
		this._notifications = service;
	}

	get onViewInit() {
		return this._onViewInit.pipe();
	}
}
