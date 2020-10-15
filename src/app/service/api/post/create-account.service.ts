import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CreateAccountService {
  private url: string = environment.managerHost + 'create_account';
  constructor(
    private httpClient: HttpClient
  ) { }
  createAccount(token, body, tablechoose){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer "+token,
      'tablechoose': tablechoose
    });

    return this.httpClient.post<Response>(this.url, body, { headers: headers });
  }
}

interface Response{
  code: number;
  data: any,
  message: string;
}

export interface Account {
  ID: number;
  name: string;
  email: string;
  phone: string;
  fullname: string;
  title:string;
  status: number;
  password: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}