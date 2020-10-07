import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
import {from, of} from "rxjs";
const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

  authenticate(mode: boolean, userData: any) {
    if (mode) {
      this.http.post<any>( '192.168.1.45:8000/api/v1/user/register', userData).subscribe(result => {
        if (result.status == 'user created successfully') {
          
          this.router.navigateByUrl('home');
        }
      });
    }
    else {
      this.http.post<any>( '192.168.1.45:8000/api/v1/user/login', userData).subscribe(result => {
        if (result.status == 'logged in successfully') {
          
          this.router.navigateByUrl('home');
        }
      });
    }
  }

}