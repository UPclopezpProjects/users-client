import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { Root } from '../../models/root';
import { Md5 } from 'ts-md5/dist/md5';

const SECRET_KEY = 'secret_key';

@Component({
  selector: 'app-root-welcome',
  templateUrl: './root-welcome.component.html',
  providers: [UserService],
  styleUrls: ['./root-welcome.component.scss']
})
export class RootWelcomeComponent implements OnInit {
  public isHidden: boolean;
  public errorMessage: any;
  public root: Root;


  constructor(
		private _userService:UserService,
		private _route: ActivatedRoute,
		private _router: Router
  ){
    this.isHidden = true;
    this.root = new Root(Math.random());
  }

  ngOnInit() {
  }

  public onSubmit(){
    var md5 = new Md5();
    var wordArray = CryptoJS.enc.Utf8.parse(this.root.na);
    var base64 = CryptoJS.enc.Base64.stringify(wordArray);
    //console.log('encrypted:', base64);
    var jsonData:any;
		jsonData = {
			na: base64
		};
    this._userService.getInitialNonce(jsonData).subscribe(
      (response:any) => {
       console.log(response);

       var token = md5.appendStr(JSON.stringify(response.na+response.nb)).end();
       localStorage.setItem('session', JSON.stringify(response.A));
       localStorage.setItem('token', JSON.stringify(token));
       console.log(localStorage.getItem('token'), localStorage.getItem('session'));
       this._router.navigate(['/rootCreation']);

     },
     error => {
       var errorMessage = <any> error;
       if(errorMessage != null){
         this.errorMessage = error.error.message;
         console.log(errorMessage);

       }
     }
   )
	}
}
