import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Users } from '../../models/users';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  providers: [UserService],
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
	public identity;
	public token;
	public errorMessage;
	public isHidden: boolean;
	public user: Users;

	constructor(
		private _userService: UserService,
  		private _route: ActivatedRoute,
  		private _router: Router
  	) {
		this.identity = JSON.parse(this._userService.getIdentity());
		this.token = this._userService.getToken();
		this.isHidden = true;
  	}

  	ngOnInit() {
  		this.getUser();
  	}

  	public getUser(){
  		this._userService.getUser(this.token, this.identity.email).subscribe(
			(response:any) => {
				if(!response.user){
					this._router.navigate(['/']);
				}else{
					var responseDP = JSON.parse(response.user.dp);
					this.user = {
						email: response.user.email,
						password: response.user.password,
            surnameA: response.user.surnameA,
            surnameB: response.user.surnameB,
						typeOfUser: response.user.typeOfUser,
						initialToken: response.user.initialToken,
						typeOfOperation: 'read',
						nameOfOperation: 'readMe',
						addressU: response.user.addressU,
						nameOfUser: response.user.nameOfUser,
						creationDate: response.user.creationDate,
						status: response.user.status,
						hashX: response.user.hashX,
						dp1: responseDP.createAdministrator,
						dp2: responseDP.createTUser,
						dp3: responseDP.updateMe,
						dp4: responseDP.updateAdministrator,
						dp5: responseDP.updateTUser,
						dp6: responseDP.deleteMe,
						dp7: responseDP.deleteAdministrator,
						dp8: responseDP.deleteTUser,
						dp9: responseDP.readMe,
						dp10: responseDP.readAdministrator,
						dp11: responseDP.readTUser,
						dp12: responseDP.loginUser,
					};
					//console.log(this.user);
					if(this.user.dp3 == false || this.user.dp9 == false){
			  			this.isHidden = false;
			  		}
				}
			},
			error => {
				var errorMessage = <any> error;
				if(errorMessage != null){
					this.isHidden = false;
					//console.log(error.error.message);
					this.errorMessage = error.error.message;
					this.user = new Users('null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', null, null, null, null, null, null, null, null, null, null, null, null);
				}
			}
		);
  	}
}
