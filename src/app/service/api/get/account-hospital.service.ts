import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AccountHospitalService {
  private url: string = environment.managerHost + 'get_account/hospital/';
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
  data: HospitalAccounts;
}
export interface HospitalAccounts extends Array<Account>{};
export interface Account {
  ID: number;
  name: string;
  email: string;
  status: number;
  password: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  hospital_id: number;
}