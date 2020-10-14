import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class InsurerService {
  private urlCreateInsurer: string = environment.managerHost + 'create_insurer';
  private urlRemoveInsurer: string = environment.managerHost + 'remove_insurer';
  private urlUpdateInsurer: string = environment.managerHost + 'update_insurer';
  constructor(
    private httpClient: HttpClient
  ) { }

  createInsurer(token, body){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer "+token
    });

    return this.httpClient.post<Response>(this.urlCreateInsurer, body, { headers: headers });
  }

  removeInsurer(token, idInsurer, password){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer "+token
    });

    return this.httpClient.post<Response>(this.urlRemoveInsurer+"/"+idInsurer, { password: password }, { headers: headers });
  }

  updateInsurer(token, idInsurer, password, information){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer "+token
    });

    let body = {
      password: password,
      information: information
    }

    return this.httpClient.post<Response>(this.urlUpdateInsurer+"/"+idInsurer, body, { headers: headers });
  }
}
