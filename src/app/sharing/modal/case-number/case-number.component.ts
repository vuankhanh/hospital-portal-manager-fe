import { Component, OnInit, Inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-case-number',
  templateUrl: './case-number.component.html',
  styleUrls: ['./case-number.component.scss']
})
export class CaseNumberComponent implements OnInit, AfterViewInit {
  @ViewChild('caseNumber', {static:false}) caseNumber: ElementRef;
  caseBatchForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<CaseNumberComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.createForm();
  }

  ngAfterViewInit(){
    setTimeout(() => {
      this.caseNumber.nativeElement.focus();
    }, 250);
  }

  createForm(){
    let caseNumber = '';
    let batchNumber = '';
    if(this.data.split('-').length === 2){
      caseNumber = this.data.split('-')[0];
      batchNumber = this.data.split('-')[1];
    }
    this.caseBatchForm = this.formBuilder.group({
      case: [caseNumber, Validators.required],
      batch: [batchNumber, Validators.required]
    })
  }

  setCaseBatch(){
    if(this.caseBatchForm.valid){
      let result = this.caseBatchForm.value.case + '-' + this.caseBatchForm.value.batch;
      this.dialogRef.close(result);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  
}
