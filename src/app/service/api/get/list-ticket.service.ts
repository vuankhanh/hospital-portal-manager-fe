import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { environment } from '../../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ListTicketService {
  url: string = environment.apiHost + 'opd';
  constructor(
    private httpClient: HttpClient
  ) { }

  getListTicket(token, parameters: any){
    let headers = new HttpHeaders({
      'Authorization': token
    });

    let params = new HttpParams();
    // params = params.append('from', '2020-02-16');
    if(parameters){
      if(parameters.status){
        params = params.append('status', parameters.status);
      }

      if(parameters.from){
        params = params.append('from', parameters.from);
      }

      if(parameters.page){
        params = params.append('page', parameters.page);
      }

      if(parameters.pageSize){
        params = params.append('pageSize', parameters.pageSize);
      }
    }

    return this.httpClient.get(this.url, { headers: headers, params: params })
  }
}
