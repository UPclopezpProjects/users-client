import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Users } from '../../models/users';
declare const google: any;

@Component({
  selector: 'app-sidebar-merchant',
  templateUrl: './sidebar-merchant.component.html',
  providers: [UserService],
  //styleUrls: ['./sidebar-merchant.component.css']
  styleUrls: ['../../../assets/css/app.component.css']
})
export class SidebarMerchantComponent implements OnInit {
	public identity;
	public user: Users;

	constructor(
		private _userService:UserService,
		private _router: Router
	){
		this.identity = this._userService.getIdentity();
		this.user = JSON.parse(this.identity);

	}

  ngOnInit(): void {
  }
}

