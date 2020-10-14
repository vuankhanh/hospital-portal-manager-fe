import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ConfirmActionComponent } from '../confirm-action/confirm-action.component';

import { Hospital } from '../../../service/api/post/create-hospital.service';
import { ListenConfigurationService } from '../../../service/listen-configuration.service';
import { DateFormatService } from '../../../service/date-format.service';

@Component({
  selector: 'app-hospital-information',
  templateUrl: './hospital-information.component.html',
  styleUrls: ['./hospital-information.component.scss']
})
export class HospitalInformationComponent implements OnInit {
  hospitalForm: FormGroup;
  password: string;

  checkObject:number = Object.keys(this.hospital).length;
  
  types=[
    { ID: 1, name: "Phòng khám" },
    { ID: 2, name: "Bệnh viện" }
  ];

  countries=[
    { ID: 1, name: "VN" }
  ];
  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public hospital: Hospital,
    private dialogRef: MatDialogRef<HospitalInformationComponent>,
    public listenConfigurationService: ListenConfigurationService,
    private dateFormatService: DateFormatService
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
      created_at: [this.hospital.created_at ? this.hospital.created_at : this.dateFormatService.fullTime(new Date())],
      updated_at: [this.hospital.updated_at ? this.hospital.updated_at : this.dateFormatService.fullTime(new Date())],
    });
  }

  createHospital(){
    if(this.hospitalForm.valid){
      let changeProperty = {};
      Object.keys(this.hospitalForm.value).forEach(key=>{
        if(this.hospitalForm.value[key] != this.hospital[key]){
          changeProperty[key] = this.hospitalForm.value[key];
        }
      });
      this.dialogRef.close(
        this.checkObject === 0 ? { information: changeProperty } :
        {
          password: this.password,
          information: changeProperty
        }
      );
    }
  }

  selectionCity(event, city){
    if(event.isUserInput){
      this.hospitalForm.controls['idCity'].setValue(city.ID);
    }
  }

}