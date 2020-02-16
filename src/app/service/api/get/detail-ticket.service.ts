import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DetailTicketService {
  url: string = environment.apiHost + 'opd/';
  constructor(
    private httpClient: HttpClient
  ) { }

  getDetailTicket(token, id){
    let headers = new HttpHeaders({
      'Authorization':token
    });
    return this.httpClient.get(this.url+id, { headers: headers })
  }
}
