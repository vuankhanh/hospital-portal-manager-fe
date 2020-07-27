import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ProfileService } from '../get/profile.service';
import { DateFormatService } from '../../date-format.service';

interface ResponseLogin{
  code: number;
  data: ResponseDataLogin,
  message: string;
  token: string;
}

interface ResponseDataLogin{
  ID: number,
  name: string,
  email: string,
  fullname: string,
  phone: string,
  title: string,
  status: number,
  created_at: string,
  updated_at: string,
  deleted_at: string
}

interface Account{
  user_name: string;
  password: string;
}
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  urlLogin: string = environment.managerHost + 'login';
  constructor(
    private httpClient: HttpClient,
    private profileService: ProfileService,
    private dateFormatService: DateFormatService
  ) { }

  login(account:Account){
    let headers = new HttpHeaders({
      'Content-Type':'application/json'
    });
    return this.httpClient.post<ResponseLogin>(this.urlLogin, account, { headers: headers });
  }

  thenLogin(token){
    let getServerConfig = this.profileService.getProfile(token).toPromise();
    return Promise.all([getServerConfig]);
  }
}
