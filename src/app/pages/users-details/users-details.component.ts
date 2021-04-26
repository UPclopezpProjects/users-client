import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Md5 } from 'ts-md5/dist/md5';

import { UserService } from '../../services/user.service';
import { Users } from '../../models/users';

@Component({
  selector: 'app-users-details',
  templateUrl: './users-details.component.html',
  providers: [UserService],
  styleUrls: ['./users-details.component.scss']
})

export class UsersDetailsComponent implements OnInit {
	public token: any;
	public form: any;
	public isHidden: boolean;
	public isTUser: boolean;
	public identity;
	public user: Users;
	public errorMessage: any;
	public registerOk: any;
	public nameOfOperation;

	constructor(
		private _userService: UserService,
		private _route: ActivatedRoute,
		private _router: Router
	){
		this.isHidden = true;
		this.isTUser = true;
		//this.identity = this._userService.getIdentity();
		//this.user = new Users('null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', null, null, null, null, null, null, null, null, null, null, null, null);
		this.user = new Users('email', 'password', 'surnameA', 'surnameB','typeOfUser', 'initialToken', 'typeOfOperation', 'nameOfOperation', 'addressU', 'hashX', 'status', 'creationDate', 'nameOfUser', 'dp1', 'dp2', 'dp3', 'dp4', 'dp5', 'dp6', 'dp7', 'dp8', 'dp9', 'dp10', 'dp11', 'dp12');
		//this.user = JSON.parse(this.identity);
		//console.log(this.user);
		this.token = this._userService.getToken();
	}

	ngOnInit() {
		this.getUser();
	}

	public getUser(){
		this._route.params.forEach((params: Params) =>{
			let id = params['id'];
			this._userService.getUser(this.token, id).subscribe(
			(response:any) => {
				if(!response.user){
					this._router.navigate(['/']);
				}else{
					if(response.user.status == 'true'){
						response.user.status = 'Habilitado';
					}else if(response.user.status == 'false'){
						response.user.status = 'Deshabilitado';
					}
					var responseDP = JSON.parse(response.user.dp);
					var jsonData:any;
          jsonData = {
						email: response.user.email,
						password: response.user.password,
						typeOfUser: response.user.typeOfUser,
						initialToken: response.user.initialToken,
						typeOfOperation: 'read',
						nameOfOperation: this.nameOfOperation,
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
					this.user = jsonData;
					if(response.user.typeOfUser == 'Administrator' || response.user.typeOfUser == 'Root' ){
						this.isTUser = false;
					}else if(response.user.typeOfUser == 'TUser' || response.user.typeOfUser == 'Merchant' || response.user.typeOfUser == 'Carrier' || response.user.typeOfUser == 'Acopio' || response.user.typeOfUser == 'Productor'){
						this.isTUser = true;
					}
				}
			},
			error => {
				var errorMessage = <any> error;
				if(errorMessage != null){
					//console.log("Administrator: "+error.error.message);
					this.errorMessage = error.error.message;
					this.user = new Users('null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', null, null, null, null, null, null, null, null, null, null, null, null);
				}
			}
		)
		});
	}

	public onSubmit(){
	}

}
