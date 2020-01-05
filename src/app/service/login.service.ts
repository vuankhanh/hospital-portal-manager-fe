import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

interface Account{
  user_name: string;
  password: string;
}
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  urlLogin: string = 'http://192.168.1.5:7777/auth/user';
  constructor(
    private httpClient: HttpClient
  ) { }

  login(account:Account){
    let headers = new HttpHeaders({
      'Content-Type':'application/json',
      'X-Requested-With':'XMLHttpRequest'
    });
    return this.httpClient.post(this.urlLogin, account, { headers: headers });
  }
}
