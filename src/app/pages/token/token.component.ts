import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';

import { Token } from '../../models/token';


@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  providers: [UserService],
  styleUrls: ['./token.component.css']
})

export class TokenComponent implements OnInit {
	public isHidden: boolean;
	public token: Token;
	public errorMessage: any;
	public email: string;
	public limit: any;

	constructor(
		private _userService:UserService,
		private _route: ActivatedRoute,
		private _router: Router
	){
		this.limit = 0;
		this.isHidden = true;
		this.email = JSON.parse(this._userService.getIdentity());
		this.token = new Token('', this.email.email.replace(/['"]+/g, ''), 'authentication', 'loginUser');
	}

	ngOnInit() {
	}

	public onSubmit(){
		console.log(this.token);
		var jsonData = {
			token: this.token.token.replace(/['"]+/g, ''),
			email: this.token.email,
			typeOfOperation: this.token.typeOfOperation,
			nameOfOperation: this.token.nameOfOperation
		}
		this._userService.checkToken(jsonData).subscribe(
			response => {
				if (response.message == true) {
					console.log(jsonData.token);
					//this.rootCreation = false;
					//this.menu = true;
					//Guardar el token en el localStorage
					localStorage.setItem('token', jsonData.token);
					//console.log(this.token.token);
					this._router.navigate(['/welcome']);
				}else if(response.message == false){
					this.errorMessage = "No tienes permisos para ingresar al sistema";
				}
			},
			error => {
				var errors = <any> error;
				if(errors != null){
					//console.log(errors.error);
					this.errorMessage = errors.error.message;
					if(this.errorMessage == null || this.errorMessage == 'error de users - :C'){
						this.errorMessage = "Token o email incorrectos";
						this.limit = this.limit + 1;
					}else if(this.errorMessage == false){
						this.errorMessage = "No tienes permisos para ingresar al sistema";
						setTimeout(function historyBack(){
							alert("Serás redirigid@ a la página anterior");
							history.back();
						}, 5000);
					}
					//console.log(this.limit);
					if(this.limit == 3){
						localStorage.clear();
						alert("Límite de intentos alcanzados");
						this._router.navigate(['/login']);
					}
				}
			}
		)
	}

}
