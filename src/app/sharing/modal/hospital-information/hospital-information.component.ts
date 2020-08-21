import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ConfirmActionComponent } from '../confirm-action/confirm-action.component';

import { Hospital } from '../../../service/api/post/create-hospital.service';
import { ListenConfigurationService } from '../../../service/listen-configuration.service';

@Component({
  selector: 'app-hospital-information',
  templateUrl: './hospital-information.component.html',
  styleUrls: ['./hospital-information.component.scss']
})
export class HospitalInformationComponent implements OnInit {
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
    @Inject(MAT_DIALOG_DATA) public hospital: Hospital,
    private dialogRef: MatDialogRef<HospitalInformationComponent>,
    public listenConfigurationService: ListenConfigurationService
  ) { }

  ngOnInit() {
    this.initForm();
  }

  private initForm(){
    this.hospitalForm = this.formBuilder.group({
      hospital_name: [this.hospital.hospital_name ? this.hospital.hospital_name : '', Validators.required],
      hospital_code: [this.hospital.hospital_code ? this.hospital.hospital_code : '', Validators.required],
      street: [this.hospital.street ? this.hospital.street : '', Validators.required],
      ward: [this.hospital.ward ? this.hospital.ward : '', Validators.required],
      district: [this.hospital.district ? this.hospital.district : '', Validators.required],
      city: [this.hospital.city ? this.hospital.city : '', Validators.required],
      idCity: [this.hospital.idCity ? this.hospital.idCity : '', Validators.required],
      workTime: [this.hospital.workTime ? this.hospital.workTime : ''],
      position: [this.hospital.position ? this.hospital.position : ''],
      type: [this.hospital.type ? this.hospital.type : ''],
      country: [this.hospital.country ? this.hospital.country : ''],
      created_at: [this.hospital.created_at ? this.hospital.created_at : ''],
      updated_at: [this.hospital.updated_at ? this.hospital.updated_at : ''],
    });

    // this.hospitalForm = this.formBuilder.group({
    //   hospital_name: ['', Validators.required],
    //   hospital_code: ['', Validators.required],
    //   street: ['', Validators.required],
    //   ward: ['', Validators.required],
    //   district: ['', Validators.required],
    //   city: ['', Validators.required],
    //   idCity: ['', Validators.required],
    //   workTime: [''],
    //   position: [''],
    //   type: [''],
    //   country: [''],
    //   created_at: [''],
    //   updated_at: [''],
    // });

    console.log(this.hospitalForm);
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