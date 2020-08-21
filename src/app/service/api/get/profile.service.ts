import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  url: string = environment.managerHost + 'config';
  constructor(
    private httpClient: HttpClient
  ){ }

  getProfile(token){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer "+token
    });
    return this.httpClient.get(this.url, { headers: headers })
  }
}
