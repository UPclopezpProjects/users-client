import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../../services/user.service';
import { Login } from '../../models/login';

import Swal from 'sweetalert2';

const swalWithBootstrapButtons = Swal.mixin({
	customClass: {
		confirmButton: 'btn btn-success',
		cancelButton: 'btn btn-danger'
	},
	buttonsStyling: false
})

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  providers: [UserService],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
	public isHidden: boolean;

	public user: Login;
	public menu: boolean;
	public errorMessage: any;

	constructor(
		private _userService:UserService,
		private _route: ActivatedRoute,
		private _router: Router
	){
		console.log(localStorage);
		localStorage.clear();
		this.isHidden = true;
		//this.menu = false;
		this.user = new Login('', '', '', 'authentication', 'loginUser');
	}

	ngOnInit() {
	}

	public onSubmit(){
		if(this.user.email == '' || this.user.password == ''){
			return alert("Rellena todos los campos");
		}
		this._userService.singUp(this.user).subscribe(
			response => {
				console.log(response);
				if(response.message == true){
					//console.log(response.user);
					//this.rootCreation = false;
					//this.menu = true;
					localStorage.setItem('token', response.token.replace(/['"]+/g, ''));
					localStorage.setItem('identity', JSON.stringify(response.user));
					if(response.user.typeOfUser == 'Root' || response.user.typeOfUser == 'Administrator'){
						this._router.navigate(['/welcome']);
					}else{
						this._router.navigate(['/merchantsHome']);
					}
				}else if(response.message == false){
					this.errorMessage = "No tienes permisos para ingresar al sistema";
				}else if(response.message == null){
					this.errorMessage = "Estás deshabilitado en el sistema";
					swalWithBootstrapButtons.fire(
						'Error',
						this.errorMessage,
						'warning'
					)

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
				}
			}
		)
	}
  ngOnDestroy() {
  }

}

