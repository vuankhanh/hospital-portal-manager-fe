import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AccountInsmartService {
  private url: string = environment.managerHost + 'get_account/';
  constructor(
    private httpClient: HttpClient
  ) { }

  getInsmart(token, parameters){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer "+token,
      'tablechoose': 'insmart'
    });
    
    let params = new HttpParams();
    if(parameters) {
      if(parameters.pageSize){
        params = params.append('page_size', parameters.pageSize);
      }
      if(parameters.pageIndex){
        params = params.append('page_index', parameters.pageIndex);
      }
      if(parameters.name){
        params = params.append('name', parameters.name);
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
  data: InsmartAccounts;
  length: number;
}
export interface InsmartAccounts extends Array<Account>{};
interface Account {
  ID: number;
  name: string;
  email: string;
  phone: string;
  fullname: string;
  status: number;
  title: string;
  password: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}