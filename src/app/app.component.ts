import { Component } from '@angular/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { DbServiceService } from './services/db-service.service';
import {Category_operationsService} from "./services/category_operations.service";





@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private db: DbServiceService,
    private screenOrientation: ScreenOrientation,
    private  categoryService: Category_operationsService


) {

    this.initializeApp();

  }

  initializeApp() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT).then(_=>{
      console.log(this.screenOrientation.type);

    } );
    this.categoryService.getGlobalRates();
    this.categoryService.getAllCurrencies();
    this.categoryService.getAllCountries();
    this.categoryService.getAllCategory();

    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      if(this.platform.is("cordova") || this.platform.is("capacitor")) {
      this.db.dbInit();
      }
    });
  }

}
