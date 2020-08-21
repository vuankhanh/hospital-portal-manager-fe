import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CreateHospitalService {
  private url: string = environment.managerHost + 'create_hospital';
  constructor(
    private httpClient: HttpClient
  ) { }

  createHospital(token, body){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer "+token
    });

    return this.httpClient.post<Response>(this.url, body, { headers: headers });
  }
}
interface Response{
  code: number;
  data: any,
  message: string;
}

export interface Hospital{
  ID: number;
  hospital_name: string;
  hospital_code: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  idCity: string;
  workTime: string;
  position: string;
  type: string;
  country: string;
  created_at: string;
  updated_at: string;
}