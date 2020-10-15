import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTable } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountInsmartDetailService, InsmartUsers } from 'src/app/service/api/get/account-insmart-detail.service';
import { AccountService } from 'src/app/service/api/post/account.service';
import { RemoveAccountService } from 'src/app/service/api/post/remove-account.service';
import { LocalStorageService } from 'src/app/service/local-storage.service';
import { ConfirmActionComponent } from 'src/app/sharing/modal/confirm-action/confirm-action.component';
import { AccountInformationComponent } from 'src/app/sharing/modal/account-information/account-information.component';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.scss']
})
export class AccountDetailComponent implements OnInit {
  @ViewChild(MatTable, { static: false }) table: MatTable<any>;
  private id: number;
  private subsciption: Subscription = new Subscription();
  accountDetail: InsmartUsers;
  constructor(
    private activedRoute: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private accountDetailService: AccountInsmartDetailService,
    private router: Router,
    private dialog: MatDialog,
    private accountService: AccountService,
    private removeAccountService: RemoveAccountService
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
    this.accountDetailService.getInsmartUser(token, id).subscribe(res=>{
      this.accountDetail = res.data;
    });
  }

  updateAccount(row){    
    const dialog = this.dialog.open(AccountInformationComponent,{
      data: row
    });

    dialog.afterClosed().subscribe(result=>{
      this.dialog.open(ConfirmActionComponent).afterClosed().subscribe(password=>{
        if(password){
          result.password = password;
        }
      if(result && result.password){
        delete result.information.created_at;
        let userToken = this.localStorageService.getLocalStorage("token");
        this.accountService.updateAccount(userToken.token, row.ID, result.password, result.information).subscribe(res=>{
          // Re-rendering changes in the detail page
          for (const [key, value] of Object.entries(result.information)) {
            if(key == 'fullname') {
              this.accountDetail[0].fullname = value as string;
            } else if (key == 'name') {
              this.accountDetail[0].name = value as string;
            } else if (key == 'email') {
              this.accountDetail[0].email = value as string;
            } else if (key == 'phone') {
              this.accountDetail[0].phone = value as string;
            } else if (key == 'title') {
              this.accountDetail[0].title = value as string;
            } else if (key == 'status') {
              this.accountDetail[0].status = value as number;
            }
          }
          // console.log(res);
        },error=>console.log(error));
      }
    });
  });
  }

  deleteAccount(account){
    let userToken = this.localStorageService.getLocalStorage("token");
    this.dialog.open(ConfirmActionComponent).afterClosed().subscribe(password=>{
      if(password){
        this.removeAccountService.removeAccount(userToken.token, account.ID, password).subscribe(res=>{
          if(res.code === 200){
            this.router.navigate(['dashboard/staff-account-management']).then(_=>{
              alert(res.message);
            })
          }else{
            alert(res.message);
          }
        });
      }
    });
    console.log(account);
  }
}
