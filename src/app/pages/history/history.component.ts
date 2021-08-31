import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Users } from '../../models/users';
import { TUsers } from '../../models/tusers';
import { AcopiosOut } from '../../models/acopiosOut';

import { Md5 } from 'ts-md5/dist/md5';

import Swal from 'sweetalert2';

const swalWithBootstrapButtons = Swal.mixin({
	customClass: {
		confirmButton: 'btn btn-success',
		cancelButton: 'btn btn-danger'
	},
	buttonsStyling: false
})

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  providers: [UserService],
  styleUrls: ['../../../assets/css/app.component.css']
})

export class HistoryComponent implements OnInit {
	public fileImage: File;

  public nameOfCompany;
  public token;
  public infoMessage: any;
  public identity;
  public users: Users;
  public historyIn = [];
	public historyOut = [];

	public isMerchant: boolean;
	public isCarrier: boolean;
	public isAcopio: boolean;
	public isProductor: boolean;
	public marker: any;
	public press: boolean;

	public available: boolean;

	public acopioOut: AcopiosOut;

	public QR: boolean;
	public value: any;

	public showTable: boolean;
	public fid: any;



	constructor(
    private _userService:UserService,
		private _router: Router
  ) {
    this.identity = this._userService.getIdentity();
    this.users = JSON.parse(this.identity);
    this.nameOfCompany = this._userService.getCompany().replace(/['"]+/g, '');
    this.token = this._userService.getToken();
		this.isMerchant = false;
		this.isCarrier = false;
		this.isAcopio = false;
		this.isProductor = false;
		this.acopioOut = new AcopiosOut('', '', '', '', '');
		this.QR = false;
		this.showTable = false;
  }

  ngOnInit(): void {
		this.historyOut = [];
		this.showTable = false;
		this.fid = '';

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
    if(this.nameOfCompany == null || this.nameOfCompany == '""'){
      swalWithBootstrapButtons.fire(
        '¡Alto!',
        'Necesitas proporcionar un nombre para tu empresa',
        'warning'
      )
			return;
    }
    this._userService.getHistory(this.token, this.nameOfCompany, this.users.typeOfUser).subscribe(
			(response:any) => {
				//this.infoMessage = response.history;
        this.historyIn = response.history;
				for(var history of this.historyIn){
					this.value = '{ "Code": "'+history.code+'", "ID": "'+history._id+'" }';
				}
        //console.log(response.history);
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
  }

	showMap(ubication){
		var coords = ubication.split(",");
		if (coords.length < 2) {
			swalWithBootstrapButtons.fire(
				'¡Error!',
				'No se establecieron las coordenadas',
				'error'
			)
			return;
		}
		Swal.fire({
		  title: '<strong>Ubicación</strong>',
		  icon: 'info',
		  html:
		    '<div id="googleMap" style="width:100%;height:400px;" disabled></div>',
		  showCloseButton: true,
		  showCancelButton: false,
		  focusConfirm: false,
		  confirmButtonText:
		    '<i class="fa fa-thumbs-up"></i> OK',
		  confirmButtonAriaLabel: 'Thumbs up, great!'
		})

		var mapProp = {
			center: new google.maps.LatLng(coords[0], coords[1]), //coords,//
			zoom:5,
		};

		var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

		var marker = new google.maps.Marker({
		    position: new google.maps.LatLng(coords[0], coords[1]),
		    title:"Ubicación"
		});

		// To add the marker to the map, call setMap();
		marker.setMap(map);
	}

	outputA(data){
		Swal.fire({
		  title: '<strong>Salida</strong>',
		  icon: 'info',
		  html:
			'<div class="row">'+
				'<div class="col">'+
					'<label for="fid">Nombre del eslabón anterior:</label>'+
					'<input id="fid" class="form-control" value='+data._id+' disabled>'+
				'</div>'+
				'<div class="col">'+
					'<label for="previousStage">Eslabón anterior:</label>'+
					'<input id="previousStage" class="form-control" value='+data.currentStage+' disabled>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col">'+
					'<label for="name">Nombre del eslabón actual:</label>'+
					'<input id="name" class="form-control">'+
				'</div>'+
				'<div class="col">'+
					'<label for="currentStage">Eslabón actual:</label>'+
					'<input id="currentStage" class="form-control" value='+this.users.typeOfUser+' disabled>'+
				'</div>'+
			'</div>'+
		 '<div class="row">'+
				'<div class="col">'+
					'<label for="quantity">Cantidad:</label>'+
					'<input type="number" id="quantity" class="form-control">'+
				'</div>'+
				'<div class="col">'+
					'<label for="measure">Unidad de medida:</label>'+
					'<input id="measure" class="form-control" value='+data.measure+' disabled>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col">'+
					'<label for="clasification">Clasificación:</label>'+
					'<input id="clasification" class="form-control" value='+data.clasification+' disabled>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col">'+
					'<label for="departureDate">Fecha de salida del producto:</label>'+
					'<input id="departureDate"class="form-control">'+
				'</div>'+
				'<div class="col">'+
					'<label for="whoDelivers">Nombre de quién liberó:</label>'+
					'<input id="whoDelivers" class="form-control">'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col">'+
					'<label for="code">Code:</label>'+
					'<input id="code" class="form-control" disabled>'+
				'</div>'+
				'<div class="col">'+
					'<label for="image">Imagen:</label>'+
					'<input id="image" class="form-control" type="file">'+
				'</div>'+
				'<div class="col">'+
					'<label for="ubication">Ubicación:</label>'+
					'<input id="ubication" class="form-control" value='+data.ubication+' disabled>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col">'+
					'<label for="description">Description:</label>'+
					'<input id="description" class="form-control">'+
				'</div>'+
			'</div>',
		  showCloseButton: true,
		  showCancelButton: false,
		  focusConfirm: false,
		  confirmButtonText:
		    'Añadir salida',
		  confirmButtonAriaLabel: 'Thumbs up, great!'
		})
		.then((result) => {
			if (result.isConfirmed) {
				var jsonData:any;
				jsonData = {
					//_id: data._id,
					fid: data._id,
					code: '',
					ubication: data.ubication,
					name: (<HTMLInputElement>document.getElementById('name')).value,
					previousStage: data.currentStage,
					currentStage: this.users.typeOfUser,
					nameOfCompany: data.nameOfCompany,
					image: '',
					description: (<HTMLInputElement>document.getElementById('description')).value,
					departureDate: (<HTMLInputElement>document.getElementById('departureDate')).value,
					clasification: data.clasification,
					quantity: (<HTMLInputElement>document.getElementById('quantity')).value,
					measure: data.measure,
					whoDelivers: (<HTMLInputElement>document.getElementById('whoDelivers')).value,
				};
				var md5 = new Md5();
				var newCode:any;
				newCode = md5.appendStr(JSON.stringify(jsonData)).end();

				let fileList: FileList = (<HTMLInputElement>document.getElementById('image')).files;
				if(fileList.length > 0) {
		        this.fileImage = fileList[0];
		    }

				var formData = new FormData();
				formData.append('image', this.fileImage, this.fileImage.name);
				formData.append('fid', jsonData.fid);
				formData.append('ubication', jsonData.ubication);
				formData.append('name', jsonData.name);
				formData.append('previousStage', jsonData.previousStage);
				formData.append('currentStage', jsonData.currentStage);
				formData.append('nameOfCompany', jsonData.nameOfCompany);
				formData.append('description', jsonData.description);
				formData.append('code', newCode);
				formData.append('departureDate', jsonData.departureDate);
				formData.append('clasification', jsonData.clasification);
				formData.append('quantity', jsonData.quantity);
				formData.append('measure', jsonData.measure);
				formData.append('whoDelivers', jsonData.whoDelivers);
				//this._userService.acopiosDataUpdate(jsonData).subscribe(
				this._userService.acopioDataOut(formData).subscribe(
					(response:any) => {
						this.infoMessage = response;
						swalWithBootstrapButtons.fire(
							'¡Datos comprobados!',
							'El dato ha sido comprobado correctamente',
							'success'
						)
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
		  } /*else if (result.isDenied) {
		    console.log("a");

		  }*/
		})
	}

	outputM(data){
		Swal.fire({
		  title: '<strong>Salida</strong>',
		  icon: 'info',
		  html:
			'<div class="row">'+
				'<div class="col">'+
					'<label for="fid">Nombre del eslabón anterior:</label>'+
					'<input id="fid" class="form-control" value='+data._id+' disabled>'+
				'</div>'+
				'<div class="col">'+
					'<label for="previousStage">Eslabón anterior:</label>'+
					'<input id="previousStage" class="form-control" value='+data.currentStage+' disabled>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col">'+
					'<label for="name">Nombre del eslabón actual:</label>'+
					'<input id="name" class="form-control">'+
				'</div>'+
				'<div class="col">'+
					'<label for="currentStage">Eslabón actual:</label>'+
					'<input id="currentStage" class="form-control" value='+this.users.typeOfUser+' disabled>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col">'+
					'<label for="departureDate">Fecha de salida:</label>'+
					'<input id="departureDate"class="form-control">'+
				'</div>'+
				'<div class="col">'+
					'<label for="quantity">Cantidad:</label>'+
					'<input type="number" id="quantity"class="form-control">'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col">'+
					'<label for="code">Code:</label>'+
					'<input id="code" class="form-control" disabled>'+
				'</div>'+
				'<div class="col">'+
					'<label for="image">Imagen:</label>'+
					'<input id="image" class="form-control" type="file">'+
				'</div>'+
				'<div class="col">'+
					'<label for="ubication">Ubicación:</label>'+
					'<input id="ubication" class="form-control" value='+data.ubication+' disabled>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col">'+
					'<label for="description">Description:</label>'+
					'<input id="description" class="form-control">'+
				'</div>'+
			'</div>'+
			'<script type="text/javascript" src="javascript.js">'+
				'function fileChangeImage(event) {'+
				  'console.log(event);'+
				'}'+
			'</script>',
		  showCloseButton: true,
		  showCancelButton: false,
		  focusConfirm: false,
		  confirmButtonText:
		    'Añadir salida',
		  confirmButtonAriaLabel: 'Thumbs up, great!'
		})
		.then((result) => {
			if (result.isConfirmed) {
				var jsonData:any;
				jsonData = {
					//_id: data._id,
					fid: data._id,
					code: '',
					ubication: data.ubication,
					name: (<HTMLInputElement>document.getElementById('name')).value,
					previousStage: data.currentStage,
					currentStage: this.users.typeOfUser,
					nameOfCompany: data.nameOfCompany,
					image: '',
					description: (<HTMLInputElement>document.getElementById('description')).value,
					quantity: (<HTMLInputElement>document.getElementById('quantity')).value,
					departureDate: (<HTMLInputElement>document.getElementById('departureDate')).value
				};
				var md5 = new Md5();
				var newCode:any;
				newCode = md5.appendStr(JSON.stringify(jsonData)).end();

				let fileList: FileList = (<HTMLInputElement>document.getElementById('image')).files;
				if(fileList.length > 0) {
		        this.fileImage = fileList[0];
		    }

				var formData = new FormData();
				formData.append('image', this.fileImage, this.fileImage.name);
				formData.append('fid', jsonData.fid);
				formData.append('ubication', jsonData.ubication);
				formData.append('name', jsonData.name);
				formData.append('previousStage', jsonData.previousStage);
				formData.append('currentStage', jsonData.currentStage);
				formData.append('nameOfCompany', jsonData.nameOfCompany);
				formData.append('description', jsonData.description);
				formData.append('code', newCode);
				formData.append('quantity', jsonData.quantity);
				formData.append('departureDate', jsonData.departureDate);
				this._userService.merchantDataOut(formData).subscribe(
					(response:any) => {
						this.infoMessage = response;
						swalWithBootstrapButtons.fire(
							'¡Datos comprobados!',
							'El dato ha sido comprobado correctamente',
							'success'
						)
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
		  } /*else if (result.isDenied) {
		    console.log("a");

		  }*/
		})
	}

	showInformation(dataIn, row){
		if (this.showTable == false && this.fid != dataIn._id) {
			this.showTable = true;
			this.fid = dataIn._id;
			this._userService.getHistoryOut(dataIn._id, this.users.typeOfUser).subscribe(
				(response:any) => {
					this.historyOut = response.history;
					for(var history of this.historyOut){
						this.value = '{ "Code": "'+history.code+'", "ID": "'+history._id+'" }';
					}
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
		}
		else if (this.showTable == true && this.fid != dataIn._id) {
			//console.log(2);
			this.fid = dataIn._id;
			this._userService.getHistoryOut(dataIn._id, this.users.typeOfUser).subscribe(
				(response:any) => {
					//this.infoMessage = response.history;
	        this.historyOut = response.history;
					for(var history of this.historyOut){
						this.value = '{ "Code": "'+history.code+'", "ID": "'+history._id+'" }';
					}
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
		}
		else if (this.showTable == true && this.fid == dataIn._id) {
			//console.log(3);
			this.historyOut = [];
			this.showTable = false;
			this.fid = '';
		}
	}
}
