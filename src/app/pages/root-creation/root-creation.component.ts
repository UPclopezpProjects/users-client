import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Md5 } from 'ts-md5/dist/md5';

import { UserService } from '../../services/user.service';
import { Users } from '../../models/users';

import Swal from 'sweetalert2';
var moment = require('moment');

const swalWithBootstrapButtons = Swal.mixin({
	customClass: {
		confirmButton: 'btn btn-success',
		cancelButton: 'btn btn-danger'
	},
	buttonsStyling: false
})
@Component({
  selector: 'root-creation',
  templateUrl: './root-creation.component.html',
  providers: [UserService],
  styleUrls: ['./root-creation.component.css']
})
export class RootCreationComponent {
	public isHidden: boolean;
	public user: Users;
	public errorMessage: any;
	public registerOk: any;

	constructor(
		private _userService:UserService,
		private _route: ActivatedRoute,
		private _router: Router
	){
		this.isHidden = true;
		this.user = new Users('', '', 'Root', '', 'create', 'createRoot', '', '', true, 'xx/xx/xxxx', '', true, true, true, true, true, true, true, true, true, true, true, true);
		//this.user = new Users('email', 'password', 'typeOfUser', 'initialToken', 'typeOfOperation', 'nameOfOperation', 'addressU', 'hashX', 'status', 'creationDate', 'nameOfUser', 'dp1', 'dp2', 'dp3', 'dp4', 'dp5', 'dp6', 'dp7', 'dp8', 'dp9', 'dp10', 'dp11', 'dp12');
	}

	ngOnInit() {
	}

	public onSubmit(){
		moment.locale('es');
		var date = ''+moment().format('L')+' - '+moment().format('LT')+'';
		var md5 = new Md5();
		if(this.user.email == '' || this.user.nameOfUser == '' || this.user.password == '' || this.user.addressU == ''){
			return alert("Rellena todos los campos");
		}
		var jsonDP = '{ "createAdministrator": '+this.user.dp1+', "createTUser": '+this.user.dp2+', "updateMe": '+this.user.dp3+', "updateAdministrator": '+this.user.dp4+', "updateTUser": '+this.user.dp5+', "deleteMe": '+this.user.dp6+', "deleteAdministrator": '+this.user.dp7+', "deleteTUser": '+this.user.dp8+', "readMe": '+this.user.dp9+', "readAdministrator": '+this.user.dp10+', "readTUser": '+this.user.dp11+', "loginUser": '+this.user.dp12+' }';
		var jsonData = {
			email: this.user.email,
			password: this.user.password,
			typeOfUser: this.user.typeOfUser,
			initialToken: this.user.initialToken,
			typeOfOperation: this.user.typeOfOperation,
			nameOfOperation: this.user.nameOfOperation,
			addressU: this.user.addressU,
			nameOfUser: this.user.nameOfUser,
			creationDate: date,
			status: this.user.status,
			dp: jsonDP
		};
		 //CHECAR EL MD5 PARA DESPUÉS
		var hashX = md5.appendStr(JSON.stringify(jsonData)).end();
		 jsonData.hashX = hashX;
		this._userService.createRoot(jsonData).subscribe(
			response => {
				//console.log(response.message);
				//this.rootCreation = false;
				//this.menu = true;
				swalWithBootstrapButtons.fire(
					'¡Usuario Root creado!',
					'Haz creado al usuario Root',
					'success'
				)
				console.log(response);
				localStorage.setItem('identity', JSON.stringify(response.user));
				localStorage.setItem('token', response.token.replace(/['"]+/g, ''));
				console.log(localStorage.getItem('token'));
				this._router.navigate(['/welcome']);
			},
			error => {
				var errorMessage = <any> error;
				if(errorMessage != null){
					this.errorMessage = error.error.message;
					swalWithBootstrapButtons.fire(
						'Error',
						this.errorMessage,
						'warning'
					);
				}
			}
		)
	}
}


