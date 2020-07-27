import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class InsurersService {
  private url: string = environment.managerHost + 'get_insurer';
  constructor(
    private httpClient: HttpClient
  ) { }

  getHospital(token){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer "+token
    });
    return this.httpClient.get<Response>(this.url, { headers: headers })
  }
}
export interface Response{
  code: number;
  message: string;
  data: Insurers;
}
export interface Insurers extends Array<Insurer>{};
interface Insurer {
  ID: number;
  short_name: string;
  name: string;
  logo: string;
  check_benefit_countdown: string;
  gl_countdown: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  type: number;
}
