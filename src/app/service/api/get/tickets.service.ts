import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  private url: string = environment.managerHost + 'get_ticket_opd';
  constructor(
    private httpClient: HttpClient
  ) { }

  getTickets(token, parameters){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer "+token,
    });

    let params = new HttpParams();

    if(parameters){
      if(parameters.idTicket){
        params = params.append('id', parameters.idTicket);
      }
      if(parameters.fullname){
        params = params.append('full_name', parameters.fullname);
      }
      if(parameters.patient_phone_numb){
        params = params.append('patient_phone_numb', parameters.patient_phone_numb);
      }
      if(parameters.cmnd){
        params = params.append('cmnd', parameters.cmnd);
      }
      if(parameters.dob){
        params = params.append('dob', parameters.dob);
      }
      if(parameters.policy_no){
        params = params.append('policy_no', parameters.policy_no);
      }
      if(parameters.note){
        params = params.append('note', parameters.note);
      }

      console.log(parameters);
    }
    return this.httpClient.get<Response>(this.url, { headers: headers, params: params })
  }
}
export interface Response{
  code: number;
  message: string;
  data: TicketList;
}
export interface Tickets extends Array<Ticket>{};
export interface Ticket {
  ID: number;
  hospital_user_id: number;
  hospital_employee_name: string;
  hospital_phone_number: string;
  patient_phone_numb: string;
  insmart_user_id: number;
  ill_cause: number;
  isurance_id: number;
  card_no: string;
  cmnd: string;
  fullname: string;
  dob: string;
  policy_no: string;
  diag_note: string;
  maximum_claim_value: number;
  is_apply_social_insurance: number;
  social_insurance_id: string;
  files: string;
  costs: string;
  note: string;
  insmart_status: string;
  hospital_status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  hospital_updated_at: string;
  detailTicket: Comments;
  insmartCosts: any;
  hospitalCosts: any;
  reasonReject: string;
  lastAddition: string;
  insmartUpdatedCostAt: string;
  insmartRejectAt: string;
  hospitalUpdatedCostAt: string;
}

export interface TicketList extends Array<TicketView>{};
export interface TicketView {
  ID: number;
  fullname: string;
  hospital_name: string;
  insmart_status: string;
  insurer_short_name: string;
  ill_cause: string;
  created_at: string;
  updated_at: string;
}

export interface Comments extends Array<Comment>{};
interface Comment{
  ID: number;
  content: any;
  created_at: string;
  hospital_user_id: number;
  insmart_user_id: number;
  ticket_id: number;
  type: string;
}