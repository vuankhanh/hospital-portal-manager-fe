import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTable, PageEvent } from '@angular/material';
import { Router } from '@angular/router';
import { CreateAccountService } from 'src/app/service/api/post/create-account.service';
import { TraTuService } from 'src/app/service/tra-tu.service';
import { AccountInformationComponent } from 'src/app/sharing/modal/account-information/account-information.component';

import { AccountInsmartService, InsmartAccounts } from '../../service/api/get/account-insmart.service';
import { LocalStorageService } from '../../service/local-storage.service';

@Component({
  selector: 'app-staff-account-management',
  templateUrl: './staff-account-management.component.html',
  styleUrls: ['./staff-account-management.component.scss']
})
export class StaffAccountManagementComponent implements OnInit {
  @ViewChild(MatTable, { static: false }) table: MatTable<any>;

  accounts: InsmartAccounts;
  pageSize:number = 10;
  pageIndex: number = 1;
  length:number;
  pageSizeOptions: number[] = [10, 25, 100];

  displayedColumns: string[] = ['name', 'fullname', 'email', 'phone', 'title'];
  constructor(
    private router: Router,
    private accountsService: AccountInsmartService,
    private localStorageService: LocalStorageService,
    public traTuService: TraTuService,
    private dialog: MatDialog,
    private createAccountService: CreateAccountService
  ) { }

  // ngOnInit() {
  //   let userData = this.localStorageService.getLocalStorage("token");
  //   if(userData){
  //     this.accountInsmartService.getInsmart(userData.token, null).subscribe(res=>{
  //       console.log(res);
  //       this.accounts = res.data;
  //     })
  //   }
  // }

  // showDetail(element){
  //   console.log(element);
  // }
  ngOnInit() {
    let params = {
      pageSize: this.pageSize,
      pageIndex: this.pageIndex
    }
    this.setAccount(params);
  }

  onSearchChange(event){
    let name = event.target.value;
    let params = {
      pageSize: this.pageSize,
      pageIndex: this.pageIndex,
      name: name
    }

    this.setAccount(params);
  }

  createAccount(){
    return this.dialog.open(AccountInformationComponent,{
      data: {}
    }).afterClosed().subscribe(result=>{
      if(result){
        let userData = this.localStorageService.getLocalStorage("token");
        this.createAccountService.createAccount(userData.token, result.information, 'insmart').subscribe(res=>{          
          if(res.code === 200){
            alert(res.message);
            console.log(res.data);
            console.log(this.length);
            
            this.accounts.push(res.data);
            this.length++;
            this.table.renderRows();
          }else if(res.code === 500){
            alert(res.message);
          }
        },error=>{
          console.log(error);
        })
      }
    });
  }

  setAccount(params){
    let userInfo = this.localStorageService.getLocalStorage('token');

    this.accountsService.getInsmart(userInfo.token, params).subscribe(res=>{
      this.accounts = res.data;
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
    this.setAccount(params);
  }

  showDetail(account){
    this.router.navigate(['/dashboard/account-detail', account.ID]);
  }
}
