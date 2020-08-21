import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RemoveHospitalService {
  private url: string = environment.managerHost + 'remove_hospital';
  constructor(
    private httpClient: HttpClient
  ) { }
  removeHospital(token, idHospital, password){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer "+token
    });

    return this.httpClient.post<Response>(this.url+"/"+idHospital, { password: password }, { headers: headers });
  }
}

interface Response{
  code: number;
  data: {id: number},
  message: string;
}
