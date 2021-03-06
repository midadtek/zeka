import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Category_operationsService} from "../../../../services/category_operations.service";
import {Subscription} from "rxjs";
import { DbServiceService, operation } from 'src/app/services/db-service.service';
import { Plugins } from '@capacitor/core';
import {AlertController} from "@ionic/angular";
import { Platform } from '@ionic/angular';

const { Storage } = Plugins;


@Component({
  selector: 'app-added-values',
  templateUrl: './added-values.page.html',
  styleUrls: ['./added-values.page.scss'],
})
export class AddedValuesPage implements OnInit {
 id: number;
 catEl: any;
 cat_ops:operation[] = [];

 allCategorySub: Subscription;
CategoryOperationSub: Subscription;
    public allRates: any;
    public currentBase: any;
    public goldPrice: number;
    public silverPrice: number;
    public translatedCurrencyName: string;
    private currencyIndex: number;
  

 
 constructor(private platform: Platform, private alertController: AlertController, private db: DbServiceService,private router:Router,  private route: ActivatedRoute, private categoryService: Category_operationsService) {
     this.id = parseInt(this.route.snapshot.params['id']);
         this.catEl = this.categoryService.categoryList[this.id - 1];
 }
     async presentAlertConfirm(id: number) {
         const alert = await this.alertController.create({
             cssClass: 'my-custom-class',
             header: 'حذف العمليات',
             message: 'هل انت متأكد؟',
             mode:'ios',
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
      this.getGlobalRatesObject().then(_=>{
          this.currencyIndex = this.categoryService.curreciesList.findIndex(I => I.code == this.currentBase);
          console.log(this.currencyIndex);
          this.translatedCurrencyName = this.categoryService.curreciesList[this.currencyIndex].name;
          console.log(this.translatedCurrencyName);

          if(this.platform.is("cordova") || this.platform.is("capacitor")){
  this.db.getoperations().subscribe(data => {
  for(let i = 0; i < data.length; i++) {
    if(data[i].category_id == this.id){
      this.cat_ops.push(data[i])
    }
  }
})
          }else{
              this.categoryService.getAllOperations().subscribe(data=> {
                  for(let i = 0; i < data.length; i++) {
                      if(data[i].category_id == this.id){
                          this.cat_ops.push(data[i])
                      }
                  }
              })
          }
      })
  }


  onDeleteOpsById(id: number) {
      if(this.platform.is("cordova") || this.platform.is("capacitor")) {
      return this.db.deleteOperationById(id).then(()=>{
      this.cat_ops = this.cat_ops.filter(ops => ops.id !== id)
      this.db.loadAllOperations().then(_=>{
       this.router.navigateByUrl('/home/wallet');
      });
    });
      }else{
          return this.categoryService.deleteOperationById(id).subscribe(_=>{
              this.cat_ops = this.cat_ops.filter(ops => ops.id !== id);
              if(this.cat_ops.length == 0) {
                  this.router.navigateByUrl('/home/wallet');
              }
          });
      }
  }

    async getGlobalRatesObject() {
        const ret = await Storage.get({key: 'GLOBAL-RATES'});
        this.allRates = JSON.parse(ret.value);
        this.currentBase =  this.categoryService.currencyCode
        this.goldPrice = +this.allRates.rates.gold * +this.allRates.rates.rates[this.currentBase]
        this.silverPrice = this.allRates.rates.silver * this.allRates.rates.rates[this.currentBase]
    }

    getMoneyCurrencyName (currency: string) {
        let name = this.categoryService.curreciesList.filter(I => I.code == currency)
        return name[0].name;
    }
}
