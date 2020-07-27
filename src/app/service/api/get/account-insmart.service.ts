import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AccountInsmartService {
  private url: string = environment.managerHost + 'get_account/';
  constructor(
    private httpClient: HttpClient
  ) { }

  getInsmart(token){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer "+token,
      'tablechoose': 'insmart'
    });
    return this.httpClient.get<Response>(this.url, { headers: headers })
  }
}
export interface Response{
  code: number;
  message: string;
  data: InsmartAccounts;
}
export interface InsmartAccounts extends Array<Account>{};
interface Account {
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