import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Users } from '../../models/users';


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
        if(!response.user){
          this._router.navigate(['/']);
        }else{
          var responseDP = JSON.parse(this.identity.dp);
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
		  			nameOfUser: this.identity.nameOfUser,
		  			creationDate: this.identity.creationDate,
		  			status: this.identity.status,
		  			hashX: this.identity.hashX,
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
		  		this.user = jsonData;
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
}
