import { Injectable } from '@angular/core';

import { environment } from '../../../../environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SystemConfigurationService {
  url: string = environment.apiHost + 'configs';
  constructor(
    private httpClient: HttpClient
  ) { }

  getSystemConfiguration(token){
    let headers = new HttpHeaders({
      'Authorization':token
    });

    return this.httpClient.get(this.url, { headers: headers })
  }
}
