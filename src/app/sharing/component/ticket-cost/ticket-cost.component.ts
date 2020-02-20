import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, OnChanges } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

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
      this.total = this.countTotal(value.costs);
      this.costFormChange.next(this.costTableForm);
    })
  }

  countTotal(arrayNumber:any){
    let total = 0;
    console.log(this.parseToNumber(arrayNumber));
    this.parseToNumber(arrayNumber).forEach(element=>{
      total += parseInt(element.cost_amount);
    });
    return total;
  }

  onInputCurrency(event, i){
    console.log(event);
    console.log(i);
    let value = event.target.value;

    let array: FormArray = this.costTableForm.controls['costs'] as FormArray;
    let c = array.controls[i] as FormGroup;
    let d = c.controls.cost_amount;
    d.setValue(value.toString().replace(/\D+/g, "").replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    console.log(d);
  }

  parseToNumber(costs: any){
    let arrayCosts=[];
    if(costs){
      for(let cost of costs ){
        let cost_amount = cost.cost_amount.toString().replace(/,/gi, '');
        cost.cost_amount = parseInt(cost_amount);
        arrayCosts.push(cost);
        console.log(cost.cost_amount);
      }
      console.log(arrayCosts);
      return arrayCosts;
    }
  }

  ngOnDestroy(){
    this.costTableForm = this.ticket.formGroup;
    this.formSubscription.unsubscribe();
  }
}
