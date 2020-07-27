import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class HospitalDetailService {
  private url: string = environment.managerHost + 'get_hospital/';
  constructor(
    private httpClient: HttpClient
  ) { }

  getHospital(token, id){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer "+token
    });
    return this.httpClient.get<Response>(this.url+id, { headers: headers })
  }
}
export interface Response{
  code: number;
  message: string;
  data: Hospitals;
}
export interface Hospitals extends Array<Hospital>{};
interface Hospital {
  ID: number;
  hospital_name: string;
  hospital_code: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  idCity: number;
  workTime: string;
  position: string;
  type: string;
  country: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}