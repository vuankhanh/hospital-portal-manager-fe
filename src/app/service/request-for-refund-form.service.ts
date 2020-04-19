import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class RequestForRefundFormService {
  private costForm: FormGroup;

  public insurers = [
    { code: 1, displayName: "Manu Life", name: "Tổng Công ty Cổ phần Bảo hiểm Bưu điện", logo: "./assets/imgs/logo/manulife.png" },
    { code: 2, displayName: "Hanwha Life", name: "Bảo Hiểm Nhân Thọ Manulife", logo: "./assets/imgs/logo/hanwhalife.png" },
    { code: 3, displayName: "FWD", name: "Công ty TNHH Bảo hiểm Nhân thọ FWD Việt Nam", logo: "./assets/imgs/logo/fwd.png" },
    { code: 4, displayName: "Prudential", name: "Prudential", logo: "./assets/imgs/logo/prudential.png" },
    { code: 5, displayName: "Các nhà bảo hiểm khác", name: "Bảo Hiểm Nhân Thọ Manulife", logo: "" },
  ];
  constructor(
    private formBuilder: FormBuilder
  ) {}

  setForm(tickets){
    this.costForm = this.formBuilder.group({
      opd_cost_details: this.formBuilder.group({
        diag_note: [tickets.cost_details.diag_note, Validators.required],
        maximum_claim_value: [tickets.cost_details.maximum_claim_value],
        is_apply_social_insurance: [tickets.cost_details.is_apply_social_insurance, Validators.required],
        social_insurance_id: [tickets.cost_details.social_insurance_id]
      }),
      costs: this.formBuilder.array([])
    })
    
    this.costForm.setControl('costs', this.formBuilder.array([]));
    
    const control = <FormArray>this.costForm.get('costs');

    tickets.costs.forEach(x=>{
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
