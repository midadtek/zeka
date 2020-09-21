import { Injectable } from '@angular/core';
import {CanLoad, Route, Router, UrlSegment} from '@angular/router';
import {Observable} from 'rxjs';
import { AuthService } from './auth.service';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class InitialGuard implements CanLoad {
    constructor(private auth: AuthService, private router: Router) {
    }

    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
       return Storage.get({key: 'setting'}).then(value => {
           console.log(!!value.value)
            if(!!value.value == false){
                this.router.navigateByUrl('/setting')
                return !!value.value;
            }
            else {
                return true
            }
        })
    }
}