import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CreateInsurerService {
  private url: string = environment.managerHost + 'create_insurer';
  constructor(
    private httpClient: HttpClient
  ) { }

  createInsurer(token, body){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer "+token
    });

    return this.httpClient.post<Response>(this.url, body, { headers: headers });
  }
}
interface Response{
  code: number;
  data: any,
  message: string;
}

export interface Insurer{
  ID: number;
  short_name: string;
  name: string;
  logo: string;
  check_benefit_countdown: string;
  gl_countdown: string;
  type: number;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}