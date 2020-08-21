import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class HospitalsService {
  url: string = environment.managerHost + 'get_hospital';
  constructor(
    private httpClient: HttpClient
  ) { }

  getHospital(token, parameters){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer "+token
    });

    let params = new HttpParams();
    if(parameters.pageSize){
      params = params.append('page_size', parameters.pageSize);
    }
    if(parameters.pageIndex){
      params = params.append('page_index', parameters.pageIndex);
    }
    if(parameters.hospitalCode){
      params = params.append('hospital_code', parameters.hospitalCode);
    }

    return this.httpClient.get<Response>(this.url, { headers: headers, params: params })
  }
}
export interface Response{
  code: number;
  message: string;
  data: Hospitals;
  pageSize: number,
  pageIndex: number,
  length: number;
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
