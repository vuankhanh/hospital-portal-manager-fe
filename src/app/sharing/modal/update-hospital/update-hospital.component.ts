import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ListenConfigurationService } from '../../../service/listen-configuration.service';

@Component({
  selector: 'app-update-hospital',
  templateUrl: './update-hospital.component.html',
  styleUrls: ['./update-hospital.component.scss']
})
export class UpdateHospitalComponent implements OnInit {
  hospitalForm: FormGroup;

  types=[
    { ID: 1, name: "Phòng khám" },
    { ID: 2, name: "Bệnh viện" }
  ]

  countries=[
    { ID: 1, name: "VN" }
  ]
  constructor(
    private dialogRef: MatDialogRef<UpdateHospitalComponent>,
    @Inject(MAT_DIALOG_DATA) public hospital: any,
    private formBuilder: FormBuilder,
    public listenConfigurationService: ListenConfigurationService
  ) { }

  ngOnInit() {
    console.log(this.hospital);
    this.initForm()
  }

  private initForm(){
    this.hospitalForm = this.formBuilder.group({
      hospital_name: [this.hospital.hospital_name, Validators.required],
      hospital_code: [this.hospital.hospital_code, Validators.required],
      street: [this.hospital.street, Validators.required],
      ward: [this.hospital.ward, Validators.required],
      district: [this.hospital.district, Validators.required],
      city: [this.hospital.city, Validators.required],
      idCity: [this.hospital.idCity, Validators.required],
      workTime: [this.hospital.workTime],
      position: [this.hospital.position],
      type: [this.hospital.type],
      country: [this.hospital.country],
      created_at: [this.hospital.created_at],
      updated_at: [this.hospital.updated_at],
    });
  }

}
