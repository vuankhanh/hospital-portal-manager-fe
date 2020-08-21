import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  private url: string = environment.managerHost + 'export_opd_data/';
  constructor(
    private httpClient: HttpClient
  ) { }

  getInsmart(token, parameters){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer "+token,
    });

    let params = new HttpParams();

    if(parameters){
      if(parameters.from){
        params = params.append('from', parameters.from);
      }
      if(parameters.to){
        params = params.append('to', parameters.to);
      }
      if(parameters.insurer_id){
        params = params.append('insurer_id', parameters.insurer_id);
      }
      if(parameters.isToday){
        params = params.append('isToday', parameters.isToday);
      }
    }
    return this.httpClient.get<Response>(this.url, { headers: headers, params: params })
  }
}
export interface Response{
  code: number;
  message: string;
  data: Tickets;
}
export interface Tickets extends Array<Ticket>{};
interface Ticket {
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