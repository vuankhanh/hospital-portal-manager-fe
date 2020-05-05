import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, OnChanges } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

import { RequestForRefundFormService } from '../../../service/request-for-refund-form.service';
import { ToastService } from '../../../service/toast.service';

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
  hospitalTotal: number;
  overBenefit:boolean=false;
  constructor(
    private requestForRefundFormService: RequestForRefundFormService,
    private toastService: ToastService
  ) {
    
  }

  ngOnInit() {
    this.total = this.countTotal(this.ticket.costs);
    this.hospitalTotal = this.countTotal(this.ticket.costs);
    this.costTableForm = this.requestForRefundFormService.setForm(this.ticket);
    
    let formArray: FormArray = this.costTableForm.controls['costs'] as FormArray;
    for(let i = 0; i< formArray.controls.length; i++){
      let value = formArray.controls[i];
      let c = value as FormGroup;
      let d = c.controls.cost_amount;
      this.setFormat(formArray.controls, d.value, i  );
    }

    this.costFormChange.next(this.costTableForm);

    this.formSubscription = this.costTableForm.valueChanges.subscribe(value=>{
      this.total = this.countTotal(value.costs);
      this.costFormChange.next(this.costTableForm);
    })
  }

  countTotal(arrayNumber:any){
    let total = 0;
    this.parseToNumber(arrayNumber).forEach(element=>{
      total += parseInt(element.cost_amount);
    });
    return total;
  }

  onInputCurrency(event, i){
    let value = event.target.value;
    if(!value){
      value = 0
    }
    if(value.length >=2){
      if(value.charAt(0)===0 || value.charAt(0)==='0'){
        value = value.substring(1);
      }
    }

    let formArray: FormArray = this.costTableForm.controls['costs'] as FormArray;
    if(this.total > this.hospitalTotal){
      this.toastService.showShortToast('Đã vượt quá chi phí yêu cầu của Bệnh Viện', 'Cảnh báo');
    }
    
    this.setFormat(formArray.controls, value, i);
  }

  onMaximumChange(event){
    let value = event.target.value;
    value = parseInt(value.toString().replace(/,/gi, ''));

    if(value>= this.total){
      alert('Giới hạn Quyền Lợi còn lại không được lớn hơn tổng số tiền hiện tại');
      value = this.total-1;
    }
    let formArray: FormGroup = this.costTableForm.controls['opd_cost_details'] as FormGroup;
    let control = formArray.controls.maximum_claim_value;
    control.setValue(value.toString().replace(/\D+/g, "").replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ","));
  }

  setFormat(formArray ,value, i){
    let c = formArray[i] as FormGroup;
    let d = c.controls.cost_amount;
    d.setValue(value.toString().replace(/\D+/g, "").replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ","));
  }

  parseToNumber(costs: any){
    let arrayCosts=[];
    if(costs){
      for(let cost of costs ){
        let cost_amount = cost.cost_amount.toString().replace(/,/gi, '');
        cost.cost_amount = parseInt(cost_amount);
        arrayCosts.push(cost);
      }
      return arrayCosts;
    }
  }

  ngOnDestroy(){
    this.costTableForm = this.ticket.formGroup;
    this.formSubscription.unsubscribe();
  }
}
