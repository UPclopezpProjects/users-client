import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
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
  selector: 'app-merchant-about',
  templateUrl: './merchant-about.component.html',
  providers: [UserService],
  //styleUrls: ['./merchant-about.component.css']
  styleUrls: ['../../../assets/css/app.component.css']
})
export class MerchantAboutComponent implements OnInit {
	public identity;
	public isTUser: boolean;
	public user: Users;
	public errorMessage;
	public token;
  public isHidden: boolean;
  public nameOfCompany;

	constructor(
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.identity = JSON.parse(this._userService.getIdentity());
    this.user = this.identity;
		this.token = this._userService.getToken();
    this.isHidden = true;
    this.nameOfCompany = this._userService.getCompany();
  }

  ngOnInit() {
		this.getUser();
    if(this.nameOfCompany == null || this.nameOfCompany == '""'){
      swalWithBootstrapButtons.fire(
        '¡Alto!',
        'Necesitas proporcionar un nombre para tu empresa',
        'warning'
      )
      //this.nameOfCompany = 'NOMBRE DE EMPRESA SIN COMPROBAR';
			return;
    }else{
			this.nameOfCompany = this._userService.getCompany().replace(/['"]+/g, '');
		}
  }

  public getUser(){
    this._userService.getUser(this.token, this.identity.email).subscribe(
      (response:any) => {
        if(!response.user){
          this._router.navigate(['/']);
        }else{
          var responseDP = JSON.parse(this.identity.dp);
					console.log(responseDP);

		  		var jsonData = {
            email: this.identity.email,
		  			password: this.identity.password,
            surnameA: this.identity.surnameA,
            surnameB: this.identity.surnameB,
		  			typeOfUser: this.identity.typeOfUser,
		  			initialToken: this.identity.initialToken,
		  			typeOfOperation: 'read',
		  			nameOfOperation: 'readMe',
		  			addressU: this.identity.addressU,
						gas: this.identity.gas,
            hashX: this.identity.hashX,
            status: this.identity.status,
            creationDate: this.identity.creationDate,
		  			nameOfUser: this.identity.nameOfUser,
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
        }
      },
      error => {
        var errorMessage = <any> error;
        if(errorMessage != null){
          this.isHidden = false;
          //console.log(error.error.message);
          this.errorMessage = error.error.message;
          this.user = new Users('null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        }
      }
    );
  }
}
