import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class HospitalService {
  private urlCreateHospital: string = environment.managerHost + 'create_hospital';
  private urlRemoveHospital: string = environment.managerHost + 'remove_hospital';
  private urlUpdateHospital: string = environment.managerHost + 'update_hospital';
  constructor(
    private httpClient: HttpClient
  ) { }

  createHospital(token, body){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer "+token
    });

    return this.httpClient.post<Response>(this.urlCreateHospital, body, { headers: headers });
  }

  removeHospital(token, idHospital, password){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer "+token
    });

    return this.httpClient.post<Response>(this.urlRemoveHospital+"/"+idHospital, { password: password }, { headers: headers });
  }

  updateHospital(token, idHospital, password, information){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer "+token
    });

    let body = {
      password: password,
      information: information
    }

    return this.httpClient.post<Response>(this.urlUpdateHospital+"/"+idHospital, body, { headers: headers });
  }
}
