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
  selector: 'root-creation',
  templateUrl: './root-creation.component.html',
  providers: [UserService],
  styleUrls: ['./root-creation.component.scss']
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
		this.user = new Users('', '', '', '', 'Root', '', 'create', 'createRoot', '', '900000', '', true, 'xx/xx/xxxx', '', true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true);
		//this.user = new Users('email', 'password', 'typeOfUser', 'initialToken', 'typeOfOperation', 'nameOfOperation', 'addressU', 'hashX', 'status', 'creationDate', 'nameOfUser', 'dp1', 'dp2', 'dp3', 'dp4', 'dp5', 'dp6', 'dp7', 'dp8', 'dp9', 'dp10', 'dp11', 'dp12');
	}

	ngOnInit() {
	}

	public onSubmit(){
		if(this.user.email == '' || this.user.nameOfUser == '' || this.user.password == '' || this.user.addressU == ''){
			swalWithBootstrapButtons.fire(
				'Error',
				'Rellena todos los campos',
				'warning'
			);
			return;
		}
		Swal.fire({
			title: 'Creando usuario...',
			allowEscapeKey: false,
			allowOutsideClick: false,
			timer: 60000,
			didOpen: () => {
				Swal.showLoading();
			}
		})
		.then((result) => {
			swalWithBootstrapButtons.fire(
				'¡!',
				'Ocurrió un problema',
				'warning'
			);
			return;
		})

		//
		var md5 = new Md5();
		var jsonDP = '{ "createAdministrator": '+this.user.dp1+', "createTUser": '+this.user.dp2+', "createData": '+this.user.dp3+', "updateMe": '+this.user.dp4+', "updateAdministrator": '+this.user.dp5+', "updateTUser": '+this.user.dp6+', "updateData": '+this.user.dp7+', "deleteMe": '+this.user.dp8+', "deleteAdministrator": '+this.user.dp9+', "deleteTUser": '+this.user.dp10+', "deleteData": '+this.user.dp11+', "readMe": '+this.user.dp12+', "readAdministrator": '+this.user.dp13+', "readTUser": '+this.user.dp14+', "readData": '+this.user.dp15+', "loginUser": '+this.user.dp16+' }';
		var jsonData:any;
		jsonData = {
			email: this.user.email.toLowerCase(),
			//password: this.user.password,
			surnameA: this.user.surnameA,
			surnameB: this.user.surnameB,
			nameOfUser: this.user.nameOfUser,
			typeOfUser: this.user.typeOfUser,
			status: this.user.status,
			creationDate: this.user.creationDate,
			//initialToken: this.user.initialToken,
			addressU: this.user.addressU,
			gas: this.user.gas,
			typeOfOperation: this.user.typeOfOperation,
			nameOfOperation: this.user.nameOfOperation,
			dp: jsonDP
		};
		console.log(JSON.stringify(jsonData));
		//CHECAR EL MD5 PARA DESPUÉS
		var hashX = md5.appendStr(JSON.stringify(jsonData)).end();
		jsonData.hashX = hashX;
		jsonData.password = this.user.password;


		this._userService.createRoot(jsonData).subscribe(
			 (response:any) => {
				//console.log(response);
				if (response.message == 'deny') {
					swalWithBootstrapButtons.fire(
						'Error',
						response.message,
						'warning'
					);
					return;
				}else{
					Swal.fire({
					  title: 'Éxito',
					  icon: 'success',
					  html:
							'<strong>Haz creado al usuario Root con estos datos...</strong><br>'+
							'<p><strong>addressContract:</strong><br>'+response.user.addressContract+'</p>'+
							'<p><strong>addressTransaction:</strong><br>'+response.user.addressTransaction+'</p>'+
							'<p><strong>hash:</strong><br>'+hashX+'</p>',
					  showCloseButton: true,
					  showCancelButton: false,
					  focusConfirm: false,
					  confirmButtonText:
					    'Ok',
					  //confirmButtonAriaLabel: 'Thumbs up, great!'
					})
					//console.log(response);
					localStorage.setItem('identity', JSON.stringify(response.user));
					localStorage.setItem('token', response.token.replace(/['"]+/g, ''));
					//console.log(localStorage.getItem('token'));
					this._router.navigate(['/welcome']);
				}
				//this.rootCreation = false;
				//this.menu = true;
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
		//
	}
}
