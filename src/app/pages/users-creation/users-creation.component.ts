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
  selector: 'app-users-creation',
  templateUrl: './users-creation.component.html',
  providers: [UserService],
  styleUrls: ['./users-creation.component.scss']
})
export class UsersCreationComponent implements OnInit {
	public token: any;
	public form: any;
	public isHidden: boolean;
	public isTUser: boolean;
	public isAdmin: boolean;
	public user: Users;
	public errorMessage: any;
	public registerOk: any;

	constructor(
		private _userService:UserService,
		private _route: ActivatedRoute,
		private _router: Router
	){
		this.isHidden = true;
		this.isTUser = false;
		this.isAdmin = false;
		this.token = this._userService.getToken();
		//this.user = new Users('email', 'password', 'typeOfUser', 'initialToken', 'typeOfOperation', 'nameOfOperation', 'addressU', 'hashX', 'status', 'creationDate', 'nameOfUser', 'dp1', 'dp2', 'dp3', 'dp4', 'dp5', 'dp6', 'dp7', 'dp8', 'dp9', 'dp10', 'dp11', 'dp12');

		this.user = new Users('', '', '', '', '', this.token, 'create', '', '', '', '', true, 'xx/xx/xxxx', '', false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false);
		//this.user = new Users('email', 'password', 'typeOfUser', 'initialToken', 'typeOfOperation', 'nameOfOperation', 'addressU', 'hashX', 'status', 'creationDate', 'nameOfUser', 'dp1', 'dp2', 'dp3', 'dp4', 'dp5', 'dp6', 'dp7', 'dp8', 'dp9', 'dp10', 'dp11', 'dp12');
	}

	ngOnInit() {
		//console.log(this.token);
	}

	public onChange(){
		this.user.dp3 = true;
		this.user.dp4 = true;
		this.user.dp7 = true;
		this.user.dp8 = true;
		this.user.dp11 = true;
		this.user.dp12 = true;
		this.user.dp15 = true;
		this.user.dp16 = true;
		if(this.user.typeOfUser == 'Administrator'){
			this.user.nameOfOperation = 'createAdministrator';
			this.user.dp3 = false;
			this.user.dp7 = false;
			this.user.dp11 = false;
			this.user.dp15 = false;
			this.isAdmin = true;
			this.isTUser = false;
		}else if(this.user.typeOfUser == 'TUser' || this.user.typeOfUser == 'Merchant' || this.user.typeOfUser == 'Carrier' || this.user.typeOfUser == 'Acopio' || this.user.typeOfUser == 'Productor'){
			this.user.nameOfOperation = 'createTUser';
			this.user.dp1 = false;
			this.user.dp2 = false;
			this.user.dp5 = false;
			this.user.dp6 = false;
			this.user.dp9 = false;
			this.user.dp10 = false;
			this.user.dp13 = false;
			this.user.dp14 = false;
			this.isAdmin = false;
			this.isTUser = true;
		}else{
			alert("Selecciona un tipo de usuario");
		}
	}

	public onSubmit(){
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
		
		moment.locale('es');
		var date = ''+moment().format('L')+' - '+moment().format('LT')+'';
		var md5 = new Md5();
		if(this.user.email == '' || this.user.nameOfUser == '' || this.user.password == '' || this.user.addressU == '' || this.user.typeOfUser == ''){
			return alert("Verifica todos los campos");
		}else if(this.user.dp4 == false || this.user.dp8 == false || this.user.dp12 == false || this.user.dp16 == false){
			this.user.dp4 = true;
			this.user.dp8 = true;
			this.user.dp12 = true;
			this.user.dp16 = true;
			alert("Se establecieron los permisos por defecto");
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
			creationDate: date,
			initialToken: this.token,
			addressU: this.user.addressU,
			gas: this.user.gas,
			typeOfOperation: this.user.typeOfOperation,
			nameOfOperation: this.user.nameOfOperation,
			//dp: jsonDP
		};

		 //CHECAR EL MD5 PARA DESPUÉS
		 console.log(JSON.stringify(jsonData));

		var hashX = md5.appendStr(JSON.stringify(jsonData)).end();
		jsonData.dp = jsonDP;
		jsonData.hashX = hashX;

		console.log(jsonData);
		this._userService.createUsers(jsonData).subscribe(
			(response:any) => {
				//console.log(response.message);
				//this.rootCreation = false;
				//this.menu = true;
				//AGREGAR UN MENSAJE DE ÉXITO
				swalWithBootstrapButtons.fire(
					'¡Usuario registrado!',
					'El dato ha sido registrado correctamente',
					'success'
				)
				this._router.navigate(['/tables/1']);
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
				}
			}
		)
	}
}
