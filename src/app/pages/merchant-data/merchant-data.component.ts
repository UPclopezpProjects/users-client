import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Users } from '../../models/users';
import { Productors } from '../../models/productors';
import { Acopios } from '../../models/acopios';
import { Carriers } from '../../models/carriers';
import { Merchants } from '../../models/merchants';
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

	public marker: any;

	constructor(
		private _userService:UserService,
		private _router: Router
	){
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.nameOfCompany = this._userService.getCompany().replace(/['"]+/g, '');
		this.users = JSON.parse(this.identity);
		this.tuser = new TUsers('null', '', '', '', 'null', this.users.typeOfUser, this.nameOfCompany, null, '');
		this.productor = new Productors('', '', '');
		this.acopio = new Acopios();
		this.carrier = new Carriers('', '', '', '', null, null, '');
		this.merchant = new Merchants();
		this.QR = false;
		this.data = false;
		this.isMerchant = false;
		this.isCarrier = false;
		this.isAcopio = false;
		this.isProductor = false;
		this.isHidden = false;
		this.titleQR = 'app';
		this.elementType = 'url';
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
			this._userService.merchantData(formData).subscribe(
				(response:any) => {
					swalWithBootstrapButtons.fire(
						'¡Datos comprobados!',
						'El dato ha sido comprobado correctamente',
						'success'
					)
					this.QR = true;
					this.value = '{ "Code": "'+response.info.code+'", \n'
					+'"ID": "'+response.info.id+'" }';
					//console.log(response);
					this.tuser = new TUsers('null', '', '', '', 'null', this.users.typeOfUser, this.nameOfCompany, null, '');
					//this.merchant = new Merchants('', '', '');
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

			this._userService.carrierData(formData).subscribe(
				(response:any) => {
					swalWithBootstrapButtons.fire(
						'¡Datos comprobados!',
						'El dato ha sido comprobado correctamente',
						'success'
					)
					this.QR = true;
					this.value = '{ "Code": "'+response.info.code+'", \n'
					+'"ID": "'+response.info.id+'" }';
					//console.log(response);
					//this.tuser = new TUsers('null', '', '', '', 'null', this.users.typeOfUser, this.nameOfCompany, null, '');
					//this.carrier = new Carriers('', '', '', '', null, null, '');
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
			//jsonData.code = this.merchant.code; Changes when acopio get data
			this._userService.acopioData(formData).subscribe(
				(response:any) => {
					swalWithBootstrapButtons.fire(
						'¡Datos comprobados!',
						'El dato ha sido comprobado correctamente',
						'success'
					)
					this.QR = true;
					this.value = '{ "Code": "'+response.info.code+'", \n'
					+'"ID": "'+response.info.id+'" }';
					//console.log(response);
					this.tuser = new TUsers('null', '', '', '', 'null', this.users.typeOfUser, this.nameOfCompany, null, '');
					//this.acopio = new Acopios('', '', '');
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
			this._userService.productorData(formData).subscribe(
				(response:any) => {
					swalWithBootstrapButtons.fire(
						'¡Datos comprobados!',
						'El dato ha sido comprobado correctamente',
						'success'
					)
					this.QR = true;
					this.value = '{ "Code": "'+response.info.code+'", \n'
					+'"ID": "'+response.info.id+'" }';
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
    }
		this._userService.getData().subscribe(
			(response:any) => {
				this.dataP = response.productor;
				this.dataA = response.acopio;
				this.dataC = response.carrier;
				this.dataM = response.merchant;
				//console.log(this.dataP, this.dataA, this.dataC, this.dataM);
			}
		);
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
			}/*else if (this.users.typeOfUser == 'Carrier') {
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
				this.tuser.ubication = ''+coords.lat+', '+coords.lng+'';
				this.press = true;
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
		this.tuser.ubication = null;
	}

	searchData(){
		var fid = (<HTMLInputElement>document.getElementById('search')).value;
		var code = null;
		if(fid == 'null'){
			code = 'null';
		}
		for(var productor of this.dataP){
			if(productor._id == fid){
				code = productor.code;
			}
		}
		for(var acopio of this.dataA){
			if(acopio._id == fid){
				code = acopio.code;
			}
		}
		for(var carrier of this.dataC){
			if(carrier._id == fid){
				code = carrier.code;
			}
		}
		for(var merchant of this.dataM){
			if(merchant._id == fid){
				code = merchant.code;
			}
		}
		var jsonData:any;
		jsonData = {
			Code: code,
			ID: fid
		};
		this._userService.searchData(jsonData).subscribe(
			(response:any) => {
				this.infoMessage = response.message;
				if (response.message == "El dato no existe" ) {
					swalWithBootstrapButtons.fire(
						'¡!',
						this.infoMessage,
						'error'
					)
				}else{
					swalWithBootstrapButtons.fire(
						'¡Ok!',
						'El dato ha sido encontrado',
						'success'
					)
					this.data = true;
					//console.log(response.message[0]);
					var filled = response.message[0];
					this.tuser = new TUsers(filled.id, '', '', '', filled.currentStage, this.users.typeOfUser, this.nameOfCompany, null, '');
					//this.acopio = new Acopios('', '', '');
				}
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

	deleteData(){
		(<HTMLInputElement>document.getElementById('search')).value = '';
		swalWithBootstrapButtons.fire(
			'¡Hecho!',
			'Datos eliminados',
			'info'
		)
		this.data = false;
		this.tuser = new TUsers('', '', '', '', '', this.users.typeOfUser, this.nameOfCompany, null, '');
	}
}
