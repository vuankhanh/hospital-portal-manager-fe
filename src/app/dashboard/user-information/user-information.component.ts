import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LocalStorageService } from '../../service/local-storage.service';
import { JwtDecodeService } from '../../service/jwt-decode.service';

@Component({
  selector: 'app-user-information',
  templateUrl: './user-information.component.html',
  styleUrls: ['./user-information.component.scss']
})
export class UserInformationComponent implements OnInit {
  userInformation: any;
  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    private jwtDecodeService: JwtDecodeService
  ) { }

  ngOnInit() {
    let userData = this.localStorageService.getLocalStorage("token");
    this.userInformation = this.jwtDecodeService.decodeToken(userData.token);
  }

  logout(){
    this.localStorageService.removeLocalStorage('token');
    this.router.navigate(['/login']);
  }

}
