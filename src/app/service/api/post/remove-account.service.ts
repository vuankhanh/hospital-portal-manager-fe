import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RemoveAccountService {
  private url: string = environment.managerHost + 'remove_account';
  constructor(
    private httpClient: HttpClient
  ) { }
  removeAccount(token, idAccount, password){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer "+token,
      'table': 'insmart'
    });

    return this.httpClient.post<Response>(this.url+"/"+idAccount, { password: password }, { headers: headers });
  }
}

interface Response{
  code: number;
  data: {id: number},
  message: string;
}
