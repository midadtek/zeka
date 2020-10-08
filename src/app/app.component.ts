import { Component } from '@angular/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { DbServiceService } from './services/db-service.service';
import {Category_operationsService} from './services/category_operations.service';
import { environment } from 'src/environments/environment';
import { Plugins } from '@capacitor/core';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  constructor(
    private platform: Platform, private splashScreen: SplashScreen,
    private statusBar: StatusBar, private db: DbServiceService,
    private screenOrientation: ScreenOrientation, private  categoryService: Category_operationsService)
    {
      this.categoryService.getGlobalRates();
      this.categoryService.getAllCurrencies();
      this.categoryService.getAllCountries();
      this.categoryService.getSettingObject();
      this.initializeApp();
  }

  initializeApp() {
    if (environment.is_local){
      this.platform.ready().then(() => {
        this.db.dbInit();
      });
    }
  }
}
