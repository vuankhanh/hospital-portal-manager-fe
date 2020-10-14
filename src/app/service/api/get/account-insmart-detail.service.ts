import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AccountInsmartDetailService {
  private url: string = environment.managerHost + 'get_account/';
  constructor(
    private httpClient: HttpClient
  ) { }

  getInsmartUser(token, id){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer "+token,
      'table': 'insmart'
    });
    return this.httpClient.get<Response>(this.url+id, { headers: headers })
  }
}
export interface Response{
  code: number;
  message: string;
  data: InsmartUsers;
}
export interface InsmartUsers extends Array<InsmartUser>{};
interface InsmartUser {
  ID: number;
  name: string;
  email: string;
  fullname: string;
  phone: string;
  title: string;
  status: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}