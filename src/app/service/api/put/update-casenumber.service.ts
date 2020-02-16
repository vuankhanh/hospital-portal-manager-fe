import { Injectable } from '@angular/core';

import { environment } from '../../../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';

interface Response{
  code:number;
  data:string;
  message:string;
  total:number
}

@Injectable({
  providedIn: 'root'
})
export class UpdateCasenumberService {
  url:string = ''
  constructor(
    private httpClient: HttpClient
  ) { }

  insmartUpdateCaseNo(id, caseNo, token){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-With':'XMLHttpRequest',
      'Authorization':token
    });

    return this.httpClient.put<Response>(environment.apiHost+'opd/'+id+'/update-note', { note: caseNo }, { headers: headers });
  }
}
