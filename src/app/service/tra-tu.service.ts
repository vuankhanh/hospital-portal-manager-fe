import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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

  insurers: Array<Insurers>;

  listenInsurer$: BehaviorSubject<Array<Insurers>> = new BehaviorSubject<Array<Insurers>>([]);
  listenInsurer: Observable<Array<Insurers>> = this.listenInsurer$.asObservable();

  // public insurers = [
  //   { code: 1, displayName: "Manu Life", name: "Tổng Công ty Cổ phần Bảo hiểm Bưu điện", logo: "./assets/imgs/logo/manulife.png" },
  //   { code: 2, displayName: "Hanwha Life", name: "Bảo Hiểm Nhân Thọ Manulife", logo: "./assets/imgs/logo/hanwhalife.png" },
  //   { code: 3, displayName: "FWD", name: "Công ty TNHH Bảo hiểm Nhân thọ FWD Việt Nam", logo: "./assets/imgs/logo/fwd.png" },
  //   { code: 4, displayName: "Prudential", name: "Prudential", logo: "./assets/imgs/logo/prudential.png" },
  //   { code: 5, displayName: "Các nhà bảo hiểm khác", name: "Bảo Hiểm Nhân Thọ Manulife", logo: "" },
  // ];
  setInsurers(insurers: Array<Insurers>){
    this.insurers = insurers;

    this.listenInsurer$.next(this.insurers);
  }
  
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