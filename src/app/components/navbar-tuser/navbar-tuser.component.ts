import { Component, OnInit, ElementRef } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-navbar-tuser',
  templateUrl: './navbar-tuser.component.html',
  providers: [UserService],
  styleUrls: ['./navbar-tuser.component.css']
})
export class NavbarTuserComponent implements OnInit {
	public user;
	public focus;
	public location: Location;
	constructor(location: Location,  private element: ElementRef, private _router: Router, private _userService:UserService,) {
		this.location = location;
		this.user = JSON.parse(this._userService.getIdentity());
	}

	ngOnInit() {
	}

	getTitle(){
		/*var title = this.location.prepareExternalUrl(this.location.path());
		if(title == '#/merchantsData'){
			return 'Datos';
		}*/
		return 'PÁGINA PRINCIPAL';

	}

	public logout(){
		localStorage.clear();
		this._router.navigate(['/login']);
	}
}