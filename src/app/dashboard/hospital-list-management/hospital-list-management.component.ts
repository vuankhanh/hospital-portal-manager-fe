import { Component, OnInit } from '@angular/core';

import { HospitalsService, Hospitals } from '../../service/api/get/hospitals.service';
import { LocalStorageService } from '../../service/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hospital-list-management',
  templateUrl: './hospital-list-management.component.html',
  styleUrls: ['./hospital-list-management.component.scss']
})
export class HospitalListManagementComponent implements OnInit {
  hospitals: Hospitals;
  displayedColumns: string[] = ['id', 'hospital_name', 'hospital_code', 'idCity', 'action'];
  constructor(
    private router: Router,
    private hospitalsService: HospitalsService,
    private localStorageSerivce: LocalStorageService
  ) { }

  ngOnInit() {
    let userInfo = this.localStorageSerivce.getLocalStorage('token');
    this.hospitalsService.getHospital(userInfo.token).subscribe(res=>{
      this.hospitals = res.data;
      console.log(this.hospitals);
    },err=>console.log(err))
  }

  showDetail(hospital){
    this.router.navigate(['/dashboard/hospital-detail', hospital.ID]);
  }

}
