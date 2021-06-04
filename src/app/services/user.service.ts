import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, throwError, forkJoin } from 'rxjs'
import { Users } from '../models/users';
import { GLOBAL } from './global';

@Injectable()
export class UserService{
	public token: any;
	public session: any;
	public user: any;
	public company: any;
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

	getInitialNonce(na, gethash = null){
		let json = JSON.stringify(na);
		let params = json;


		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		//let headers = new Headers({'Content-Type':'aplication/json'});

		return this._http.post(this.url+'getInitialNonce', params, {headers: headers});
			//}.pipe(map(res => res.json()));
			//.pipe(map(data => new user(data)));
	}

	createRoot(user, gethash = null){
		if(gethash != null){
			user.gethash = gethash;
		}
		let json = JSON.stringify(user);
		let params = json;
		let token = this.getToken();
		let session = this.getSession();
 		console.log(token, session);
		let headers = new HttpHeaders()
			.set('Content-Type', 'application/json')
			.set('Authorization', token)
			.set('Session', session);

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

	getCompany(){
		let company = localStorage.getItem('nameOfCompany');
		if(company != "undefined"){
			this.company = company;
		}else{
			this.company = null;
		}
		return this.company;
	}

	getSession(){
		let session = localStorage.getItem('session');
		if(session != "undefined"){
			this.session = session;
		}else{
			this.session = null;
		}
		return this.session;
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

	requestDataFromMultipleSources(): Observable<any[]> {
		let responseP = this._http.get(this.url+'getProductorData');
	  let responseA = this._http.get(this.url+'getAcopioData');
	  let responseC = this._http.get(this.url+'getCarrierData');
		let responseM = this._http.get(this.url+'getMerchantData');
		// Observable.forkJoin (RxJS 5) changes to just forkJoin() in RxJS 6
		return forkJoin([responseP, responseA, responseC, responseM]);
	}

	getData(){
		return this._http.get(this.url+'getData');
	}

	merchantsCompany(data, gethash = null){
		if(gethash != null){
			data.gethash = gethash;
		}
		let json = JSON.stringify(data);
		let params = json;
		let headers = new HttpHeaders()
			.set('Content-Type', 'application/json');
		//console.log(headers);
		//let headers = new Headers({'Content-Type':'aplication/json'});

		return this._http.post(this.url+'merchantsCompany', params, {headers: headers});
			//}.pipe(map(res => res.json()));
			//.pipe(map(data => new user(data)));
	}

	getCompanyM(data, gethash = null){
		if(gethash != null){
			data.gethash = gethash;
		}
		let json = JSON.stringify(data);
		let params = json;
		let headers = new HttpHeaders()
			.set('Content-Type', 'application/json');
		return this._http.post(this.url+'getCompanyM', params, {headers: headers});
	}

	merchantData(formData){
		return this._http.post(this.url+'acopiosData', formData);
	}

	carriersCompany(data, gethash = null){
		if(gethash != null){
			data.gethash = gethash;
		}
		let json = JSON.stringify(data);
		let params = json;
		let headers = new HttpHeaders()
			.set('Content-Type', 'application/json');
		//console.log(headers);
		//let headers = new Headers({'Content-Type':'aplication/json'});

		return this._http.post(this.url+'carriersCompany', params, {headers: headers});
			//}.pipe(map(res => res.json()));
			//.pipe(map(data => new user(data)));
	}

	getCompanyC(data, gethash = null){
		if(gethash != null){
			data.gethash = gethash;
		}
		let json = JSON.stringify(data);
		let params = json;
		let headers = new HttpHeaders()
			.set('Content-Type', 'application/json');
		return this._http.post(this.url+'getCompanyC', params, {headers: headers});
	}

	carrierData(formData){
		return this._http.post(this.url+'acopiosData', formData);
	}

	acopiosCompany(data, gethash = null){
		if(gethash != null){
			data.gethash = gethash;
		}
		let json = JSON.stringify(data);
		let params = json;
		let headers = new HttpHeaders()
			.set('Content-Type', 'application/json');
		//console.log(headers);
		//let headers = new Headers({'Content-Type':'aplication/json'});

		return this._http.post(this.url+'acopiosCompany', params, {headers: headers});
			//}.pipe(map(res => res.json()));
			//.pipe(map(data => new user(data)));
	}

	getCompanyA(data, gethash = null){
		if(gethash != null){
			data.gethash = gethash;
		}
		let json = JSON.stringify(data);
		let params = json;
		let headers = new HttpHeaders()
			.set('Content-Type', 'application/json');
		return this._http.post(this.url+'getCompanyA', params, {headers: headers});
	}

	acopioData(formData){
		return this._http.post(this.url+'acopiosData', formData);
	}

	productorsCompany(data, gethash = null){
		if(gethash != null){
			data.gethash = gethash;
		}
		let json = JSON.stringify(data);
		let params = json;
		let headers = new HttpHeaders()
			.set('Content-Type', 'application/json');
		//console.log(headers);
		//let headers = new Headers({'Content-Type':'aplication/json'});

		return this._http.post(this.url+'productorsCompany', params, {headers: headers});
			//}.pipe(map(res => res.json()));
			//.pipe(map(data => new user(data)));
	}

	getCompanyP(data, gethash = null){
		if(gethash != null){
			data.gethash = gethash;
		}
		let json = JSON.stringify(data);
		let params = json;
		let headers = new HttpHeaders()
			.set('Content-Type', 'application/json');
		return this._http.post(this.url+'getCompanyP', params, {headers: headers});
	}

	productorData(formData){
		return this._http.post(this.url+'acopiosData', formData);
	}
}
