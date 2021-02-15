import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs'

import { Users } from '../models/users';
import { GLOBAL } from './global';

@Injectable()
export class UserService{
	public token: any;
	public user: any;
	public url: string;

	constructor(private _http: HttpClient){
		this.url = GLOBAL.url;
	}

	singUp(user, gethash = null){
		if(gethash != null){
			user.gethash = gethash;
		}
		let json = JSON.stringify(user);
		let params = json;
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		//let headers = new Headers({'Content-Type':'aplication/json'});

		return this._http.post(this.url+'login', params, {headers: headers});
			//}.pipe(map(res => res.json()));
			//.pipe(map(data => new user(data)));
	}

	createRoot(user, gethash = null){
		if(gethash != null){
			user.gethash = gethash;
		}
		let json = JSON.stringify(user);
		let params = json;


		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		//let headers = new Headers({'Content-Type':'aplication/json'});

		return this._http.post(this.url+'userCreation', params, {headers: headers});
			//}.pipe(map(res => res.json()));
			//.pipe(map(data => new user(data)));
	}

	createUsers(user, gethash = null){
		if(gethash != null){
			user.gethash = gethash;
		}
		let json = JSON.stringify(user);
		let params = json;
		let token = this.getToken();
		let headers = new HttpHeaders()
			.set('Content-Type', 'application/json')
			.set('Authorization', token);
		//console.log(headers);
		//let headers = new Headers({'Content-Type':'aplication/json'});

		return this._http.post(this.url+'userCreation', params, {headers: headers});
			//}.pipe(map(res => res.json()));
			//.pipe(map(data => new user(data)));
	}

	checkToken(token, gethash = null){
		if(gethash != null){
			token.gethash = gethash;
		}
		let json = JSON.stringify(token);
		let params = json;

		let headers = new HttpHeaders()
			.set('Content-Type', 'application/json');
		//let headers = new Headers({'Content-Type':'aplication/json'});

		return this._http.post(this.url+'login/token', params, {headers: headers});
			//}.pipe(map(res => res.json()));
			//.pipe(map(data => new user(data)));
	}

	getUser(token, id: string){
		let headers = new HttpHeaders()
			.set('Content-Type', 'application/json')
			.set('Authorization', token);
		return this._http.get(this.url+'userDetails/'+id, {headers: headers});
	}

	getUsers(token, page: string){
		let headers = new HttpHeaders()
			.set('Content-Type', 'application/json')
			.set('Authorization', token);
		return this._http.get(this.url+'usersDetails/'+page, {headers: headers});
	}

	getToken(){
		let token = localStorage.getItem('token');
		if(token != "undefined"){
			this.token = token;
		}else{
			this.token = null;
		}
		return this.token;
	}

	getIdentity(){
		let user = localStorage.getItem('identity');
		if(user != "undefined"){
			this.user = user;
		}else{
			this.user = null;
		}
		return this.user;
	}

	updateUsers(id:string, user){
		let json = JSON.stringify(user);
		let params = json;
		let token = this.getToken();
		let headers = new HttpHeaders()
			.set('Content-Type', 'application/json')
			.set('Authorization', token);
		//console.log(headers);
		//let headers = new Headers({'Content-Type':'aplication/json'});
		return this._http.put(this.url+'userUpdate/'+id, params, {headers: headers});
			//}.pipe(map(res => res.json()));
			//.pipe(map(data => new user(data)));
	}

	deleteUsers(id:string, user){
		let json = JSON.stringify(user);
		let params = json;
		let token = this.getToken();
		let headers = new HttpHeaders()
			.set('Content-Type', 'application/json')
			.set('Authorization', token);
		const options = {
			headers: headers,
			body: params
		}
		return this._http.delete(this.url+'userDelete/'+id, options);
			//}.pipe(map(res => res.json()));
			//.pipe(map(data => new user(data)));
	}

	merchantData(merchant, gethash = null){
		if(gethash != null){
			merchant.gethash = gethash;
		}
		let json = JSON.stringify(merchant);
		let params = json;
		let token = this.getToken();
		let headers = new HttpHeaders()
			.set('Content-Type', 'application/json')
			.set('Authorization', token);
		//console.log(headers);
		//let headers = new Headers({'Content-Type':'aplication/json'});

		return this._http.post(this.url+'merchantsData', params, {headers: headers});
			//}.pipe(map(res => res.json()));
			//.pipe(map(data => new user(data)));
	}

	carrierData(merchant, gethash = null){
		if(gethash != null){
			merchant.gethash = gethash;
		}
		let json = JSON.stringify(merchant);
		let params = json;
		let token = this.getToken();
		let headers = new HttpHeaders()
			.set('Content-Type', 'application/json')
			.set('Authorization', token);
		//console.log(headers);
		//let headers = new Headers({'Content-Type':'aplication/json'});

		return this._http.post(this.url+'carriersData', params, {headers: headers});
			//}.pipe(map(res => res.json()));
			//.pipe(map(data => new user(data)));
	}

	acopioData(merchant, gethash = null){
		if(gethash != null){
			merchant.gethash = gethash;
		}
		let json = JSON.stringify(merchant);
		let params = json;
		let token = this.getToken();
		let headers = new HttpHeaders()
			.set('Content-Type', 'application/json')
			.set('Authorization', token);
		//console.log(headers);
		//let headers = new Headers({'Content-Type':'aplication/json'});

		return this._http.post(this.url+'acopiosData', params, {headers: headers});
			//}.pipe(map(res => res.json()));
			//.pipe(map(data => new user(data)));
	}

	productorData(merchant, gethash = null){
		if(gethash != null){
			merchant.gethash = gethash;
		}
		let json = JSON.stringify(merchant);
		let params = json;
		let token = this.getToken();
		let headers = new HttpHeaders()
			.set('Content-Type', 'application/json')
			.set('Authorization', token);
		//console.log(headers);
		//let headers = new Headers({'Content-Type':'aplication/json'});

		return this._http.post(this.url+'productorsData', params, {headers: headers});
			//}.pipe(map(res => res.json()));
			//.pipe(map(data => new user(data)));
	}
}
