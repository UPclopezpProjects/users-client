import { Component, OnInit, Input } from '@angular/core';
import { Users } from '../../models/users';
import { TUsers } from '../../models/tusers';

import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

import Swal from 'sweetalert2';
const swalWithBootstrapButtons = Swal.mixin({
	customClass: {
		confirmButton: 'btn btn-success',
		cancelButton: 'btn btn-danger'
	},
	buttonsStyling: false
})

@Component({
  selector: 'app-merchant-home',
  templateUrl: './merchant-home.component.html',
  //styleUrls: ['./merchant-home.component.css']
  providers: [UserService],
  styleUrls: ['../../../assets/css/app.component.css']
})
export class MerchantHomeComponent implements OnInit {
  public users: Users;
  public tuser: TUsers;
  public identity;
  public nameOfCompany;
  public isHidden: boolean;
  public infoMessage: any;
	public token: any;


  constructor(
    private _userService: UserService,
		private _router: Router
  ) {
		this.token = this._userService.getToken();
    this.identity = this._userService.getIdentity();
    this.nameOfCompany = this._userService.getCompany();
    this.users = JSON.parse(this.identity);
    this.tuser = new TUsers('null', '', '', '', 'null', this.users.typeOfUser, '', null, '');
  }

  ngOnInit(): void {
    if(this.nameOfCompany == null || this.nameOfCompany == '""'){
      this.checkCompany();
    }else{
			this.nameOfCompany = this._userService.getCompany().replace(/['"]+/g, '');
      this.isHidden = false;
    }
  }

	public checkCompany() {
		var jsonData:any
		jsonData = {
			email: this.users.email
		};
		if(this.users.typeOfUser == 'Merchant'){
			this._userService.getCompanyM(jsonData, this.token).subscribe(
				(response:any) => {
					if(response.message == null){
						this.isHidden = true;
					}else{
						this.isHidden = false;
						localStorage.setItem('nameOfCompany', JSON.stringify(response.message.nameOfCompany));
					}
				},
				error => {
					var errorMessage = <any> error;
					if(errorMessage != null){
						//console.log("Administrator: "+error.error.message);
						this.infoMessage = error.error.message;
						this.isHidden = true;
						swalWithBootstrapButtons.fire(
							'¡Error!',
							this.infoMessage,
							'error'
						)
					}
				}
			)
		}else if(this.users.typeOfUser == 'Carrier'){
			this._userService.getCompanyC(jsonData, this.token).subscribe(
				(response:any) => {
					console.log(response);

					if(response.message == null){
						this.isHidden = true;
					}else{
						this.isHidden = false;
						localStorage.setItem('nameOfCompany', JSON.stringify(response.message.nameOfCompany));
					}
				},
				error => {
					var errorMessage = <any> error;
					if(errorMessage != null){
						this.infoMessage = error.error.message;
						this.isHidden = true;
						swalWithBootstrapButtons.fire(
							'¡Error!',
							this.infoMessage,
							'error'
						)
					}
				}
			)
		}else if(this.users.typeOfUser == 'Acopio'){
			this._userService.getCompanyA(jsonData, this.token).subscribe(
				(response:any) => {
					if(response.message == null){
						this.isHidden = true;
					}else{
						this.isHidden = false;
						localStorage.setItem('nameOfCompany', JSON.stringify(response.message.nameOfCompany));
					}
				},
				error => {
					var errorMessage = <any> error;
					if(errorMessage != null){
						this.infoMessage = error.error.message;
						this.isHidden = true;
						swalWithBootstrapButtons.fire(
							'¡Error!',
							this.infoMessage,
							'error'
						)
					}
				}
			)
		}else if(this.users.typeOfUser == 'Productor'){
			this._userService.getCompanyP(jsonData, this.token).subscribe(
				(response:any) => {
					if(response.message == null){
						this.isHidden = true;
					}else{
						this.isHidden = false;
						localStorage.setItem('nameOfCompany', JSON.stringify(response.message.nameOfCompany));
					}
				},
				error => {
					var errorMessage = <any> error;
					if(errorMessage != null){
						this.infoMessage = error.error.message;
						this.isHidden = true;
						swalWithBootstrapButtons.fire(
							'¡Error!',
							this.infoMessage,
							'error'
						)
					}
				}
			)
		}
	}

  public onSubmit(){
    this.nameOfCompany = this.tuser.nameOfCompany;
    var jsonData:any
		jsonData = {
			email: this.users.email,
			nameOfCompany: this.nameOfCompany
		};
    if(this.users.typeOfUser == 'Merchant'){
			this._userService.merchantsCompany(jsonData, this.token).subscribe(
				(response:any) => {
					this.infoMessage = response.message;
					swalWithBootstrapButtons.fire(
						'¡Datos comprobados!',
						'El dato ha sido comprobado correctamente',
						'success'
					)
					localStorage.setItem('nameOfCompany', JSON.stringify(this.nameOfCompany));
          this.ngOnInit();
				},
				error => {
					var errorMessage = <any> error;
					if(errorMessage != null){
						//console.log("Administrator: "+error.error.message);
						this.infoMessage = error.error.message;
						this.isHidden = true;
						swalWithBootstrapButtons.fire(
							'¡Error!',
							this.infoMessage,
							'error'
						)
					}
				}
			)
		}else if(this.users.typeOfUser == 'Carrier'){
			this._userService.carriersCompany(jsonData, this.token).subscribe(
				(response:any) => {
					this.infoMessage = response.message;
					swalWithBootstrapButtons.fire(
						'¡Datos comprobados!',
						'El dato ha sido comprobado correctamente',
						'success'
					)
					localStorage.setItem('nameOfCompany', JSON.stringify(this.nameOfCompany));
          this.ngOnInit();
				},
				error => {
					var errorMessage = <any> error;
					if(errorMessage != null){
						this.infoMessage = error.error.message;
						this.isHidden = true;
						swalWithBootstrapButtons.fire(
							'¡Error!',
							this.infoMessage,
							'error'
						)
					}
				}
			)
		}else if(this.users.typeOfUser == 'Acopio'){
			this._userService.acopiosCompany(jsonData, this.token).subscribe(
				(response:any) => {
					this.infoMessage = response.message;
					swalWithBootstrapButtons.fire(
						'¡Datos comprobados!',
						'El dato ha sido comprobado correctamente',
						'success'
					)
					localStorage.setItem('nameOfCompany', JSON.stringify(this.nameOfCompany));
          this.ngOnInit();
				},
				error => {
					var errorMessage = <any> error;
					if(errorMessage != null){
						this.infoMessage = error.error.message;
						this.isHidden = true;
						swalWithBootstrapButtons.fire(
							'¡Error!',
							this.infoMessage,
							'error'
						)
					}
				}
			)
		}else if(this.users.typeOfUser == 'Productor'){
			this._userService.productorsCompany(jsonData, this.token).subscribe(
				(response:any) => {
					this.infoMessage = response.message;
					swalWithBootstrapButtons.fire(
						'¡Datos comprobados!',
						'El dato ha sido comprobado correctamente',
						'success'
					)
					localStorage.setItem('nameOfCompany', JSON.stringify(this.nameOfCompany));
          this.ngOnInit();
				},
				error => {
					var errorMessage = <any> error;
					if(errorMessage != null){
						this.infoMessage = error.error.message;
						this.isHidden = true;
						swalWithBootstrapButtons.fire(
							'¡Error!',
							this.infoMessage,
							'error'
						)
					}
				}
			)
		}
  }
}
