import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatTable, PageEvent } from '@angular/material';

import { HospitalInformationComponent } from '../../sharing/modal/hospital-information/hospital-information.component';

import { HospitalsService, Hospitals } from '../../service/api/get/hospitals.service';
import { LocalStorageService } from '../../service/local-storage.service';
import { CreateHospitalService, Hospital } from '../../service/api/post/create-hospital.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-hospital-list-management',
  templateUrl: './hospital-list-management.component.html',
  styleUrls: ['./hospital-list-management.component.scss']
})
export class HospitalListManagementComponent implements OnInit {
  @ViewChild(MatTable, { static: false }) table: MatTable<any>;
  hospitals: Hospitals;
  displayedColumns: string[] = ['id', 'hospital_name', 'hospital_code', 'city'];
  
  pageSize:number = 10;
  pageIndex: number = 1;
  length:number;
  pageSizeOptions: number[] = [10, 25, 100];
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private hospitalsService: HospitalsService,
    private localStorageSerivce: LocalStorageService,
    private createHospitalService: CreateHospitalService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    let params = {
      pageSize: this.pageSize,
      pageIndex: this.pageIndex
    }
    this.setHospital(params);
  }

  onSearchChange(event){
    let hospitalCode = event.target.value;
    let params = {
      pageSize: this.pageSize,
      pageIndex: this.pageIndex,
      hospitalCode: hospitalCode
    }

    this.setHospital(params);
  }

  setHospital(params){
    let userInfo = this.localStorageSerivce.getLocalStorage('token');

    this.hospitalsService.getHospital(userInfo.token, params).subscribe(res=>{
      this.hospitals = res.data;
      this.length = res.length;
    },err=>alert(err));
  }

  pageChangeEvent(event: PageEvent){
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex+1;

    let params = {
      pageSize: this.pageSize,
      pageIndex: this.pageIndex
    }
    this.setHospital(params);
  }

  showDetail(hospital){
    this.router.navigate(['/dashboard/hospital-detail', hospital.ID]);
  }

  createHospital(){
    return this.dialog.open(HospitalInformationComponent,{
      data: {}
    }).afterClosed().subscribe(result=>{
      if(result){
        let userData = this.localStorageSerivce.getLocalStorage("token");
        this.createHospitalService.createHospital(userData.token, result.information).subscribe(res=>{
          if(res.code === 200){
            // alert(res.message);
            this.toastService.showShortToast(res.message, 'Thông báo');
            this.hospitals.push(res.data[0]);
            this.table.renderRows();
          }else if(res.code === 500){
            // alert(res.message);
            this.toastService.showShortToast(res.message, 'Thông báo');
          }
        },error=>{
          console.log(error);
        })
      }
    });
  }

}
