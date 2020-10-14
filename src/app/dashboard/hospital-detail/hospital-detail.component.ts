import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTable } from '@angular/material';

import { CreateAccountHospitalComponent } from '../../sharing/modal/create-account-hospital/create-account-hospital.component';
import { ConfirmActionComponent } from '../../sharing/modal/confirm-action/confirm-action.component';
import { HospitalInformationComponent } from '../../sharing/modal/hospital-information/hospital-information.component';

import { HospitalDetailService, Hospitals } from '../../service/api/get/hospital-detail.service';
import { AccountHospitalService, HospitalAccounts } from '../../service/api/get/account-hospital.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '../../service/local-storage.service';
import { CreateHospitalAccountService } from '../../service/api/post/create-hospital-account.service';

import { Subscription } from 'rxjs';
import { RemoveHospitalAccountService } from '../../service/api/post/remove-hospital-account.service';
import { RemoveElementByAttributeService } from '../../service/remove-element-by-attribute.service';
import { RemoveHospitalService } from '../../service/api/post/remove-hospital.service';
import { HospitalService } from '../../service/api/post/hospital.service';
@Component({
  selector: 'app-hospital-detail',
  templateUrl: './hospital-detail.component.html',
  styleUrls: ['./hospital-detail.component.scss']
})
export class HospitalDetailComponent implements OnInit {
  @ViewChild(MatTable, { static: false }) table: MatTable<any>;
  private id: number;
  private subsciption: Subscription = new Subscription();
  hospitalDetail: Hospitals;
  hospitalAccounts: HospitalAccounts;

  displayedColumns: string[] = ['id', 'name'];
  constructor(
    private router: Router,
    private activedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private hospitalDetailService: HospitalDetailService,
    private accountHospitalService: AccountHospitalService,
    private createHospitalAccountService: CreateHospitalAccountService,
    private removeHospitalAccountService: RemoveHospitalAccountService,
    private removeHospitalService: RemoveHospitalService,
    private localStorageService: LocalStorageService,
    private removeElementByAttributeService: RemoveElementByAttributeService,
    private hositalService: HospitalService
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
    });

    this.accountHospitalService.getHospital(token, id).subscribe(res=>{
      this.hospitalAccounts = res.data;
    });
  }

  createAccount(id){
    const dialog = this.dialog.open(CreateAccountHospitalComponent,{
      data: id
    });

    dialog.afterClosed().subscribe(result=>{
      if(result){
        let userData = this.localStorageService.getLocalStorage("token");

        this.createHospitalAccountService.createAccount(userData.token, result).subscribe(res=>{
          alert(res.message);
          this.hospitalAccounts.push(res.data);
          this.table.renderRows();
        });
      }
    });
  }

  updateHospital(row){
    const dialog = this.dialog.open(HospitalInformationComponent,{
      data: row
    });

    dialog.afterClosed().subscribe(result=>{
      if(result && result.password){
        delete result.information.created_at;
        console.log(result);
        let userToken = this.localStorageService.getLocalStorage("token");
        this.hositalService.updateHospital(userToken.token, row.ID, result.password, result.information).subscribe(res=>{
          console.log(res);
        },error=>console.log(error));
      }
    });
  }

  updateAccount(row){
    console.log(row);
    // this.dialog.open(UpdateHospitalComponent,{
    //   data: row
    // }).afterClosed().subscribe(updated=>{
    //   let userToken = this.localStorageService.getLocalStorage("token");
    //   console.log(updated);
    // })
  }

  deleteAccount(row){
    
    this.dialog.open(ConfirmActionComponent).afterClosed().subscribe(password=>{
      let userToken = this.localStorageService.getLocalStorage("token");
      if(password){
        this.removeHospitalAccountService.removeHospitalAccount(userToken.token, row.ID, password).subscribe(res=>{
          if(res.code === 200){
            this.hospitalAccounts = this.removeElementByAttributeService.removeByAttr(this.hospitalAccounts, 'ID', res.data.id);
            this.table.renderRows();
          }else{
            alert(res.message);
          }
        });
      }
    })
  }

  deleteHospital(hospital){
    let userToken = this.localStorageService.getLocalStorage("token");
    this.dialog.open(ConfirmActionComponent).afterClosed().subscribe(password=>{
      if(password){
        this.removeHospitalService.removeHospital(userToken.token, hospital.ID, password).subscribe(res=>{
          if(res.code === 200){
            this.router.navigate(['dashboard/hospital-list-management']).then(_=>{
              alert(res.message);
            })
          }else{
            alert(res.message);
          }
        });
      }
    });
    console.log(hospital);
  }

}