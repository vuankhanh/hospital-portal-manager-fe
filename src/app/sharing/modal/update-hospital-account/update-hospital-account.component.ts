import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DateFormatService } from 'src/app/service/date-format.service';
import { ListenConfigurationService } from 'src/app/service/listen-configuration.service';
import { Account } from '../../../service/api/get/account-hospital.service';

@Component({
  selector: 'app-update-hospital-account',
  templateUrl: './update-hospital-account.component.html',
  styleUrls: ['./update-hospital-account.component.scss']
})
export class UpdateHospitalAccountComponent implements OnInit {
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
    private dialogRef: MatDialogRef<UpdateHospitalAccountComponent>,
    public listenConfigurationService: ListenConfigurationService,
    private dateFormatService: DateFormatService
  ) { }

  ngOnInit() {
    this.initForm();
  }

  private initForm(){
    this.accountForm = this.formBuilder.group({
      name: [this.account.name ? this.account.name : '', Validators.required],
      email: [this.account.email ? this.account.email : ''],
      password: [''],
      // status: [this.account.status ? this.account.status : ''],
      updated_at: [this.dateFormatService.fullTime(new Date()), Validators.required],
    });

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
      this.dialogRef.close(
        this.checkObject === 0 ? { information: this.changeProperty } :
        {
          password: this.password,
          information: this.changeProperty
        }
      );
    }
  }
}
