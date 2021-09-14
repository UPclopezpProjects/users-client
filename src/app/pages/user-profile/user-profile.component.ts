import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Users } from '../../models/users';
import { Md5 } from 'ts-md5/dist/md5';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  providers: [UserService],
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
	public identity;
	public token;
	public errorMessage;
	public isHidden: boolean;
	public user: Users;
  public isRoot: boolean;

  public addressContract;
  public addressTransaction;
  public hash;

	constructor(
		private _userService: UserService,
  		private _route: ActivatedRoute,
  		private _router: Router
  	) {
		this.identity = JSON.parse(this._userService.getIdentity());
    this.user = this.identity;
    //this.user = new Users('', '', '', '', '', this.token, 'create', '', '', '', '', true, 'xx/xx/xxxx', '', false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false);
		this.token = this._userService.getToken();
		this.isHidden = true;
    this.isRoot = false;
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
					var responseDP = JSON.parse(response.user.dp);
					this.user = {
						email: response.user.email,
						password: response.user.password,
            surnameA: response.user.surnameA,
            surnameB: response.user.surnameB,
						typeOfUser: response.user.typeOfUser,
						initialToken: response.user.initialToken,
						typeOfOperation: 'read',
						nameOfOperation: 'readMe',
						addressU: response.user.addressU,
            gas: response.user.gas,
						nameOfUser: response.user.nameOfUser,
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
          if (this.user.typeOfUser == 'Root') {
            this.isRoot = true;
            var md5 = new Md5();
            var jsonDP = '{ "createAdministrator": '+this.user.dp1+', "createTUser": '+this.user.dp2+', "createData": '+this.user.dp3+', "updateMe": '+this.user.dp4+', "updateAdministrator": '+this.user.dp5+', "updateTUser": '+this.user.dp6+', "updateData": '+this.user.dp7+', "deleteMe": '+this.user.dp8+', "deleteAdministrator": '+this.user.dp9+', "deleteTUser": '+this.user.dp10+', "deleteData": '+this.user.dp11+', "readMe": '+this.user.dp12+', "readAdministrator": '+this.user.dp13+', "readTUser": '+this.user.dp14+', "readData": '+this.user.dp15+', "loginUser": '+this.user.dp16+' }';
            var jsonData:any;
        		jsonData = {
        			email: response.user.email.toLowerCase(),
        			//password: response.user.password,
        			surnameA: response.user.surnameA,
        			surnameB: response.user.surnameB,
        			nameOfUser: response.user.nameOfUser,
        			typeOfUser: response.user.typeOfUser,
        			status: true,
        			creationDate: response.user.creationDate,
        			//initialToken: this.user.initialToken,
        			addressU: response.user.addressU,
        			gas: '900000',
        			typeOfOperation: 'create',
        			nameOfOperation: 'createRoot',
        			dp: jsonDP
        		};
            console.log(JSON.stringify(jsonData));

            var hashX = md5.appendStr(JSON.stringify(jsonData)).end();

            this.addressContract = response.user.addressContract;
            this.addressTransaction = response.user.addressTransaction;
            this.hash = hashX;
          }
					//console.log(this.user);
					if(this.user.dp3 == false || this.user.dp9 == false){
			  			this.isHidden = false;
			  	}
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
