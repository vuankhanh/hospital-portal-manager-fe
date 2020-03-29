import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { environment } from '../../../../environments/environment.prod';
import { DateFormatService } from '../../date-format.service';

@Injectable({
  providedIn: 'root'
})
export class ListTicketService {
  url: string = environment.apiHost + 'opd/';
  constructor(
    private httpClient: HttpClient,
    private dateFormatService: DateFormatService
  ) { }

  getListTicket(token, parameters: any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization':token
    });

    let params = new HttpParams();

    const today =  Date.now();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate()-1);
    
    params = params.append('from', this.dateFormatService.formatDate(tomorrow));

    if(parameters){
      // if(parameters.status){
      //   params = params.append('status', status);
      // }
      if(parameters.status && parameters.status.length>0){
        parameters.status.forEach(status => {
          params = params.append('status', status);
        });
      }

      if(parameters.cost){
        params = params.append('cost', parameters.cost);
      }

      if(parameters.page){
        params = params.append('page', parameters.page);
      }

      if(parameters.pageSize){
        params = params.append('pageSize', parameters.pageSize);
      }

      if(parameters.insID){
        params = params.append('insID', parameters.insID);
      }
    }

    return this.httpClient.get(this.url, { headers: headers, params: params })
  }
}
