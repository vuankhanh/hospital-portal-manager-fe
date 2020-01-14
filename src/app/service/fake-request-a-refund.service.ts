import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FakeRequestARefundService {
  refundRequests: any=[
    {
      id: 23,
      request_type: 2,
      ill_cause: 1,
      isurance_id: 2,
      cmnd:'023u32ewer',
      fullname: 'TuấnTM',
      dob: '09-09-1987',
      contract_no: 'PolicyNo1',
      refundRequest:[
        { name: 'Tiền Giường Phòng', value: '250000', note:' Không note gì  Không note gì  Không note gì  Không note gì  Không note gì  Không note gì  Không note gì  Không note gì  Không note gì  Không note gì  Không note gì  Không note gì  Không note gì  Không note gì  Không note gì  Không note gì  Không note gì  Không note gì ' },
        { name: 'Tiền Thuốc', value: '300000', note:'' },
        { name: 'Tiền Xét Nghiệm', value: '50000', note:'' },
        { name: 'Tiền Chi Phí Khác', value: '1000000', note:'' }
      ]
    }
  ];
  constructor() { }

}
