import { Injectable } from '@angular/core';

import * as jwt_decode from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class JwtDecodeService {

  constructor() { }
  
  decodeToken(token){
    return jwt_decode(token);
  }
}
