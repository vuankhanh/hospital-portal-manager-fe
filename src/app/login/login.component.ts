import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { WebsocketService } from '../service/websocket.service';
import { LoginService } from '../service/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private webSocketService: WebsocketService,
    private loginService: LoginService
  ) {

  }

  ngOnInit() {
    this.createForm();
  }

  createForm(){
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  doLogin(){
    // this.loginService.login().subscribe(response=>console.log(response));
    this.router.navigateByUrl('/dashboard').then(_=>this.webSocketService.listenWebSocket());
  }
}
