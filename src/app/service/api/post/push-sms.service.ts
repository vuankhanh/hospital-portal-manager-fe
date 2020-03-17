import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../../environments/environment'

import { TraTuService } from '../../tra-tu.service';

@Injectable({
  providedIn: 'root'
})
export class PushSmsService {
  urlAuthentication: string = environment.smsFpt+'oauth2/token';
  urlPushSms:string = environment.smsFpt+'api/push-brandname-otp';
  constructor(
    private httpClient: HttpClient,
    private tratuService: TraTuService
  ) { }

  authentication(message:string, phoneNumber:string){
    let headers = new HttpHeaders({
      'Content-Type':'application/json',
      'X-Requested-With':'XMLHttpRequest'
    });

    let authenticationBody = {
      grant_type: "client_credentials",
      client_id: "275875e0948124652d8f17B0fE5B1072640b4922",
      client_secret: "123c013aee2ac0190814582f914927f15713930eCaa42A643e1e20364dC77E3634777af7",
      scope: "send_brandname_otp",
      session_id: "123123"
    }

    return this.httpClient.post<ResAuthentication>(this.urlAuthentication, authenticationBody, { headers: headers }).toPromise().then(res=>{
      let body = {
        access_token:res.access_token,
        session_id: authenticationBody.session_id,
        BrandName: "FTI",
        Phone: phoneNumber,
        Message: message
      }
      return this.httpClient.post<ResPushSms>(this.urlPushSms, body, { headers: headers }).toPromise()
    });
  }

  lifeOpdSms(insurer: number, fee, phoneNumber):Promise<any>{
    try {
      let message = this.tratuService.insurers[insurer-1] + "/Insmart da bao lanh chi phi bang "+
      fee+" dong. Chuc Quy khach that nhieu suc khoe";
      let encodeBase64:string = window.btoa(message);
      return this.authentication(encodeBase64, phoneNumber);
    } catch (error) {
      console.log(error);
      console.log('Lỗi encode64');
    }
    
  }

  noneLifeSms(fee, phoneNumber:string):Promise<any>{
    try {
      let message = "CTBH/Insmart da bao lanh chi phi bang "+fee+" dong. Chuc Quy khach that nhieu suc khoe";
      let encodeBase64:string = window.btoa(message);
      return this.authentication(encodeBase64, phoneNumber);
    } catch (error) {
      console.log(error);
      console.log('Lỗi encode64');
    }
  }

  // pushSms(){
  //   let headers = new HttpHeaders({
  //     'Content-Type':'application/json',
  //     'X-Requested-With':'XMLHttpRequest'
  //   });

  //   let body = {
  //     access_token:"OVFtQWVNNXIxeUZyVFBHbm9CMERJeStBWmlkQkhYek9qeHNJbzhyNjM5WUdpaUxNczJoRUxQY3h3VW5UV09WcmFMbW9uVlVkL2wySlc3bnpVS2g0YTgxVy9ndVp6b21HVjBOcEFHc1VjSHI2dzJySlJPZnZPU2ZiTVAvaHREWTBiWm5MMmZVcUpIc3VyRUJRUmlmeDBmaXVaTXFXSDZadEM5SmZCSnRLaFUwPQ==",
  //     session_id: "123123",
  //     BrandName: "FTI",
  //     Phone: "0842415921",
  //     Message: "dGVzdCB0aW4gbmjhuq9u"
  //   }

  //   return this.httpClient.post<ResAuthentication>(this.urlPushSms, body, { headers: headers }).toPromise().then(res=>{
  //     console.log(res)
  //   })
  // }

  
}

export interface ResAuthentication{
  access_token:string;
  expires_in: number;
  token_type: string;
  scope: string
}

export interface ResPushSms{
  MessageId:string;
  PartnerId:string;
  BrandName:string;
  Telco:string;
  Phone:string;
  Message:string;
}
