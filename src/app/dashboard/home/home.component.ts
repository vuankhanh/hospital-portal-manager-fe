import { Component, OnInit } from '@angular/core';
import { LocationService, Position } from '../../service/location.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  ticketCounts = [
    { name:'Ticket hôm nay', value:'142', icon:'validating-ticket', background: '#4dc1f1' },
    { name:'Nhân sự tích cực', value:'Đặng Thuỳ Lâm', icon:'best', background: '#4ba75a' },
    { name:'Top kiểm tra quyền lợi', value:'Vinmec ở chỗ nào đó mà đến tận bây giờ cũng chưa nắm được đây này', icon:'star', background: '#f39c3e' },
    { name:'Top Yêu cầu Bảo Lãnh', value:'Vinmec ở chỗ nào đó mà đến tận bây giờ cũng chưa nắm được đây này', icon:'money', background: '#dd4c39' }
  ];

  constructor(
    private locationService: LocationService
  ) { }

  ngOnInit() {
    
  }

}