import { Injectable } from '@angular/core';

import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UpdateInsurerService {

  constructor(
    private httpClient: HttpClient
  ) { }

  updateInsurerId(id, newInsurerId: number, token){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-With':'XMLHttpRequest',
      'Authorization':token
    });

    return this.httpClient.put<Response>(environment.apiHost+'opd/'+id+'/update-insurer', { insurer_id: newInsurerId, reason:'' }, { headers: headers });
  }
}
