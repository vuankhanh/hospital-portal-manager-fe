import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ConfirmActionComponent } from '../confirm-action/confirm-action.component';

import { Account } from '../../../service/api/post/create-account.service';
import { ListenConfigurationService } from '../../../service/listen-configuration.service';
import { DateFormatService } from '../../../service/date-format.service';

@Component({
  selector: 'app-account-information',
  templateUrl: './account-information.component.html',
  styleUrls: ['./account-information.component.scss']
})
export class AccountInformationComponent implements OnInit {
  accountForm: FormGroup;
  password: string;

  checkObject:number = Object.keys(this.account).length;
  changeProperty = {};
  isChangedValue = false;
  
  titles=[
    { value: 'MANAGER', name: "MANAGER" },
    { value: 'STAFF', name: "STAFF" }
  ];

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public account: Account,
    private dialogRef: MatDialogRef<AccountInformationComponent>,
    public listenConfigurationService: ListenConfigurationService,
    private dateFormatService: DateFormatService
  ) { }

  ngOnInit() {
    this.initForm();
  }

  private initForm(){
    this.accountForm = this.formBuilder.group({
      fullname: [this.account.fullname ? this.account.fullname : '', Validators.required],
      name: [this.account.name ? this.account.name : '', Validators.required],
      title: [this.account.title ? this.account.title : '', Validators.required],
      email: [this.account.email ? this.account.email : ''],
      phone: [this.account.phone ? this.account.phone : ''],
      // status: [this.account.status ? this.account.status : ''],
      updated_at: [this.dateFormatService.fullTime(new Date()), Validators.required],
    });

    if(this.checkObject === 0) {
      this.accountForm.addControl('created_at', new FormControl(this.dateFormatService.fullTime(new Date()), Validators.required));
      this.accountForm.addControl('password', new FormControl('', Validators.required));
    }

    this.onChanges();
  }

  onChanges(): void {
    this.accountForm.valueChanges.subscribe(val => {
      Object.keys(this.accountForm.value).forEach(key=>{
        if(this.accountForm.value[key] != this.account[key]){
          this.changeProperty[key] = this.accountForm.value[key];
        }
      });
      if (this.changeProperty !== {}) {
        this.isChangedValue = true;
      }
    });
  }
  
  createAccount(){
    if(this.accountForm.valid){
      let changeProperty = {};
      Object.keys(this.accountForm.value).forEach(key=>{
        if(this.accountForm.value[key] != this.account[key]){
          changeProperty[key] = this.accountForm.value[key];
        }
      });
      console.log(changeProperty);
      this.dialogRef.close(
        this.checkObject === 0 ? { information: changeProperty } :
        {
          password: this.password,
          information: changeProperty
        }
        
      );
    }
  }

}