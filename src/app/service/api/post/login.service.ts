import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { SystemConfigurationService } from '../get/system-configuration.service';
import { ListTicketService } from '../get/list-ticket.service';
import { DateFormatService } from '../../date-format.service';

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
    private dateFormatService: DateFormatService
  ) { }

  login(account:Account){
    let headers = new HttpHeaders({
      'Content-Type':'application/json'
    });
    return this.httpClient.post<ResponseLogin>(this.urlLogin, account, { headers: headers });
  }

  thenLogin(token, userId){
    
    let getServerConfig = this.systemConfigurationService.getSystemConfiguration(token).toPromise();
    let getDirectBillingTaken = this.listTicketService.getListTicket(token, { status:['TAKEN', 'UPDATED', 'WAITING'], insID: userId }).toPromise();
    let getTicketsOpen = this.listTicketService.getListTicket(token, { status: ['OPEN'] }).toPromise();
    let getTicketsHistory = this.listTicketService.getListTicket(token, { status: ['VERIFIED', 'DENIED', 'CONFIRM', 'REJECT'], from: this.dateFormatService.last2Day(), insID: userId }).toPromise();

    return Promise.all([getServerConfig, getDirectBillingTaken, getTicketsOpen, getTicketsHistory]);
  }

  // filterListTaken(userId, tickets){
  //   if(tickets){
  //     tickets.filter(ticket=>ticket.)
  //   }
  // }
}
