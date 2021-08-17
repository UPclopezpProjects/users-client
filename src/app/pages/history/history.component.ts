import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Users } from '../../models/users';
import { TUsers } from '../../models/tusers';

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
  public nameOfCompany;
  public token;
  public infoMessage: any;
  public identity;
  public users: Users;
  public history = [];
	public isMerchant: boolean;
	public isCarrier: boolean;
	public isAcopio: boolean;
	public isProductor: boolean;
	public marker: any;
	public press: boolean;

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
  }

  ngOnInit(): void {
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
          this.history = response.history;
          console.log(response.history);
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

		var coords = ubication.split(",");

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

}
