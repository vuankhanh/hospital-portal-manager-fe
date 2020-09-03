import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UpdateHospitalService {
  private url: string = environment.managerHost + 'create_hospital';
  constructor(
    private httpClient: HttpClient
  ) { }
}