import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CreateAccountService {
  private url: string = environment.managerHost + 'create_account';
  constructor(
    private httpClient: HttpClient
  ) { }
  createAccount(token, body, tablechoose){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer "+token,
      'tablechoose': tablechoose
    });

    return this.httpClient.post(this.url, body, { headers: headers });
  }
}
