import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { SystemConfigurationService } from '../get/system-configuration.service';
import { ListTicketService } from '../get/list-ticket.service';
import { ListTicketsService } from '../../list-tickets.service';

interface ResponseLogin{
  code: number;
  data: ResponseDataLogin,
  message: string;
  token: string;
}

interface ResponseDataLogin{
  id: number;
  name: string;
  email: string;
  status: 0;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}

interface Account{
  user_name: string;
  password: string;
}
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  urlLogin: string = environment.apiHost + 'auth/user';
  constructor(
    private httpClient: HttpClient,
    private systemConfigurationService: SystemConfigurationService,
    private listTicketService: ListTicketService,
    private listTicketsService: ListTicketsService
  ) { }

  login(account:Account){
    let headers = new HttpHeaders({
      'Content-Type':'application/json',
      'X-Requested-With':'XMLHttpRequest'
    });
    return this.httpClient.post<ResponseLogin>(this.urlLogin, account, { headers: headers });
  }

  thenLogin(token){
    
    let getServerConfig = this.systemConfigurationService.getSystemConfiguration(token).toPromise();
    let getListTicket = this.listTicketService.getListTicket(token, { pageSize: 5000 }).toPromise();

    Promise.all([getServerConfig, getListTicket]).then(data=>{
      console.log(data);
      let datas: any = data;
      if(datas[1].code === 200 && datas[1].message==='OK'){
        this.listTicketsService.getAll(datas[1].data);
      }
    }).catch(err=>console.log(err));
  }
}
