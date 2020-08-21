import { Component, OnInit } from '@angular/core';

import { InsurersService, Insurers } from '../../service/api/get/insurers.service';
import { LocalStorageService } from '../../service/local-storage.service';
import { TraTuService } from '../../service/tra-tu.service';

@Component({
  selector: 'app-insurance-list-management',
  templateUrl: './insurance-list-management.component.html',
  styleUrls: ['./insurance-list-management.component.scss']
})
export class InsuranceListManagementComponent implements OnInit {
  insurers: Insurers = [];
  displayedColumns: string[] = ['id', 'short_name', 'name', 'logo', 'check_benefit_countdown', 'gl_countdown', 'type' ];
  constructor(
    private insurersService: InsurersService,
    private localStorageService: LocalStorageService,
    public traTuService: TraTuService
  ) { }

  ngOnInit() {
    let userData = this.localStorageService.getLocalStorage("token");
    this.insurersService.getHospital(userData.token).subscribe(res=>{
      console.log(res);
      if(res.code === 200){
        this.insurers = res.data;
        console.log(this.insurers);
      }
    });
  }

}