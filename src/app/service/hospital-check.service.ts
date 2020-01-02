import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
  urlTake:string = 'http://localhost:7777/members/1/take';
  urlConfirm:string = 'http://localhost:7777//members/1/confirm';
  urlReject:string = 'http://localhost:7777//members/1/reject';

  constructor(
    private httpClient: HttpClient
  ) { }

  getHospitalCheck(){
    return this.httpClient.put<Response>(this.urlTake,{});
  }

  getHospitalConfirm(){
    return this.httpClient.put<Response>(this.urlConfirm,{});
  }

  getHospitalReject(){
    return this.httpClient.put<Response>(this.urlReject,{});
  }
}
