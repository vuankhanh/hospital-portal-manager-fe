import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-out-working-time',
  templateUrl: './out-working-time.component.html',
  styleUrls: ['./out-working-time.component.scss']
})
export class OutWorkingTimeComponent implements OnInit {
  newRecord = {
    number:'',
    staff: ''
  }
  staffNumbers:any = [
    { number: '0842415921', staff: 'Vũ An Khánh' }
  ];
  showFooterRow:boolean = false;

  listenStaffNumbers$ :BehaviorSubject<any> = new BehaviorSubject<any>(this.staffNumbers);

  displayedColumns: string[] = ['number', 'staff', 'action'];
  constructor() { }

  ngOnInit() {
  }

  delete(element){
    console.log(element);
  }

  edit(element){
    console.log(element);
  }

  addStaffPhoneNumber(){
    this.showFooterRow = true;
  }

  insert(){
    if(this.showFooterRow && this.newRecord.number && this.newRecord.staff){
      this.staffNumbers.push(this.newRecord);
      this.listenStaffNumbers$.next(this.staffNumbers);
      this.newRecord = {
        number:'',
        staff: ''
      };
      this.showFooterRow=false;
    }
  }

  dispose(){
    this.newRecord = {
      number:'',
      staff: ''
    };
    this.showFooterRow=false;
  }

}
