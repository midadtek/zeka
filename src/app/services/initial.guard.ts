import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;
@Injectable({
    providedIn: 'root'
})
export class InitialGuard implements CanLoad {
    constructor(private auth: AuthService, private router: Router) {
    }
    canLoad(): Observable<boolean> | Promise<boolean> | boolean {
        return Storage.get({ key: 'setting' }).then(data => {
            if (!!data.value === false) {
                this.router.navigateByUrl('/first-run');
                return !!data.value;
            }
            else {
                return true;
            }
        });
    }
}
