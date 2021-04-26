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
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  providers: [UserService],
  styleUrls: ['./edit-profile.component.scss']
})

export class EditProfileComponent implements OnInit {
	public token;
	public identity;
	public isHidden	: boolean;
	public isActive	: boolean;
	public isRoot	: boolean;
	public user: Users;
	public password: String;
	public dp: String;
	public errorMessage: any;

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
				this.password = response.user.password;
				if(!response.user){
					this._router.navigate(['/']);
				}else{
					if(response.user.typeOfUser == 'Root'){
						this.isRoot = true;
					}
					var responseDP = JSON.parse(response.user.dp);
					this.user = {
						email: response.user.email,
						password: response.user.password,
						surnameA:response.user.surnameA,
						surnameB:response.user.surnameB,
						typeOfUser: response.user.typeOfUser,
						initialToken: response.user.initialToken,
						typeOfOperation: 'update',
						nameOfOperation: 'updateMe',
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
					if(this.user.status == 'true'){
						this.isActive = true;
					}else if(this.user.status == "false"){
						this.isActive = false;
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

	public onSubmit(){
		var md5 = new Md5();
		if(this.user.nameOfUser == '' || this.user.password == ''){ //Aquí podría configurar cuando elija read marcar todo lo relacionado a este permiso
			return alert("Rellena todos los campos");
		}
		var jsonDP = '{ "createAdministrator": '+this.user.dp1+', "createTUser": '+this.user.dp2+', "updateMe": '+this.user.dp3+', "updateAdministrator": '+this.user.dp4+', "updateTUser": '+this.user.dp5+', "deleteMe": '+this.user.dp6+', "deleteAdministrator": '+this.user.dp7+', "deleteTUser": '+this.user.dp8+', "readMe": '+this.user.dp9+', "readAdministrator": '+this.user.dp10+', "readTUser": '+this.user.dp11+', "loginUser": '+this.user.dp12+' }';
		var jsonData:any;
		jsonData = {
			email: this.user.email,
			password: this.user.password,
			typeOfUser: this.user.typeOfUser,
			initialToken: this.user.initialToken,
			typeOfOperation: this.user.typeOfOperation,
			nameOfOperation: this.user.nameOfOperation,
			addressU: this.user.addressU,
			nameOfUser: this.user.nameOfUser,
			status: this.user.status,
			dp: jsonDP
		};
		if(this.password == this.user.password){
			jsonData.password = '';
		}
		delete jsonData.dp;
        //console.log(localStorage.token, jsonData);
		var hashX = md5.appendStr(JSON.stringify(jsonData)).end();
		jsonData.hashX = hashX;
		delete jsonData.email;
		this._userService.updateUsers(this.user.email, jsonData).subscribe(
			(response:any) => {
				swalWithBootstrapButtons.fire(
					'¡Datos actualizados!',
					'Tus datos han sido actualizados correctamente',
					'success'
				)
				//console.log(response.user);
				localStorage.setItem('token', response.token.replace(/['"]+/g, ''));
				localStorage.setItem('identity', JSON.stringify(response.user));
				this._router.navigate(['/user-profile']);
			},
			error => {
				console.log(error)
				var errorMessage = <any> error;
				if(errorMessage != null){
					this.errorMessage = error.error.message;
					swalWithBootstrapButtons.fire(
						'Error',
						this.errorMessage,
						'warning'
					)
				}
			}
		);
	}

	deactivateAccount(status){
		var md5 = new Md5();
		swalWithBootstrapButtons.fire({
		  title: '¿Estás seguro?',
		  text: "¡Desactivarás tu cuenta!",
		  icon: 'question',
		  showCancelButton: true,
		  confirmButtonText: '¡Sí, desactiva mi cuenta!',
		  cancelButtonText: '¡No, cancélalo!',
		  reverseButtons: true
		})
		.then((result) => {
			if (result.isConfirmed) {
				var jsonDP = '{ "createAdministrator": '+this.user.dp1+', "createTUser": '+this.user.dp2+', "updateMe": '+this.user.dp3+', "updateAdministrator": '+this.user.dp4+', "updateTUser": '+this.user.dp5+', "deleteMe": '+this.user.dp6+', "deleteAdministrator": '+this.user.dp7+', "deleteTUser": '+this.user.dp8+', "readMe": '+this.user.dp9+', "readAdministrator": '+this.user.dp10+', "readTUser": '+this.user.dp11+', "loginUser": '+this.user.dp12+' }';
				var jsonData:any;
				jsonData = {
					email: this.user.email,
					password: this.user.password,
					typeOfUser: this.user.typeOfUser,
					initialToken: this.user.initialToken,
					typeOfOperation: 'update',
					nameOfOperation: 'updateMe',
					addressU: this.user.addressU,
					nameOfUser: this.user.nameOfUser,
					status: status,
					dp: jsonDP
				};
				if(this.password == this.user.password){
					jsonData.password = '';
				}
				delete jsonData.dp;
		        //console.log(localStorage.token, jsonData);
				var hashX = md5.appendStr(JSON.stringify(jsonData)).end();
				jsonData.hashX = hashX;
				delete jsonData.email;
				this._userService.updateUsers(this.user.email, jsonData).subscribe(
					(response:any) => {
						swalWithBootstrapButtons.fire(
					      '¡Se ha desactivado tu cuenta!',
					      'Contacta con un desarrollador para reactivarla',
					      'success'
					    )
						this._router.navigate(['/login']);
					},
					error => {
						var errorMessage = <any> error;
						if(errorMessage != null){
							this.errorMessage = error.error.message;
							swalWithBootstrapButtons.fire(
						      'Error',
						      this.errorMessage,
						      'error'
						    )
							//console.log(error.error.message);
						}
					}
				);
			}else if (result.dismiss === Swal.DismissReason.cancel) {
				swalWithBootstrapButtons.fire(
					'Cancelado',
					'No se desactivará tu cuenta',
					'info'
				)
			}
		})
	}
	activateAccount(v){
		console.log(v)
	}
}
