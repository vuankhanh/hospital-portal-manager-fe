import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RemoveInsurerService {
  private url: string = environment.managerHost + 'remove_insurer';
  constructor(
    private httpClient: HttpClient
  ) { }
  removeInsurer(token, idInsurer, password){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer "+token
    });

    return this.httpClient.post<Response>(this.url+"/"+idInsurer, { password: password }, { headers: headers });
  }
}

interface Response{
  code: number;
  data: {id: number},
  message: string;
}
