import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-confirm-action',
  templateUrl: './confirm-action.component.html',
  styleUrls: ['./confirm-action.component.scss']
})
export class ConfirmActionComponent implements OnInit {
  private confirmGroup: FormGroup
  constructor(
    private dialogRef: MatDialogRef<ConfirmActionComponent>,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.initForm();
  }

  private initForm(){
    this.confirmGroup = this.formBuilder.group({
      password: ['', Validators.required]
    })
  }

  private requestAuthentication(){
    if(this.confirmGroup.valid){
      this.dialogRef.close(this.confirmGroup.value.password);
    }
  }

}
