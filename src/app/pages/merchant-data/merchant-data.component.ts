import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Users } from '../../models/users';
import { Productors } from '../../models/productors';
import { Acopios } from '../../models/acopios';
import { Carriers } from '../../models/carriers';
import { Merchants } from '../../models/merchants';
import { TUsers } from '../../models/tusers';
declare const google: any;
import Swal from 'sweetalert2';

const swalWithBootstrapButtons = Swal.mixin({
	customClass: {
		confirmButton: 'btn btn-success',
		cancelButton: 'btn btn-danger'
	},
	buttonsStyling: false
})

@Component({
  selector: 'app-merchant-data',
  templateUrl: './merchant-data.component.html',
  providers: [UserService],
  //styleUrls: ['./merchant-data.component.css']
  styleUrls: ['../../../assets/css/app.component.css']
})
export class MerchantDataComponent implements OnInit {
	public infoMessage: any;
	public isMerchant: boolean;
	public isCarrier: boolean;
	public isAcopio: boolean;
	public isProductor: boolean;
	public isHidden: boolean;
	public identity;
	public token;
	public title;
	public users: Users;
	public productor: Productors;
	public acopio: Acopios;
	public carrier: Carriers;
	public merchant: Merchants;
	public tuser: TUsers;

	public dataP: any;
	public dataA: any;
	public dataC: any;
	public dataM: any;


	public markers = [];

	constructor(
		private _userService:UserService,
		private _router: Router
	){
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.users = JSON.parse(this.identity);
		this.tuser = new TUsers('null', '', '', 'null', this.users.typeOfUser);
		this.productor = new Productors('', '', '', '', '');
		this.acopio = new Acopios();
		this.carrier = new Carriers();
		this.merchant = new Merchants('');
		this.isMerchant = false;
		this.isCarrier = false;
		this.isAcopio = false;
		this.isProductor = false;
		this.isHidden = false;
	}

	public onSubmit(){
		var jsonData:any
		jsonData = {
			fid: this.tuser.fid,
			ubication: this.tuser.ubication,
			name: this.tuser.name,
			previousStage: this.tuser.previousStage,
			currentStage: this.tuser.currentStage
		};
		if(this.users.typeOfUser == 'Merchant'){
			jsonData.code = this.merchant.code;
			this._userService.merchantData(jsonData).subscribe(
				(response:any) => {
					swalWithBootstrapButtons.fire(
						'¡Datos comprobados!',
						'El dato ha sido comprobado correctamente',
						'success'
					)
					console.log(response);
					this.tuser = new TUsers('', '', '', '', this.users.typeOfUser);
					this.infoMessage = response.message;
				},
				error => {
					var errorMessage = <any> error;
					if(errorMessage != null){
						//console.log("Administrator: "+error.error.message);
						this.infoMessage = error.error.message;
						swalWithBootstrapButtons.fire(
							'¡Error!',
							this.infoMessage,
							'error'
						)
					}
				}
			)
		}else if(this.users.typeOfUser == 'Carrier'){
			//jsonData.code = this.merchant.code; Changes when carrier get data
			this._userService.carrierData(jsonData).subscribe(
				(response:any) => {
					swalWithBootstrapButtons.fire(
						'¡Datos comprobados!',
						'El dato ha sido comprobado correctamente',
						'success'
					)
					console.log(response);
					this.infoMessage = response.message;
				},
				error => {
					var errorMessage = <any> error;
					if(errorMessage != null){
						this.infoMessage = error.error.message;
						swalWithBootstrapButtons.fire(
							'¡Error!',
							this.infoMessage,
							'error'
						)
					}
				}
			)
		}else if(this.users.typeOfUser == 'Acopio'){
			//jsonData.code = this.merchant.code; Changes when acopio get data
			this._userService.acopioData(jsonData).subscribe(
				(response:any) => {
					swalWithBootstrapButtons.fire(
						'¡Datos comprobados!',
						'El dato ha sido comprobado correctamente',
						'success'
					)
					console.log(response);
					this.infoMessage = response.message;
				},
				error => {
					var errorMessage = <any> error;
					if(errorMessage != null){
						this.infoMessage = error.error.message;
						swalWithBootstrapButtons.fire(
							'¡Error!',
							this.infoMessage,
							'error'
						)
					}
				}
			)
		}else if(this.users.typeOfUser == 'Productor'){
			jsonData.harvestDate = this.productor.harvestDate;
			jsonData.caducationDate = this.productor.caducationDate;
			jsonData.description = this.productor.description;
			jsonData.documentation = this.productor.documentation;
			jsonData.image = this.productor.image;
			this._userService.productorData(jsonData).subscribe(
				(response:any) => {
					swalWithBootstrapButtons.fire(
						'¡Datos comprobados!',
						'El dato ha sido comprobado correctamente',
						'success'
					)
					console.log(response);
					this.infoMessage = response.message;
				},
				error => {
					var errorMessage = <any> error;
					if(errorMessage != null){
						this.infoMessage = error.error.message;
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

	ngOnInit() {
		this._userService.getData().subscribe(
			(response:any) => {
				this.dataP = response.productor;
				this.dataA = response.acopio;
				this.dataC = response.carrier;
				this.dataM = response.merchant;
				//onsole.log(this.dataP, this.dataA, this.dataC, this.dataM);
			});
		/*this._userService.requestDataFromMultipleSources().subscribe(responseList => {
			this.data = responseList;
			console.log(this.data);
		});*/
		if(this.users.typeOfUser == 'Merchant'){
			this.isMerchant = true;
			this.isCarrier = false;
			this.isAcopio = false;
			this.isProductor = false;
		}else if(this.users.typeOfUser == 'Carrier'){
			this.isMerchant = false;
			this.isCarrier = true;
			this.isAcopio = false;
			this.isProductor = false;
		}else if(this.users.typeOfUser == 'Acopio'){
			this.isMerchant = false;
			this.isCarrier = false;
			this.isAcopio = true;
			this.isProductor = false;
		}else if(this.users.typeOfUser == 'Productor'){
			this.isMerchant = false;
			this.isCarrier = false;
			this.isAcopio = false;
			this.isProductor = true;
		}
	}

	onChange(){
		for(var productor of this.dataP){
			if(productor._id == this.tuser.fid){
				this.tuser.previousStage = 'Productor';
			}
		}
		for(var acopio of this.dataA){
			if(acopio._id == this.tuser.fid){
				this.tuser.previousStage = 'Acopio';
			}
		}
		for(var carrier of this.dataC){
			if(carrier._id == this.tuser.fid){
				this.tuser.previousStage = 'Carrier';
			}
		}
		for(var merchant of this.dataM){
			if(merchant._id == this.tuser.fid){
				this.tuser.previousStage = 'Merchant';
			}
		}
	}
}
