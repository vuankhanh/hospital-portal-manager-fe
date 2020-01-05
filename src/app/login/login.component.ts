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
      user_name: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  doLogin(){
    console.log(this.loginForm.valid);
    console.log(this.loginForm.value);
    
    
    if(this.loginForm.valid){
      this.loginService.login(this.loginForm.value).subscribe(response=>{
        console.log(response);
      });
    }
    this.router.navigateByUrl('/dashboard').then(_=>this.webSocketService.listenWebSocket());
  }
}
