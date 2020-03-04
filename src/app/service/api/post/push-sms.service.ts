import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PushSmsService {
  urlAuthentication: string = 'http://sandbox.sms.fpt.net/oauth2/token';
  urlPushSms:string = 'http://sandbox.sms.fpt.net/api/push-brandname-otp';
  constructor(
    private httpClient: HttpClient
  ) { }

  pushSms(){

    let body = {
      grant_type: "client_credentials",
      client_id: "cd56A79A25158c309eD55b59c116Ded65753841D",
      client_secret: "91d66ccf1fe26A04b4455cba479d95dC7687817b58ce59Abcaf30a1Ac837Efd4e55bC981",
      scope: "send_brandname_otp",
      session_id: "123123"
    }

    return this.httpClient.post<ResAuthentication>(this.urlAuthentication, body).toPromise().then(res=>{
      console.log(res)
      if(res.token_type){
        
        let a = {
          access_token: res.token_type,
          session_id: "123123",
          BrandName: "FTI",
          Phone: "0842415921",
          Message: "dGVzdCB0aW4gbmjhuq9u"
        }
        // return this.httpClient.post<ResPushSms>(this.urlPushSms, a).toPromise();
      }
    })
  }
}

export interface ResAuthentication{
  access_token:string;
  expires_in: number;
  token_type: string;
  scope: string
}

export interface ResPushSms{
  MessageId:string;
  Phone:string;
  BrandName:string;
  Message:string;
  PartnerId:string;
  Telco:string;
  IsSent:string;
}
