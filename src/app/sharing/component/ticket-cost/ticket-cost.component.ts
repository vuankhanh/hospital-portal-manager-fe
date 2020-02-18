import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { RequestForRefundFormService } from '../../../service/request-for-refund-form.service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ticket-cost',
  templateUrl: './ticket-cost.component.html',
  styleUrls: ['./ticket-cost.component.scss']
})
export class TicketCostComponent implements OnInit, OnDestroy {
  @Input() ticket: any;
  @Output() costFormChange = new EventEmitter<FormGroup>();

  displayedColumnsFix: string[] = ['money', 'note'];

  costTableForm: FormGroup;

  formSubscription: Subscription;
  total: number;
  overBenefit:boolean=false;
  constructor(
    private requestForRefundFormService: RequestForRefundFormService
  ) {
    
  }

  ngOnInit() {
    this.total = this.countTotal(this.ticket.costs);
    this.costTableForm = this.requestForRefundFormService.setForm(this.ticket);
    console.log(this.costTableForm);

    this.costFormChange.next(this.costTableForm);

    this.formSubscription = this.costTableForm.valueChanges.subscribe(value=>{
      console.log(value);
      this.total = this.countTotal(value.costs);
      this.costFormChange.next(this.costTableForm);
    })
  }

  countTotal(arrayNumber:any){
    let total = 0;
    arrayNumber.forEach(element=>{
      total += parseInt(element.cost_amount);
    });
    return total;
  }

  ngOnDestroy(){
    this.costTableForm = this.ticket.formGroup;
    this.formSubscription.unsubscribe();
  }
}
