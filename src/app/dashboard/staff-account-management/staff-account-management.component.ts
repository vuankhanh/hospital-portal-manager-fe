import { Component, OnInit } from '@angular/core';

import { AccountInsmartService } from '../../service/api/get/account-insmart.service';
import { LocalStorageService } from '../../service/local-storage.service';

@Component({
  selector: 'app-staff-account-management',
  templateUrl: './staff-account-management.component.html',
  styleUrls: ['./staff-account-management.component.scss']
})
export class StaffAccountManagementComponent implements OnInit {

  constructor(
    private accountInsmartService: AccountInsmartService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
    let userData = this.localStorageService.getLocalStorage("token");
    if(userData){
      this.accountInsmartService.getInsmart(userData.token).subscribe(res=>{
        console.log(res);
      })
    }
  }

}
