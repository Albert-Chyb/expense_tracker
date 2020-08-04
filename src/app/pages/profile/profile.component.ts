import { UserService } from './../../services/user/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
	constructor(public readonly user: UserService) {}

	ngOnInit() {}
}
