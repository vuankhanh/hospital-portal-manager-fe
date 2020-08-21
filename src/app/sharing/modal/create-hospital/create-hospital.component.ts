import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

import { ConfirmActionComponent } from '../confirm-action/confirm-action.component';

import { ListenConfigurationService } from '../../../service/listen-configuration.service';

@Component({
  selector: 'app-create-hospital',
  templateUrl: './create-hospital.component.html',
  styleUrls: ['./create-hospital.component.scss']
})
export class CreateHospitalComponent implements OnInit {
  hospitalForm: FormGroup;

  types=[
    { ID: 1, name: "Phòng khám" },
    { ID: 2, name: "Bệnh viện" }
  ]

  countries=[
    { ID: 1, name: "VN" }
  ]
  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CreateHospitalComponent>,
    public listenConfigurationService: ListenConfigurationService
  ) { }

  ngOnInit() {
    this.initForm();
  }

  private initForm(){
    this.hospitalForm = this.formBuilder.group({
      hospital_name: ['', Validators.required],
      hospital_code: ['', Validators.required],
      street: ['', Validators.required],
      ward: ['', Validators.required],
      district: ['', Validators.required],
      city: ['', Validators.required],
      idCity: ['', Validators.required],
      workTime: [''],
      position: [''],
      type: [''],
      country: ['VN'],
      created_at: [new Date()],
      updated_at: [new Date()],
    })
  }

  private showDetail(city){
    this.hospitalForm.get('idCity').setValue(city.ID);
  }

  private createHospital(){
    if(this.hospitalForm.valid){
      this.dialogRef.close(this.hospitalForm.value);
    }
  }

}
