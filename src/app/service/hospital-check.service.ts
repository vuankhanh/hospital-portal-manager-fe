import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface Response{
  code:number;
  data:string;
  message:string;
  total:number
}
@Injectable({
  providedIn: 'root'
})
export class HospitalCheckService {
  constructor(
    private httpClient: HttpClient
  ) { }

  getHospitalCheck(id, token){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-With':'XMLHttpRequest',
      'Authorization':token
    });
    return this.httpClient.put<Response>('http://localhost:7777/members/'+id+'/take',{}, { headers: headers });
  }

  getHospitalConfirm(id, token){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-With':'XMLHttpRequest',
      'Authorization':token
    });
    return this.httpClient.put<Response>('http://localhost:7777//members/'+id+'/confirm',{}, { headers: headers });
  }

  getHospitalReject(id, token){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-With':'XMLHttpRequest',
      'Authorization':token
    });
    return this.httpClient.put<Response>('http://localhost:7777//members/'+id+'/reject', {}, { headers: headers });
  }
}
