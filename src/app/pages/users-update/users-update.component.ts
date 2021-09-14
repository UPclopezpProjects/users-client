import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Md5 } from 'ts-md5/dist/md5';

import { UserService } from '../../services/user.service';
import { Users } from '../../models/users';

import Swal from 'sweetalert2';

const swalWithBootstrapButtons = Swal.mixin({
	customClass: {
		confirmButton: 'btn btn-success',
		cancelButton: 'btn btn-danger'
	},
	buttonsStyling: false
})

@Component({
  selector: 'app-users-update',
  templateUrl: './users-update.component.html',
  providers: [UserService],
  styleUrls: ['./users-update.component.scss']
})
export class UsersUpdateComponent implements OnInit {
	public token: any;
	public isHidden: boolean;
	public isTUser: boolean;
	public isAdmin: boolean;

	public isMe: boolean;
	public password: String;
	public identity;
	public user: Users;
	public errorMessage: any;
	public nameOfOperation;

	constructor(
		private _userService: UserService,
		private _route: ActivatedRoute,
		private _router: Router
	){
		this.isHidden = true;
		this.isTUser = false;
		this.isAdmin = false;
		this.isMe = false;
		this.identity = this._userService.getIdentity();
		//this.user = new Users('null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', null, null, null, null, null, null, null, null, null, null, null, null);
		//this.user = new Users('email', 'password', 'typeOfUser', 'initialToken', 'typeOfOperation', 'nameOfOperation', 'addressU', 'hashX', 'status', 'creationDate', 'nameOfUser', 'dp1', 'dp2', 'dp3', 'dp4', 'dp5', 'dp6', 'dp7', 'dp8', 'dp9', 'dp10', 'dp11', 'dp12');
		this.user = JSON.parse(this.identity);
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
				this.password = response.user.password;
				if(!response.user){
					this._router.navigate(['/']);
				}else{
					if(this.user.email == response.user.email){
						this.isMe = true;
						this.nameOfOperation = 'updateMe';
					}else if(response.user.typeOfUser == 'Administrator'){
						this.nameOfOperation = 'updateAdministrator';
					}else if(response.user.typeOfUser == 'TUser' || response.user.typeOfUser == 'Merchant' || response.user.typeOfUser == 'Carrier' || response.user.typeOfUser == 'Acopio' || response.user.typeOfUser == 'Productor'){
						this.nameOfOperation = 'updateTUser';
					}else{
						this.nameOfOperation = null;
					}
					var responseDP = JSON.parse(response.user.dp);
					var jsonData:any;
					jsonData = {
						email: response.user.email,
            surnameA: response.user.surnameA,
            surnameB: response.user.surnameB,
            nameOfUser: response.user.nameOfUser,
            typeOfUser: response.user.typeOfUser,
						password: response.user.password,
						initialToken: response.user.initialToken,
						typeOfOperation: 'read',
						nameOfOperation: this.nameOfOperation,
						addressU: response.user.addressU,
						creationDate: response.user.creationDate,
						status: response.user.status,
						hashX: response.user.hashX,
            dp1: responseDP.createAdministrator,
						dp2: responseDP.createTUser,
            dp3: responseDP.createData,
						dp4: responseDP.updateMe,
						dp5: responseDP.updateAdministrator,
						dp6: responseDP.updateTUser,
            dp7: responseDP.updateData,
						dp8: responseDP.deleteMe,
						dp9: responseDP.deleteAdministrator,
						dp10: responseDP.deleteTUser,
            dp11: responseDP.deleteData,
						dp12: responseDP.readMe,
						dp13: responseDP.readAdministrator,
						dp14: responseDP.readTUser,
            dp15: responseDP.readData,
						dp16: responseDP.loginUser
					};
					this.user = jsonData;
					console.log(this.user);
					if(response.user.typeOfUser == 'Administrator' || response.user.typeOfUser == 'Root'){
						this.isTUser = false;
						this.isAdmin = true;
					}else if(response.user.typeOfUser == 'TUser' || response.user.typeOfUser == 'Merchant' || response.user.typeOfUser == 'Carrier' || response.user.typeOfUser == 'Acopio' || response.user.typeOfUser == 'Productor'){
						this.isTUser = true;
						this.isAdmin = false;
					}
				}
			},
			error => {
				var errorMessage = <any> error;
				if(errorMessage != null){
					//console.log("Administrator: "+error.error.message);
					this.errorMessage = error.error.message;
					this.user = new Users('null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
				}
			}
		)
		});
	}

	public onSubmit(){
		if(this.user.status == 'true'){
			this.user.status = true;
		}else if(this.user.status == 'false'){
			this.user.status = false;
		}
		var md5 = new Md5();
		if(this.user.nameOfUser == '' || this.user.password == ''){ //Aquí podría configurar cuando elija read marcar todo lo relacionado a este permiso
			return alert("Rellena todos los campos");
		}
		var jsonDP = '{ "createAdministrator": '+this.user.dp1+', "createTUser": '+this.user.dp2+', "createData": '+this.user.dp3+', "updateMe": '+this.user.dp4+', "updateAdministrator": '+this.user.dp5+', "updateTUser": '+this.user.dp6+', "updateData": '+this.user.dp7+', "deleteMe": '+this.user.dp8+', "deleteAdministrator": '+this.user.dp9+', "deleteTUser": '+this.user.dp10+', "deleteData": '+this.user.dp11+', "readMe": '+this.user.dp12+', "readAdministrator": '+this.user.dp13+', "readTUser": '+this.user.dp14+', "readData": '+this.user.dp15+', "loginUser": '+this.user.dp16+' }';
		var jsonData:any;
		jsonData = {
			email: this.user.email,
			password: this.user.password,
			surnameA: this.user.surnameA,
			surnameB: this.user.surnameB,
			nameOfUser: this.user.nameOfUser,
			typeOfUser: this.user.typeOfUser,
			status: this.user.status,
			initialToken: this.user.initialToken,
			addressU: this.user.addressU,
			typeOfOperation: 'update',
			nameOfOperation: this.user.nameOfOperation,
			//dp: jsonDP
		};
        //console.log(jsonData);

		//CHECAR EL MD5 PARA DESPUÉS
		if(this.password == this.user.password){
			jsonData.password = '';
		}

		var hashX = md5.appendStr(JSON.stringify(jsonData)).end();
		jsonData.hashX = hashX;
		jsonData.email = '';
		console.log(jsonData);

		this._userService.updateUsers(this.user.email, jsonData).subscribe(
			(response:any) => {
				swalWithBootstrapButtons.fire(
					'¡Registro actualizado!',
					'El registro ha sido actualizado correctamente',
					'success'
				)
				//console.log(response.message);
				//this.rootCreation = false;
				//this.menu = true;
				if(this.nameOfOperation == 'updateMe'){
					localStorage.setItem('token', response.token.replace(/['"]+/g, ''));
					this._router.navigate(['/user-profile']);

				}else{
					this._router.navigate(['/tables/1']);
				}
			},
			error => {
				var errorMessage = <any> error;
				if(errorMessage != null){
					this.errorMessage = error.error.message;
					swalWithBootstrapButtons.fire(
						'Error',
						this.errorMessage,
						'warning'
					)
					//console.log("Administrator: "+error.error.message);
					//this.user = new Users('null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', null, null, null, null, null, null, null, null, null, null, null, null);
				}
			}
		);
	}
}
