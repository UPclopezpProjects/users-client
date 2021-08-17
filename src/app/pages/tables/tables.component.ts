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
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  providers: [UserService],
  styleUrls: ['./tables.component.scss']
})

export class TablesComponent implements OnInit {
	public token: any;
	public form: any;
	public isHidden: boolean;
	public isTUser: boolean;
	public identity;
	public users: Users;
	public usersToUpdate: Users;
	public user: Users;
	public errorMessage: any;
	public nameOfOperation;
	public response;
	public nextPage: number;
	public prevPage: number;
	public items;
	public usersView = [];

	constructor(
		private _userService:UserService,
		private _route: ActivatedRoute,
		private _router: Router
	){
		this.items = 0;
		this.nextPage = 1;
		this.prevPage = 1;
		this.isHidden = true;
		this.isTUser = true;
		this.identity = this._userService.getIdentity();
		//this.user = new Users('null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', null, null, null, null, null, null, null, null, null, null, null, null);
		//this.user = new Users('email', 'password', 'initialToken', 'typeOfOperation', 'nameOfOperation', 'addressU', 'hashX', 'typeOfUser', 'dp1', 'dp2', 'dp3', 'dp4', 'dp5', 'dp6', 'dp7', 'dp8', 'dp9', 'dp10', 'dp11', 'dp12');
		this.user = JSON.parse(this.identity);
		//console.log(this.user);
		this.token = this._userService.getToken();

	}

	ngOnInit() {
		this.getUsers();
	}

	public getUsers(){
		this._route.params.forEach((params: Params) =>{
			let page = JSON.parse(params['page']);
			if(!page){
				page = 1;
			}else{
				this.nextPage = page + 1;
				this.prevPage = page - 1;
				if(this.prevPage <= 0){
					this.prevPage = 1;
				}
			}
			this._userService.getUsers(this.token, page).subscribe(
				(response:any) => {
					this.items = response.total_items - 1;
					if(response.users.length == 0){
						swalWithBootstrapButtons.fire(
							'Alto',
							'No existen más usuarios',
							'info'
						)
						this._router.navigate(['/tables/1']);
					}
					if(!response.users){
						this._router.navigate(['/']);
					}else{
						console.log(response.users);

						this.users = response.users;
						for(var user of response.users){
							if(user.status == 'true'){
								user.status = 'Habilitado';
							}else if(user.status == 'false'){
								user.status = 'Deshabilitado';
							}
							this.usersView.push(user);
						}
					}
				},
				error => {
					var errorMessage = <any> error;
					if(errorMessage != null){
						//console.log("Administrator: "+error.error.message);
						this.errorMessage = error.error.message;
						this.users = new Users('null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', null, null, null, null, null, null, null, null, null, null, null, null);
					}
				}
			)
		});
	}

	deleteUser(email){
		for(var user of this.usersView){
			if(this.user.email == user.email){
				this._router.navigate(['/user-profile']);
			}else if(user.email == email){
				if(user.typeOfUser == 'Administrator'){
					this.nameOfOperation = 'deleteAdministrator';
				}else if(user.typeOfUser == 'TUser' || user.typeOfUser == 'Merchant' || user.typeOfUser == 'Carrier' || user.typeOfUser == 'Acopio' || user.typeOfUser == 'Productor'){
					this.nameOfOperation = 'deleteTUser';
				}else{
					this.nameOfOperation = null;
				}
			}
		}
		swalWithBootstrapButtons.fire({
		  title: '¿Estás seguro?',
		  text: "¡No podrás recuperar este registro!",
		  icon: 'question',
		  showCancelButton: true,
		  confirmButtonText: '¡Sí, bórralo!',
		  cancelButtonText: '¡No, cancélalo!',
		  reverseButtons: true
		})
		.then((result) => {
			if (result.isConfirmed) {
				var jsonData = {
					typeOfOperation: 'delete',
					nameOfOperation: this.nameOfOperation,
				};
				this._userService.deleteUsers(email, jsonData).subscribe(
					(response:any) => {
						swalWithBootstrapButtons.fire(
					      '¡Borrado!',
					      'El registro ha sido eliminado',
					      'success'
					    )
					    this.ngOnInit();
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
					'No se borrará este registro',
					'info'
				)
			}
		})
	}

	async updateUser(email){
		for(var user of this.usersView){
			if(this.user.email == user.email){
				this._router.navigate(['/user-profile']);
			}else if(user.email == email){
				//this.usersToUpdate = user;
				var responseDP = JSON.parse(user.dp);
				if(user.typeOfUser == 'Administrator'){
					this.nameOfOperation = 'updateAdministrator';
				}else if(user.typeOfUser == 'TUser' || user.typeOfUser == 'Merchant' || user.typeOfUser == 'Carrier' || user.typeOfUser == 'Acopio' || user.typeOfUser == 'Productor'){
					this.nameOfOperation = 'updateTUser';
				}else{
					this.nameOfOperation = null;
				}
			}
		}
		console.log(responseDP);
		const { value: formValues } = await Swal.fire({
		  title: 'Multiple inputs',
		  html:
		    '<div class="row">'+
			    '<div class="col">'+
				    '<label>Nombre de usuario:</label>'+
				    '<input id="swal-input1" class="swal2-input" value='+email+' disabled>'+
			    '</div>'+
			    '<div class="col">'+
				    '<label>Contraseña:</label>'+
				    '<input id="swal-input2" class="swal2-input">'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col">'+
					'<select id="swal-input3" [(value)]="selected">'+
						'<option value=true>Habilitado</option>'+
						'<option value=false>Deshabilitado</option>'+
					'</select><br>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
			    '<div class="col">'+
				    '<label><input type="checkbox" id="swal-input4" value="'+responseDP.createAdministrator+'"> Creación de usuarios administradores</label>'+
			    '</div>'+
			    '<div class="col">'+
				    '<label><input type="checkbox" id="swal-input5" value='+responseDP.createTUser+'> Creación de usuarios normale</label>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
			    '<div class="col">'+
				    '<label><input type="checkbox" id="swal-input6" value='+responseDP.updateMe+'> Actualización de datos personales</label>'+
			    '</div>'+
			    '<div class="col">'+
				    '<label><input type="checkbox" id="swal-input7" value='+responseDP.updateAdministrator+'> Actualización de usuarios administradores</label>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
			    '<div class="col">'+
				    '<label><input type="checkbox" id="swal-input8" value='+responseDP.updateTUser+'> Actualización de usuarios normales</label>'+
			    '</div>'+
			    '<div class="col">'+
				    '<label><input type="checkbox" id="swal-input9" value='+responseDP.deleteMe+'> Eliminación de cuenta</label>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
			    '<div class="col">'+
				    '<label><input type="checkbox" id="swal-input10" value='+responseDP.deleteAdministrator+'> Eliminación de usuarios administradores</label>'+
			    '</div>'+
			    '<div class="col">'+
				    '<label><input type="checkbox" id="swal-input11" value='+responseDP.deleteTUser+'> Eliminación de usuarios normales</label>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
			    '<div class="col">'+
				    '<label><input type="checkbox" id="swal-input12" value='+responseDP.readMe+'> Lectura de datos personales</label>'+
			    '</div>'+
			    '<div class="col">'+
				    '<label><input type="checkbox" id="swal-input13" value='+responseDP.readAdministrator+'> Lectura de usuarios administradores</label>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
			    '<div class="col">'+
				    '<label><input type="checkbox" id="swal-input14" value='+responseDP.readTUser+'> Lectura de usuarios normales</label>'+
			    '</div>'+
			    '<div class="col">'+
				    '<label><input type="checkbox" id="swal-input15" value='+responseDP.loginUser+'> Autenticación</label>'+
				'</div>'+
			'</div>',
		  focusConfirm: false,
		  preConfirm: () => {
		    return [
					(<HTMLInputElement>document.getElementById('swal-input1')).value,
					(<HTMLInputElement>document.getElementById('swal-input2')).value,
					(<HTMLInputElement>document.getElementById('swal-input3')).value,
					(<HTMLInputElement>document.getElementById('swal-input4')).value,
					(<HTMLInputElement>document.getElementById('swal-input5')).value,
					(<HTMLInputElement>document.getElementById('swal-input6')).value,
					(<HTMLInputElement>document.getElementById('swal-input7')).value,
					(<HTMLInputElement>document.getElementById('swal-input8')).value,
					(<HTMLInputElement>document.getElementById('swal-input9')).value,
					(<HTMLInputElement>document.getElementById('swal-input10')).value,
					(<HTMLInputElement>document.getElementById('swal-input11')).value,
					(<HTMLInputElement>document.getElementById('swal-input12')).value,
					(<HTMLInputElement>document.getElementById('swal-input13')).value,
					(<HTMLInputElement>document.getElementById('swal-input14')).value,
					(<HTMLInputElement>document.getElementById('swal-input15')).value
		    ]
		  }
		})

		if (formValues) {
			console.log(formValues[2]);
		  Swal.fire(JSON.stringify(formValues))
		}
	}
}
