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

  thenLogin(token, userId){
    
    let getServerConfig = this.systemConfigurationService.getSystemConfiguration(token).toPromise();
    let getDirectBillingTaken = this.listTicketService.getListTicket(token, { status: 'TAKEN' }).toPromise();
    let getTicketsOpen = this.listTicketService.getListTicket(token, { status: 'OPEN' }).toPromise();

    return Promise.all([getServerConfig, getDirectBillingTaken, getTicketsOpen]);
  }

  // filterListTaken(userId, tickets){
  //   if(tickets){
  //     tickets.filter(ticket=>ticket.)
  //   }
  // }
}
