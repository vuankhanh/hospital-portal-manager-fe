import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TheRequirementService {
  private theRequestments: any = [];
  private listenTheRequestments$ : BehaviorSubject<any> = new BehaviorSubject([]);
  public listenTheRequestments: Observable<any> = this.listenTheRequestments$.asObservable();
  constructor() { }

  setTheRequestments(caseNumber:any){
    this.theRequestments.push(caseNumber);
    this.listenTheRequestments$.next(this.theRequestments);
  }

  removeTheRequestments(caseNumber:any){
    for(let i=0; i< this.theRequestments.length;i++){
      if(caseNumber.id === this.theRequestments[i].id){
        this.theRequestments.splice(i,1);
      }
    }
    console.log(this.theRequestments);
    this.listenTheRequestments$.next(this.theRequestments);
  }
}
