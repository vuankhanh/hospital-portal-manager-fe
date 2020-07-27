import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class BackEndService {
  url: string = environment.managerHost;
  constructor(
    private httpClient: HttpClient
  ) { }

  getHospital(){
    return this.httpClient.get(this.url);
  }
}
