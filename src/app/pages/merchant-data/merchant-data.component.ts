import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Users } from '../../models/users';
import { Productors } from '../../models/productors';
import { AcopiosIn } from '../../models/acopiosIn';
import { Carriers } from '../../models/carriers';
import { MerchantsIn } from '../../models/merchantsIn';

import { TUsers } from '../../models/tusers';
import Swal from 'sweetalert2';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { Md5 } from 'ts-md5/dist/md5';

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
	public press: boolean;
	public fileImage: File;
	public fileVehicle: File;
	public fileProduct: File;

	public titleQR: any;
	public elementType: any;
	public value: any;
	public infoMessage: any;
	public QR: boolean;
	public data: boolean;
	public isMerchant: boolean;
	public isCarrier: boolean;
	public isAcopio: boolean;
	public isProductor: boolean;
	public isHidden: boolean;
	public identity;
	public nameOfCompany;
	public title;
	public users: Users;
	public productor: Productors;
	public acopioIn: AcopiosIn;
	public carrier: Carriers;
	public merchantIn: MerchantsIn;

	public tuser: TUsers;

	public dataP: any;
	public dataA: any;
	public dataAO: any;
	public dataC: any;
	public dataM: any;
	public dataMO: any;

	public marker: any;

	public token: any;

	constructor(
		private _userService:UserService,
		private _router: Router
	){
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.users = JSON.parse(this.identity);
		this.nameOfCompany = this._userService.getCompany();
		this.tuser = new TUsers('null', '', '', '', 'null', this.users.typeOfUser, this.nameOfCompany, null, '');
		this.productor = new Productors('', '', '');
		this.acopioIn = new AcopiosIn('', '', '', '', '');
		this.carrier = new Carriers('', 'null', 'null', '', null, null, '');
		this.merchantIn = new MerchantsIn('', '');
		this.QR = false;
		this.isMerchant = false;
		this.isCarrier = false;
		this.isAcopio = false;
		this.isProductor = false;
		this.isHidden = false;
		this.titleQR = 'app';
		this.elementType = 'url';
		this.token = this._userService.getToken();
	}

	public fileChangeImage(event) {
		let fileList: FileList = event.target.files;
		if(fileList.length > 0) {
        this.fileImage = fileList[0];
    }
	}

	public fileChangeProduct(event) {
		let fileList: FileList = event.target.files;
		if(fileList.length > 0) {
        this.fileProduct = fileList[0];
    }
	}

	public fileChangeVehicle(event) {
		let fileList: FileList = event.target.files;
		if(fileList.length > 0) {
        this.fileVehicle = fileList[0];
    }
	}

	public onSubmit(){
		if(this.nameOfCompany == null || this.nameOfCompany == '""'){
      swalWithBootstrapButtons.fire(
        '¡Alto!',
        'Necesitas proporcionar un nombre para tu empresa',
        'warning'
      )
			return;
    }

		var jsonData:any;
		jsonData = {
			fid: this.tuser.fid,
			ubication: this.tuser.ubication,
			name: this.tuser.name,
			previousStage: this.tuser.previousStage,
			currentStage: this.tuser.currentStage,
			nameOfCompany: this.nameOfCompany,
			description: null
		};

		var md5 = new Md5();
		var newCode:any;
		newCode = md5.appendStr(JSON.stringify(jsonData)).end();

		var formData = new FormData();
		formData.append('image', this.fileImage, this.fileImage.name);
		formData.append('fid', this.tuser.fid);
		formData.append('ubication', this.tuser.ubication);
		formData.append('name', this.tuser.name);
		formData.append('previousStage', this.tuser.previousStage);
		formData.append('currentStage', this.tuser.currentStage);
		formData.append('nameOfCompany', this.tuser.nameOfCompany);
		formData.append('description', this.tuser.description);
		formData.append('code', newCode);
		if(this.users.typeOfUser == 'Merchant'){
			formData.append('arrivalDate', this.merchantIn.arrivalDate);
			formData.append('quantity', this.merchantIn.quantity);
			this._userService.merchantDataIn(formData, this.token).subscribe(
				(response:any) => {
					swalWithBootstrapButtons.fire(
						'¡Datos comprobados!',
						'El dato ha sido comprobado correctamente',
						'success'
					)
					this.QR = true;
					this.value = '{ "Code": "'+response.info.code+'", "ID": "'+response.info.id+'" }';
					//console.log(response);
					this.tuser = new TUsers('null', '', '', '', 'null', this.users.typeOfUser, this.nameOfCompany, null, '');
					this.merchantIn = new MerchantsIn('', '');
					this.infoMessage = response.message;
					this.press = false;
					this.ngOnInit();
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
			formData.append('driverName', this.carrier.driverName);
			formData.append('origin', this.carrier.origin);
			formData.append('destination', this.carrier.destination);
			formData.append('plates', this.carrier.plates);
			formData.append('productPhotos', this.fileProduct, this.fileProduct.name);
			formData.append('vehiclePhotos', this.fileVehicle, this.fileVehicle.name);
			formData.append('tracking', this.carrier.tracking);
			this._userService.carrierData(formData, this.token).subscribe(
				(response:any) => {
					swalWithBootstrapButtons.fire(
						'¡Datos comprobados!',
						'El dato ha sido comprobado correctamente',
						'success'
					)
					this.QR = true;
					this.value = '{ "Code": "'+response.info.code+'", "ID": "'+response.info.id+'" }';
					//console.log(response);
					this.tuser = new TUsers('null', '', '', '', 'null', this.users.typeOfUser, this.nameOfCompany, null, '');
					this.carrier = new Carriers('', '', '', '', null, null, '');
					this.infoMessage = response.message;
					this.press = false;
					this.ngOnInit();
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
			formData.append('arrivalDate', this.acopioIn.arrivalDate);
			formData.append('clasification', this.acopioIn.clasification);
			formData.append('quantity', this.acopioIn.quantity);
			formData.append('measure', this.acopioIn.measure);
			formData.append('whoReceives', this.acopioIn.whoReceives);
			this._userService.acopioDataIn(formData, this.token).subscribe(
				(response:any) => {
					swalWithBootstrapButtons.fire(
						'¡Datos comprobados!',
						'El dato ha sido comprobado correctamente',
						'success'
					)
					this.QR = true;
					this.value = '{ "Code": "'+response.info.code+'", "ID": "'+response.info.id+'" }';
					//console.log(response);
					this.tuser = new TUsers('null', '', '', '', 'null', this.users.typeOfUser, this.nameOfCompany, null, '');
					this.acopioIn = new AcopiosIn('', '', '', '', '');
					this.infoMessage = response.message;
					this.press = false;
					this.ngOnInit();
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
			formData.append('harvestDate', this.productor.harvestDate);
			formData.append('caducationDate', this.productor.caducationDate);
			formData.append('documentation', this.productor.documentation);
			this._userService.productorData(formData, this.token).subscribe(
				(response:any) => {
					swalWithBootstrapButtons.fire(
						'¡Datos comprobados!',
						'El dato ha sido comprobado correctamente',
						'success'
					)
					this.QR = true;
					this.value = '{ "Code": "'+response.info.code+'", "ID": "'+response.info.id+'" }';
					//console.log(response);
					this.tuser = new TUsers('null', '', '', '', 'null', this.users.typeOfUser, this.nameOfCompany, null, '');
					this.productor = new Productors('', '', '');
					this.infoMessage = response.message;
					this.press = false;
					this.ngOnInit();
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
		if(this.nameOfCompany == null || this.nameOfCompany == '""'){
      swalWithBootstrapButtons.fire(
        '¡Alto!',
        'Necesitas proporcionar un nombre para tu empresa',
        'warning'
      )
			return;
    }else{
			this.nameOfCompany = this._userService.getCompany().replace(/['"]+/g, '');
		}
		this._userService.getData(this.token).subscribe(
			(response:any) => {
				this.dataP = response.productor;
				this.dataA = response.acopio;
				this.dataAO = response.acopioOut;
				this.dataC = response.carrier;
				this.dataM = response.merchant;
				this.dataMO = response.merchantOut;
				//console.log(this.dataP, this.dataA, this.dataAO, this.dataC, this.dataM, this.dataMO);
			}
		);
		if(this.users.typeOfUser == 'Merchant'){
			this.isMerchant = true;
			this.isCarrier = false;
			this.isAcopio = false;
			this.isProductor = false;
		}else if(this.users.typeOfUser == 'Carrier'){
			this.data = false;
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
		this.getMap();
	}

	onChange(){
		if(this.tuser.fid == 'null'){
			this.tuser.previousStage = 'null';
		}
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
		for(var acopioOut of this.dataAO){
			if(acopioOut._id == this.tuser.fid){
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
		for(var merchantOut of this.dataMO){
			if(merchantOut._id == this.tuser.fid){
				this.tuser.previousStage = 'Merchant';
			}
		}
	}

	getMap(){
		var coords = { lat: 24, lng: -102 };
		var mapProp = {
			center: coords,//new google.maps.LatLng(24.37022490685303, -102.1595182942408),
			zoom:5,
		};
		var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

		map.addListener("click", (mapsMouseEvent) => {
			if(this.press == true /*&& this.users.typeOfUser != 'Carrier'*/){
				swalWithBootstrapButtons.fire(
					'¡Atención!',
					'No puedes marcar más puntos. Elimina la marca anterior para utilizar una nueva.',
					'warning'
				)
				return;
			}


			if(this.tuser.previousStage == 'Carrier' && this.tuser.currentStage == 'Carrier'){
				var latLngJSON = JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2);
				coords = JSON.parse(latLngJSON); //ESTE DATO ES EL QUE SE DEBERÍA ENVIAR
				this.marker = new google.maps.Marker({
					position: mapsMouseEvent.latLng,
					map: map,
					animation: google.maps.Animation.DROP,
					title: 'My place'
				});
				this.carrier.destination = ''+coords.lat+', '+coords.lng+'';
				this.press = true;

				return;
			}else if(this.tuser.previousStage == 'Carrier' || this.data == false){
				swalWithBootstrapButtons.fire(
					'¡Atención!',
					'Mapa deshabilitado',
					'warning'
				)
				return;
			}
			/*else if (this.users.typeOfUser == 'Carrier') {
				var latLngJSON = JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2);
				coords = JSON.parse(latLngJSON); //ESTE DATO ES EL QUE SE DEBERÍA ENVIAR
				this.marker = new google.maps.Marker({
					position: mapsMouseEvent.latLng,
					map: map,
					animation: google.maps.Animation.DROP,
					title: 'My place'
				});
				this.tuser.ubication = ''+coords.lat+', '+coords.lng+'';
				this.press = true;
				//this.calcRoute(coords, coords);
			}*/else{
				var latLngJSON = JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2);
				coords = JSON.parse(latLngJSON); //ESTE DATO ES EL QUE SE DEBERÍA ENVIAR
				this.marker = new google.maps.Marker({
					position: mapsMouseEvent.latLng,
					map: map,
					animation: google.maps.Animation.DROP,
					title: 'My place'
				});
				if(this.users.typeOfUser == 'Carrier'){
					this.carrier.destination = ''+coords.lat+', '+coords.lng+'';
					this.press = true;
				}else{
					this.tuser.ubication = ''+coords.lat+', '+coords.lng+'';
					this.press = true;
				}
			}
		});
	}

	calcRoute(start, end) {
		var directionsService = new google.maps.DirectionsService();
  	var directionsRenderer = new google.maps.DirectionsRenderer();

		var request = {
			origin: 'Chicago, IL',
      destination: 'Los Angeles, CA',
      travelMode: google.maps.TravelMode.DRIVING
		};

		directionsService.route(request, function(response, status) {
			if (status == 'OK') {
				directionsRenderer.setDirections(response);
			}
		});
	}

	deleteMarkers() {
		this.marker.setMap(null);
		this.press = false;
		if(this.users.typeOfUser == 'Carrier'){
			this.carrier.destination = 'null';
		}else{
			this.tuser.ubication = 'null';
		}
	}

	searchData(){
		if(this.nameOfCompany == null || this.nameOfCompany == '""'){
      swalWithBootstrapButtons.fire(
        '¡Alto!',
        'Necesitas proporcionar un nombre para tu empresa',
        'warning'
      )
			return;
    }
		var code = (<HTMLInputElement>document.getElementById('search')).value;
		var id = null;
		if(code == 'null'){
			id = 'null';
		}
		for(var productor of this.dataP){
			if(productor.code == code){
				id = productor._id;
			}
		}
		for(var acopio of this.dataA){
			if(acopio.code == code){
				id = acopio._id;
			}
		}
		for(var acopioOut of this.dataAO){
			if(acopioOut.code == code){
				id = acopioOut._id;
			}
		}
		for(var carrier of this.dataC){
			if(carrier.code == code){
				id = carrier._id;
			}
		}
		for(var merchant of this.dataM){
			if(merchant.code == code){
				id = merchant._id;
			}
		}
		for(var merchantOut of this.dataMO){
			if(merchantOut.code == code){
				id = merchantOut._id;
			}
		}
		//console.log(this.dataA);
		//console.log(this.dataAO);
		//console.log(this.dataC);
		//console.log(this.dataP);
		//console.log(this.dataMO);

		var jsonData:any;
		jsonData = {
			Code: code,
			ID: id
		};
		this._userService.searchData(jsonData, this.token).subscribe(
			(response:any) => {
				this.infoMessage = response.message;
				if (response.message == "El dato no existe" ) {
					swalWithBootstrapButtons.fire(
						'¡!',
						this.infoMessage,
						'error'
					)
				}else{
					var filled = response.message[0];
					if (this.users.typeOfUser == 'Carrier') {
						(<HTMLInputElement>document.getElementById('name')).disabled = false;
						(<HTMLInputElement>document.getElementById('image')).disabled = false;
						(<HTMLInputElement>document.getElementById('description')).disabled = false;
						(<HTMLInputElement>document.getElementById('driverName')).disabled = false;
						(<HTMLInputElement>document.getElementById('destination')).disabled = false;
						(<HTMLInputElement>document.getElementById('plates')).disabled = false;
						(<HTMLInputElement>document.getElementById('productPhotos')).disabled = false;
						(<HTMLInputElement>document.getElementById('vehiclePhotos')).disabled = false;
						(<HTMLInputElement>document.getElementById('tracking')).disabled = false;
						if (filled.currentStage == 'Carrier') {
							this.carrier.origin = filled.destination;

						}else{
							this.carrier.origin = filled.ubication;
						}
						this.tuser.fid = filled.id;
						this.tuser.previousStage = filled.currentStage;
					}else{
						this.tuser.fid = filled.id;
						this.tuser.previousStage = filled.currentStage;
						if (filled.currentStage == 'Carrier') {
							this.tuser.ubication = filled.destination;
						}
					}

					if(this.tuser.previousStage == 'Carrier' && this.press == true){
						this.marker.setMap(null);
						this.press = false;
					}
					swalWithBootstrapButtons.fire(
						'¡Ok!',
						'El dato ha sido encontrado',
						'success'
					)
					this.data = true;
					//console.log(response.message[0]);
					//this.acopio = new Acopios('', '', '');
				}
				//this.ngOnInit();
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

	deleteData(){
		this.deleteMarkers();
		if (this.users.typeOfUser == 'Carrier') {
			this.carrier.origin = 'null';
		}else if (this.users.typeOfUser != 'Carrier' && this.tuser.previousStage == 'Carrier') {
			this.tuser.ubication = 'null';
		}
		this.data = false;
		this.tuser.fid = 'null';
		this.tuser.previousStage = 'null';

		// = new TUsers('', '', '', '', '', this.users.typeOfUser, this.nameOfCompany, null, '');

		(<HTMLInputElement>document.getElementById('search')).value = '';
		swalWithBootstrapButtons.fire(
			'¡Hecho!',
			'Datos eliminados',
			'info'
		)
	}
}
