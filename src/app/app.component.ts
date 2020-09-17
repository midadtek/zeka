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

  currency: any;
  public currMap = new Map<string, string>()

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private db: DbServiceService,
    private screenOrientation: ScreenOrientation,
    private  cat: Category_operationsService


) {
    this.initializeApp();
    this.cat.getGlobalRates()
  }

  initializeApp() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT).then(_=>{
      console.log(this.screenOrientation.type);
    } );
    
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.db.dbInit();
    });     
  }
  
}
