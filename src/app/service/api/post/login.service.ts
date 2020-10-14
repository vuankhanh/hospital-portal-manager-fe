import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ProfileService } from '../get/profile.service';
import { DateFormatService } from '../../date-format.service';
import { InsurersService } from '../get/insurers.service';

import { environment } from '../../../../environments/environment';

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
    private insurersService: InsurersService,
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
    let insurersService = this.insurersService.getInsurer(token, null).toPromise();
    return Promise.all([getServerConfig, insurersService]);
  }
}
