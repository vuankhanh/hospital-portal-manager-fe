import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  urlLogin: string = 'http://localhost:7777/auth/user';
  constructor(
    private httpClient: HttpClient
  ) { }

  login(){
    return this.httpClient.post(this.urlLogin,{});
  }
}
