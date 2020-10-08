import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Category_operationsService} from '../../../../services/category_operations.service';
import {Subscription} from 'rxjs';
import { DbServiceService} from 'src/app/services/db-service.service';
import { Plugins } from '@capacitor/core';
import {AlertController} from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { Operation } from 'src/app/services/interfaces';
const { Storage } = Plugins;
@Component({
  selector: 'app-added-values',
  templateUrl: './added-values.page.html',
  styleUrls: ['./added-values.page.scss'],
})
export class AddedValuesPage implements OnInit {
 id: number;
 catEl: any;
 // tslint:disable: variable-name
 cat_ops: Operation[] = [];
 allCategorySub: Subscription;
CategoryOperationSub: Subscription;
    public allRates: any;
    public currentBase: any;
    public goldPrice: number;
    public silverPrice: number;
    public translatedCurrencyName: string;
    private currencyIndex: number;
 constructor(private platform: Platform, private alertController: AlertController,
             private db: DbServiceService, private router: Router,  private route: ActivatedRoute,
             private categoryService: Category_operationsService) {
     this.id = Number(this.route.snapshot.params.id);
     this.allCategorySub = this.categoryService.getAllCategory().subscribe(result => {
         this.catEl = result[this.id - 1];
     });
 }
     async presentAlertConfirm(id: number) {
         const alert = await this.alertController.create({
             cssClass: 'my-custom-class',
             header: 'حذف العمليات',
             message: 'هل انت متأكد؟',
             mode: 'ios',
             buttons: [
                 {
                     text: 'إلغاء',
                     role: 'cancel',
                     cssClass: 'secondary',
                     handler: () => {
                     }
                 }, {
                     text: 'موافق',
                     handler: () => {
                         this.onDeleteOpsById(id);
                     }
                 }
             ]
         });
         await alert.present();
     }
  ngOnInit() {
      this.getGlobalRatesObject().then(_ => {
          this.currencyIndex = this.categoryService.curreciesList.findIndex(I => I.code == this.currentBase);
          console.log(this.currencyIndex)
          console.log(this.categoryService.curreciesList)
          this.translatedCurrencyName = this.categoryService.curreciesList[this.currencyIndex].name;
          if (environment.is_local){
  this.db.getoperations().subscribe(data => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].category_id === this.id){
      this.cat_ops.push(data[i]);
    }
  }
});
          }else{
              this.categoryService.getAllOperations().subscribe(data => {
                  for (let i = 0; i < data.length; i++) {
                      if (data[i].category_id === this.id){
                          this.cat_ops.push(data[i]);
                      }
                  }
              });
          }
      });
  }
  onDeleteOpsById(id: number) {
      if (this.platform.is('cordova') || this.platform.is('capacitor')) {
      return this.db.deleteOperationById(id).then(() => {
      this.cat_ops = this.cat_ops.filter(ops => ops.id !== id);
      this.db.loadAllOperations().then(_ => {
       this.router.navigateByUrl('/home/wallet');
      });
    });
      }else{
          return this.categoryService.deleteOperationById(id).subscribe(_ => {
              this.cat_ops = this.cat_ops.filter(ops => ops.id !== id);
              if (this.cat_ops.length === 0) {
                  this.router.navigateByUrl('/home/wallet');
              }
          });
      }
  }
    async getGlobalRatesObject() {
        const ret = await Storage.get({key: 'GLOBAL-RATES'});
        this.allRates = JSON.parse(ret.value);
        this.currentBase = await this.categoryService.currencyCode;
        this.goldPrice = +this.allRates.rates.gold * +this.allRates.rates.rates[this.currentBase];
        this.silverPrice = this.allRates.rates.silver * this.allRates.rates.rates[this.currentBase];
    }
  ionViewDidEnter() {
    this.allCategorySub.unsubscribe();
  }
    getMoneyCurrencyName(currency: string) {
        const name = this.categoryService.curreciesList.filter(I => I.code === currency);
        return name[0].name;
    }
}
