import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class RequestForRefundFormService {
  private costForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) {}

  setForm(tickets){
    console.log(tickets);
    this.costForm = this.formBuilder.group({
      opd_cost_details: this.formBuilder.group({
        diag_note: [tickets.diag_note, Validators.required],
        maximum_claim_value: [tickets.maximum_claim_value],
        is_apply_social_insurance: [tickets.is_apply_social_insurance, Validators.required],
        social_insurance_id: [tickets.social_insurance_id]
      }),
      costs: this.formBuilder.array([])
    })
    
    this.costForm.setControl('costs', this.formBuilder.array([]));
    
    const control = <FormArray>this.costForm.get('costs');

    tickets.costs.forEach(x=>{
      x.cost_amount = x.cost_amount.toString().replace(/\D+/g, "").replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      control.push(this.createCostGroup(x.cost_name, x.cost_amount, x.cost_note));
    })

    return this.costForm;
  }

  createCostGroup(cost_name, cost_amount, cost_note) {
    return this.formBuilder.group({
      cost_name: [cost_name, Validators.required],
      cost_amount: [cost_amount],
      cost_note: [''],
    });
  }

}
