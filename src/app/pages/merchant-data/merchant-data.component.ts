import { Component, OnInit } from '@angular/core';
import { Merchants } from '../../models/merchant';
import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Users } from '../../models/users';
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
	public identity;
	public token;
	public title;
	public users: Users;
	public merchant: Merchants;
	public markers = [];

	constructor(
		private _userService:UserService,
		private _router: Router
	){
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.users = JSON.parse(this.identity);
		this.merchant = new Merchants('', '', '', '', '', '', '', '', '', '', '', '', this.users.typeOfUser, '');
		this.isMerchant = false;
		this.isCarrier = false;
		this.isAcopio = false;
		this.isProductor = false;
	}

	public onSubmit(){
		//console.log(this.merchant);
		if(this.users.typeOfUser == 'Merchant'){
			this._userService.merchantData(this.merchant).subscribe(
				response => {
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
			this._userService.carrierData(this.merchant).subscribe(
				response => {
					if(!this.filesToUpload){
					}else{
						this.makeFileRequest(url, params, file);
					}
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
			this._userService.acopioData(this.merchant).subscribe(
				response => {
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
			this._userService.productorData(this.merchant).subscribe(
				response => {
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

	getMap() {
		var coords;
		var marker;
		var latitude;
		var longitude;
		let map = document.getElementById('map-canvas');
    	let lat = map.getAttribute('data-lat');
    	let lng = map.getAttribute('data-lng');
    	var myLatlng = new google.maps.LatLng(lat, lng);

    	var mapOptions = {
	        zoom: 12,
	        scrollwheel: false,
	        center: myLatlng,
	        mapTypeId: google.maps.MapTypeId.ROADMAP,
	        styles: [
	          {"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},
	          {"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},
	          {"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},
	          {"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},
	          {"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},
	          {"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},
	          {"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},
	          {"featureType":"water","elementType":"all","stylers":[{"color":'#5e72e4'},{"visibility":"on"}]}]
	    }

	    map = new google.maps.Map(map, mapOptions);

	    // Create the initial InfoWindow.
	    let infoWindow = new google.maps.InfoWindow({
	    	content: "Click the map to get Lat/Lng!",
		    position: myLatlng,
		});

		// Configure the click listener.
		map.addListener("click", (mapsMouseEvent) => {
			// Close the current InfoWindow.
			infoWindow.close();
			// Create a new InfoWindow.
			infoWindow = new google.maps.InfoWindow({
				position: mapsMouseEvent.latLng,
			});

			var latLngJSON = JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2);

			infoWindow.setContent(
				latLngJSON
			);
			coords = JSON.parse(latLngJSON); //ESTE DATO ES EL QUE SE DEBERÍA ENVIAR
			if(this.merchant.pointA == ''){
				this.merchant.pointA = ''+coords.lat+', '+coords.lng+'';
				marker = new google.maps.Marker({
					position: mapsMouseEvent.latLng,
				 	map: map,
				 	animation: google.maps.Animation.DROP,
				 	title: 'Punto A'
				});
				this.markers.push(marker);
			}else if(this.merchant.pointA != '' && this.merchant.pointB == ''){
				this.merchant.pointB = ''+coords.lat+', '+coords.lng+'';
				marker = new google.maps.Marker({
					position: mapsMouseEvent.latLng,
					map: map,
					animation: google.maps.Animation.DROP,
					title: 'Punto B'
				});
				this.markers.push(marker);
			}else{
				swalWithBootstrapButtons.fire(
					'¡Error!',
					'El límite de puntos es 2',
					'error'
				)
			}
			infoWindow.open(map);
		});
	}

	trazar(){
		let map = document.getElementById('map-canvas');
    	const directionsService = new google.maps.DirectionsService();
		const directionsRenderer = new google.maps.DirectionsRenderer();
		directionsRenderer.setMap(map);
		this.calculateAndDisplayRoute(directionsService, directionsRenderer);
	}

	calculateAndDisplayRoute(
		directionsService: google.maps.DirectionsService,
		directionsRenderer: google.maps.DirectionsRenderer
		) {

		directionsService.route(
		{
			origin: this.merchant.pointA,
			destination: this.merchant.pointB,
			waypoints: [{location: this.merchant.pointA, stopover: false},
                        {location: this.merchant.pointB, stopover: false}],
			optimizeWaypoints: true,
			travelMode: google.maps.TravelMode.DRIVING,
		},
		(response, status) => {
			if (status === "OK" && response) {
				directionsRenderer.setDirections(response);
				const route = response.routes[0];
				const summaryPanel = document.getElementById(
					"directions-panel"
					) as HTMLElement;
				summaryPanel.innerHTML = "";

				for (let i = 0; i < route.legs.length; i++) {
					const routeSegment = i + 1;
					summaryPanel.innerHTML +=
					"<b>Route Segment: " + routeSegment + "</b><br>";
					summaryPanel.innerHTML += route.legs[i].start_address + " to ";
					 summaryPanel.innerHTML += route.legs[i].end_address + "<br>";
					 summaryPanel.innerHTML += route.legs[i].distance!.text + "<br><br>";
					}
				} else {
					window.alert("Directions request failed due to " + status);
				}
			}
			);
	}

	deleteMarkers() {
		this.merchant.pointA = '';
		this.merchant.pointB = '';
		this.clearMarkers();
		this.markers = [];
	}

	clearMarkers() {
		this.setMapOnAll(null);
	}

	setMapOnAll(map) {
		for (let i = 0; i < this.markers.length; i++) {
			this.markers[i].setMap(map);
		}
	}

	public filesToUpload: Array<File>;
	fileChangeEvent(fileInput: any){
		this.filesToUpload = <Array<File>>fileInput.target.files;
	}

	makeFileRequest(url: string, params: Array<string>, files: Array<File>){
		var token = this.token;
		return new Promise(function(resolve, reject){
			var formData:any = new FormData();
			var xhr = new XMLHttpRequest();

			for(var i = 0; i < files.length; i++){
				formData().append('image', files[i].name);
			}
			xhr.onreadystatechange = function(){
				if(xhr.readyState == 4){
					if(xhr.status == 200){
						resolve(JSON.parse(xhr.response));
					}else{
						reject(xhr.response);
					}
				}
			}
			xhr.open('POST', url, true);
			xhr.setRequestHeader('Authorization', token);
			xhr.send(formData);
		});
	}
}
