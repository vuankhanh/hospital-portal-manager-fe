import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

@Component({
  selector: 'app-create-account-hospital',
  templateUrl: './create-account-hospital.component.html',
  styleUrls: ['./create-account-hospital.component.scss']
})
export class CreateAccountHospitalComponent implements OnInit {
  createAccount: FormGroup
  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CreateAccountHospitalComponent>,
    @Inject(MAT_DIALOG_DATA) public hospitalId: number
  ) { }

  ngOnInit() {
    console.log('hospital ID ',this.hospitalId);
    this.initForm();
  }

  initForm(){
    this.createAccount = this.formBuilder.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
      rePassword: ['', Validators.required],
      email: [''],
      status: [0],
      hospital_id: this.hospitalId
    })
  }

  create(){
    if(this.createAccount.valid){
      if(this.createAccount.value.password === this.createAccount.value.rePassword){
        delete this.createAccount.value.rePassword;
        this.dialogRef.close(this.createAccount.value);
      }else{
        alert('Mật khẩu chưa trùng khớp');
      }
    }else{
      console.log('Chưa hợp lệ');
    }
  }
}
