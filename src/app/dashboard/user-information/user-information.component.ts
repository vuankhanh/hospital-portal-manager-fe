import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../service/local-storage.service';

@Component({
  selector: 'app-user-information',
  templateUrl: './user-information.component.html',
  styleUrls: ['./user-information.component.scss']
})
export class UserInformationComponent implements OnInit {

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit() {}

  logout(){
    this.localStorageService.removeLocalStorage('token');
    this.router.navigate(['/login']);
  }

}
