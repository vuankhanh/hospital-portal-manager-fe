import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { CreateAccountHospitalComponent } from '../../sharing/modal/create-account-hospital/create-account-hospital.component';

import { HospitalDetailService, Hospitals } from '../../service/api/get/hospital-detail.service';
import { AccountHospitalService, HospitalAccounts } from '../../service/api/get/account-hospital.service';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '../../service/local-storage.service';
import { CreateAccountService } from '../../service/api/post/create-account.service';

import { Subscription } from 'rxjs';
@Component({
  selector: 'app-hospital-detail',
  templateUrl: './hospital-detail.component.html',
  styleUrls: ['./hospital-detail.component.scss']
})
export class HospitalDetailComponent implements OnInit {
  private id: number;
  private subsciption: Subscription = new Subscription();
  private hospitalDetail: Hospitals;
  private hospitalAccounts: HospitalAccounts;
  constructor(
    private activedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private hospitalDetailService: HospitalDetailService,
    private accountHospitalService: AccountHospitalService,
    private createAccountService: CreateAccountService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
    this.subsciption.add(
      this.activedRoute.params.subscribe(params=>{
        this.id = params['id'];
      })
    );
    let userData = this.localStorageService.getLocalStorage('token');

    this.initData(userData.token, this.id);
    
  }

  initData(token, id){
    this.hospitalDetailService.getHospital(token, id).subscribe(res=>{
      this.hospitalDetail = res.data;
      console.log(this.hospitalDetail);
    });

    this.accountHospitalService.getHospital(token, id).subscribe(res=>{
      this.hospitalAccounts = res.data;
      console.log(this.hospitalAccounts);
    })
  }

  updateInformation(id){

  }

  createAccount(id){
    const dialog = this.dialog.open(CreateAccountHospitalComponent,{
      maxWidth: '80vw',
      maxHeight: '80vh',
      width: '80vw',
      height: '80vh',
      data: id
    });

    dialog.afterClosed().subscribe(result=>{
      if(result){
        let userData = this.localStorageService.getLocalStorage("token");

        this.createAccountService.createAccount(userData.token, result, 'hospital').subscribe(res=>{
          console.log(res);
        });
      }
    })
  }

  showAccouts(id){

  }

}
