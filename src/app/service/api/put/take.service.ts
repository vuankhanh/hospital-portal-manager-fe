import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../../environments/environment';

interface Response{
  code:number;
  data:string;
  message:string;
  total:number
}

@Injectable({
  providedIn: 'root'
})
export class TakeService {

  constructor(
    private httpClient: HttpClient
  ) { }

  insmartTake(id, token){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-With':'XMLHttpRequest',
      'Authorization':token
    });

    return this.httpClient.put<Response>(environment.apiHost+'opd/'+id+'/insmart-taken', { reasons: "Insmart đang xử lý" }, { headers: headers });
  }
}