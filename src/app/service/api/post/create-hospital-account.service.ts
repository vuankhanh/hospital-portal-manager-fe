import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CreateHospitalAccountService {
  private url: string = environment.managerHost + 'create_hospital_account';
  constructor(
    private httpClient: HttpClient
  ) { }
  createAccount(token, body){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer "+token
    });

    return this.httpClient.post<Response>(this.url, body, { headers: headers });
  }
}

interface Response{
  code: number;
  data: any,
  message: string;
}
