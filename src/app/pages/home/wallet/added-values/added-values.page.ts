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
    public newBase: any;
    public goldPrice: number;
    public silverPrice: number;
    public translatedCurrencyName: string;
  

 
 constructor(private platform: Platform, private alertController: AlertController, private db: DbServiceService,private router:Router,  private route: ActivatedRoute, private category: Category_operationsService) {
     this.id = parseInt(this.route.snapshot.params['id']);
     this.allCategorySub = this.category.getAllCategory().subscribe(result => {
         this.catEl = result[this.id - 1];
     })
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
     console.log(this.platform)
      this.getItem().then(_=>{
          if(this.newBase) {
              switch (this.newBase) {
                  case 'TRY' :
                      this.translatedCurrencyName = "ليرة تركية";
                      break;
                  case 'USD' :
                      this.translatedCurrencyName = "دولار";
                      break;
                  case "EUR" :
                      this.translatedCurrencyName = "يورو";
                      break;
                  case "KWD" :
                      this.translatedCurrencyName = "دينار كويتي";
                      break;
                  default:
                      return;
              }
          }

          if(this.platform.is("cordova") || this.platform.is("capacitor")){
  this.db.getoperations().subscribe(data => {
  for(let i = 0; i < data.length; i++) {
    if(data[i].category_id == this.id){
      this.cat_ops.push(data[i])
    }
  }
})
          }else{
              this.category.getAllOperations().subscribe(data=> {
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
          return this.category.deleteOperationById(id).subscribe(_=>{
              this.cat_ops = this.cat_ops.filter(ops => ops.id !== id);
              if(this.cat_ops.length == 0) {
                  this.router.navigateByUrl('/home/wallet');
              }
          });
      }
  }

    async getItem() {
        const ret = await Storage.get({key: 'GLOBAL-RATES'});
        this.allRates = JSON.parse(ret.value);
        this.newBase =  this.category.currencyCode
        this.goldPrice = +this.allRates.rates.gold * +this.allRates.rates.rates[this.newBase]
        this.silverPrice = this.allRates.rates.silver * this.allRates.rates.rates[this.newBase]
    }
  ionViewDidEnter() {
    this.allCategorySub.unsubscribe();
  }
}
