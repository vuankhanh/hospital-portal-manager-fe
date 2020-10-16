import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ConfirmActionComponent } from '../confirm-action/confirm-action.component';

import { Insurer } from '../../../service/api/post/create-insurer.service';
import { ListenConfigurationService } from '../../../service/listen-configuration.service';
import { DateFormatService } from '../../../service/date-format.service';

@Component({
  selector: 'app-insurer-information',
  templateUrl: './insurer-information.component.html',
  styleUrls: ['./insurer-information.component.scss']
})
export class InsurerInformationComponent implements OnInit {
  insurerForm: FormGroup;
  password: string;
  isChangedValue = false;
  changeProperty = {};
  ngForm: any;

  checkObject:number = Object.keys(this.insurer).length;
  
  types = [
    { ID: 1, name: "Nhân Thọ" },
    { ID: 2, name: "Phi Nhân Thọ" }
  ];

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public insurer: Insurer,
    private dialogRef: MatDialogRef<InsurerInformationComponent>,
    public listenConfigurationService: ListenConfigurationService,
    private dateFormatService: DateFormatService
  ) { }

  ngOnInit() {
    this.initForm();
  }

  private initForm(){    
    this.insurerForm = this.formBuilder.group({
      short_name: [this.insurer.short_name ? this.insurer.short_name : '', Validators.required],
      name: [this.insurer.name ? this.insurer.name : '', Validators.required],
      logo: [this.insurer.logo ? this.insurer.logo : '', Validators.required],
      check_benefit_countdown: [this.insurer.check_benefit_countdown ? this.insurer.check_benefit_countdown : '', Validators.required],
      gl_countdown: [this.insurer.gl_countdown ? this.insurer.gl_countdown : '', Validators.required],
      type: [this.insurer.type ? this.insurer.type : '', Validators.required],
      created_at: [this.insurer.created_at ? this.insurer.created_at : this.dateFormatService.fullTime(new Date())],
      updated_at: [this.insurer.updated_at ? this.insurer.updated_at : this.dateFormatService.fullTime(new Date())],
    });

  this.onChanges();
  this.dialogRef.disableClose = true;
  }

  onChanges(): void {
    this.insurerForm.valueChanges.subscribe(val => {
      Object.keys(this.insurerForm.value).forEach(key=>{
        if(this.insurerForm.value[key] != this.insurer[key]){
          this.changeProperty[key] = this.insurerForm.value[key];
        }
      });
      if (this.changeProperty !== {}) {
        this.isChangedValue = true;
      }
    });
  }

  createInsurer(){
    if(this.insurerForm.valid){
        this.dialogRef.disableClose = false;
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