import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TraTuService {
  public illCauses = [
    { code: 1, name:'Thai sản' },
    { code: 2, name:'Tai nạn' },
    { code: 3, name:'Kính mắt' },
    { code: 4, name:'Vật Lý Trị Liệu' },
    { code: 5, name:'Bệnh' },
    { code: 6, name:'Nha Khoa' }
  ];

  public typeInsurers = [
    { code: 1, name: 'Nhân Thọ' },
    { code: 2, name: 'Phi Nhân Thọ' }
  ]
  
}

export interface Insurers{

}

export interface Insurers{
  ID: number,
  short_name: string,
  name: string,
  logo: string,
  type: number,
  created_at: string,
  updated_at: string,
  deleted_at: string
}