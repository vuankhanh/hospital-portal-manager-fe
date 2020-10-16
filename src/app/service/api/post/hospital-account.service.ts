import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class HospitalAccountService {
  private urlCreateAccount: string = environment.managerHost + 'create_hospital_account';
  private urlRemoveAccount: string = environment.managerHost + 'remove_hospital_user';
  private urlUpdateAccount: string = environment.managerHost + 'update_hospital_account';

  constructor(
    private httpClient: HttpClient
  ) { }

  createAccount(token, body){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer "+token,
      'tablechoose': 'hospital'
    });

    return this.httpClient.post<Response>(this.urlCreateAccount, body, { headers: headers });
  }

  removeAccount(token, idAccount, password){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer "+token,
      'tablechoose': 'hospital'
    });

    return this.httpClient.post<Response>(this.urlRemoveAccount+"/"+idAccount, { password: password }, { headers: headers });
  }

  updateAccount(token, idAccount, password, information){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer "+token,
      'tablechoose': 'hospital'
    });

    let body = {
      password: password,
      information: information
    }
    // console.log(body);
    
    return this.httpClient.post<Response>(this.urlUpdateAccount+"/"+idAccount, body, { headers: headers });
  }
}
