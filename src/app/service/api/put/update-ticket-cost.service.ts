import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UpdateTicketCostService {

  constructor(
    private httpClient: HttpClient
  ) { }

  insmartUpdateCosts(id, body, token){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-With':'XMLHttpRequest',
      'Authorization':token
    });

    return this.httpClient.put<Response>(environment.apiHost+'opd/'+id+'/insmart-update-costs', body, { headers: headers });
  }
}