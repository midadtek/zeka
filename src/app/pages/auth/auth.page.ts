import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
isSignUpMode: boolean = false;
  constructor(private auth: AuthService) { }

  ngOnInit() {
  }
  authenticateUser(form: NgForm){
  this.auth.authenticate(this.isSignUpMode, form.value)
    console.log(form);
    form.resetForm();

}


  switchMode() {
    this.isSignUpMode = !this.isSignUpMode;
  }



}
