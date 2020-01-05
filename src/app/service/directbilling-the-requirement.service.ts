import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DirectbillingTheRequirementService {

  private theDbRequestments: any = [];
  private listenDbTheRequestments$ : BehaviorSubject<any> = new BehaviorSubject([]);
  public listenDbTheRequestments: Observable<any> = this.listenDbTheRequestments$.asObservable();
  constructor() { }

  setTheRequestments(caseNumber:any){
    this.theDbRequestments.push(caseNumber);
    console.log(this.theDbRequestments);
    this.listenDbTheRequestments$.next(this.theDbRequestments);
  }

  removeTheRequestments(caseNumber:any){
    for(let i=0; i< this.theDbRequestments.length;i++){
      if(caseNumber.id === this.theDbRequestments[i].id){
        this.theDbRequestments.splice(i,1);
      }
    }
    console.log(this.theDbRequestments);
    this.listenDbTheRequestments$.next(this.theDbRequestments);
  }

  getBadgeTheRequestments(){
    return this.listenDbTheRequestments.pipe<number>(map(requestments=>requestments.length));
  }
}
