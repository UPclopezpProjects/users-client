import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

import Swal from 'sweetalert2';
const swalWithBootstrapButtons = Swal.mixin({
	customClass: {
		confirmButton: 'btn btn-success',
		cancelButton: 'btn btn-danger'
	},
	buttonsStyling: false
})



@Component({
  selector: 'app-merchant-detail',
  templateUrl: './merchant-detail.component.html',
  providers: [UserService],
  //styleUrls: ['./merchant-detail.component.css']
  styleUrls: ['../../../assets/css/app.component.css']
})
export class MerchantDetailComponent implements OnInit {
  public nameOfCompany;

  constructor(
    private _userService: UserService,
  ){
    this.nameOfCompany = this._userService.getCompany();
  }

  ngOnInit(): void {
    if(this.nameOfCompany == null || this.nameOfCompany == '""'){
      swalWithBootstrapButtons.fire(
        '¡Alto!',
        'Necesitas proporcionar un nombre para tu empresa',
        'warning'
      )
			return;
    }
  }

}
