import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RemoveHospitalAccountService {
  private url: string = environment.managerHost + 'remove_hospital_user';
  constructor(
    private httpClient: HttpClient
  ) { }
  removeHospitalAccount(token, idAccountHospital, password){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer "+token
    });

    return this.httpClient.post<Response>(this.url+"/"+idAccountHospital, { password: password }, { headers: headers });
  }
}

interface Response{
  code: number;
  data: {id: number},
  message: string;
}