import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DirectBillingService {
  storageProccessRequirement:any=[];
  listentRequirement$: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>(this.storageProccessRequirement);

  storageProccessRequestForRefund:any=[];
  listentProccessRequestForRefund$: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>(this.storageProccessRequestForRefund);
  constructor() {

  }

  setProccessRequest(requirement:any){
    this.storageProccessRequirement.push(requirement);
    this.listentRequirement$.next(this.storageProccessRequirement);
  }

  setProccessRequestForRefund(requestForRefund:any){
    this.storageProccessRequestForRefund.push(requestForRefund);
    this.listentProccessRequestForRefund$.next(this.storageProccessRequestForRefund);
  }
}
