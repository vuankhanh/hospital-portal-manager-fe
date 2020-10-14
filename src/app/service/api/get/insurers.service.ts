import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class InsurersService {
  private url: string = environment.managerHost + 'get_insurer';
  constructor(
    private httpClient: HttpClient
  ) { }

  getInsurer(token, parameters){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer "+token
    });

    let params = new HttpParams();
    if(parameters) {
      if(parameters.pageSize){
        params = params.append('page_size', parameters.pageSize);
      }
      if(parameters.pageIndex){
        params = params.append('page_index', parameters.pageIndex);
      }
      if(parameters.shortName){
        params = params.append('short_name', parameters.shortName);
      }
      
      return this.httpClient.get<Response>(this.url, { headers: headers, params: params })
    } else {

      return this.httpClient.get<Response>(this.url, { headers: headers})
    }
  }
}
export interface Response{
  code: number;
  message: string;
  data: Insurers;
  length: number;
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
