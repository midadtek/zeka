import {Component, OnInit, OnDestroy} from '@angular/core';
import {Category_operationsService} from '../../services/category_operations.service';
import {AlertController, LoadingController, ModalController} from '@ionic/angular';
import { Subscription} from 'rxjs';
import {DbServiceService, operation} from 'src/app/services/db-service.service';
import { Plugins } from '@capacitor/core';
import {delay} from "rxjs/operators";
import { Platform } from '@ionic/angular';

import {CharityComponent} from "../../component/charity/charity.component";
const { Storage } = Plugins;


@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {
getOperationSubs:Subscription;

  goldOperations :any[] = [];
  gold_total: number = 0;


  moneyOperations :any[] = [];
  totalTransformedMoney: number = 0;



  tradeOperations :any[] = [];
  tradeOperations_total: number = 0;


  silverOperations :any[] = [];
  silverOperations_total: number = 0;


  stocksOperations :any[] = [];
  stocksOperations_total: number = 0;

  Mutual_fundsOperations :any[] = [];
  Mutual_fundsOperations_total: number = 0;

  fitirOperations :any[] = [];
  fitirOperations_total: number = 0;

  loading: Promise<HTMLIonLoadingElement>;
    isEmpty: boolean;
    public goldPrice: number;
    public silverPrice: number;
    public defaultCountry: any;
    public defaultDate: any;
    public newBase: string;
    public allRates: any;
    private translatedCurrencyName: string;
    private lasOps: operation[];
  constructor(private platform: Platform,private db: DbServiceService, private category: Category_operationsService, public alertController: AlertController, private loadingCtrl: LoadingController, private modalCtrl: ModalController) {}

  async presentAlertConfirm(id) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'حذف العمليات',
      message: 'سيتم حذف جميع عمليات الزكاة من هذا النوع',
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

                  this.deleteWholeCategoryOperations(id);

          }
        }
      ]
    });

    await alert.present();
  }



 async ngOnInit() {
     this.category.getObject().then(_ => {
         this.newBase = this.category.currencyCode
         if (this.newBase) {
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
     })

     await this.getItem()
 }
ionViewWillEnter() {
     this.goldPrice = this.allRates.rates.gold * this.allRates.rates.rates[this.newBase]
      this.silverPrice = this.allRates.rates.silver * this.allRates.rates.rates[this.newBase]
      if(this.platform.is("cordova") || this.platform.is("capacitor")){
    this.getOperationSubs = this.db.getoperations().pipe(delay(500)).subscribe(async data => {
        this.lasOps = data;
        this.isEmpty = data.length === 0;
        })
      }else{
          this.getOperationSubs = this.category.getAllOperations().subscribe(async data => {
              this.lasOps = data;
              this.isEmpty = data.length === 0;
          })
      }
       this.goldOperations = [];
       this.gold_total = 0

       this.moneyOperations = [];
       this.totalTransformedMoney = 0;

       this.tradeOperations = [];
       this.tradeOperations_total = 0;
       
       this.silverOperations = [];
       this.silverOperations_total = 0;

       this.stocksOperations = [];
       this.stocksOperations_total = 0

       this.Mutual_fundsOperations = [];
       this.Mutual_fundsOperations_total = 0;

       this.fitirOperations = [];
       this.fitirOperations_total = 0;


  }

  ionViewDidEnter() {
      console.log(this.lasOps)
      if(!this.lasOps){
          return
      }
      else if (this.lasOps){
          for (let i = 0; i < this.lasOps.length; i++) {
              if(this.lasOps[i].category_id == 1) {
                  this.goldOperations.push(this.lasOps[i])
              }
              else if (this.lasOps[i].category_id == 2) {
                  this.moneyOperations.push(this.lasOps[i])
              }
              else if(this.lasOps[i].category_id == 3) {
                  this.tradeOperations.push(this.lasOps[i])
              }
              else if(this.lasOps[i].category_id == 4) {
                  this.silverOperations.push(this.lasOps[i])
              }
              else if(this.lasOps[i].category_id == 5) {
                  this.stocksOperations.push(this.lasOps[i])
              }
              else if(this.lasOps[i].category_id == 6){
                  this.Mutual_fundsOperations.push(this.lasOps[i])
              }
              else if(this.lasOps[i].category_id == 7) {
                  this.fitirOperations.push(this.lasOps[i])
              }
          }
          for(let i = 0; i < this.goldOperations.length; i ++) {
              this.gold_total += +this.goldOperations[i].d_val_1 + (+this.goldOperations[i].d_val_2 * 0.875) + (+this.goldOperations[i].d_val_3 * 0.75);
          }
          for(let i = 0; i < this.moneyOperations.length; i++) {
              if(this.moneyOperations[i].currency_type !== this.newBase){
                  this.totalTransformedMoney += this.moneyOperations[i].d_val_1 * (1/this.allRates.rates.rates[this.moneyOperations[i].currency_type]) * this.allRates.rates.rates[this.newBase];
              }
              else if(this.moneyOperations[i].currency_type == this.newBase) {
                  this.totalTransformedMoney += this.moneyOperations[i].d_val_1;
              }
          }
          for(let i = 0; i < this.tradeOperations.length; i ++) {
              this.tradeOperations_total += this.tradeOperations[i].d_val_1;
          }

          for(let i = 0; i < this.silverOperations.length; i ++) {
              this.silverOperations_total += this.silverOperations[i].d_val_1;
          }
          for(let i = 0; i < this.stocksOperations.length; i ++) {
              this.stocksOperations_total += this.stocksOperations[i].d_val_1 * this.stocksOperations[i].d_val_2
          }
          for(let i = 0; i < this.Mutual_fundsOperations.length; i ++) {
              this.Mutual_fundsOperations_total += this.Mutual_fundsOperations[i].d_val_1 * this.Mutual_fundsOperations[i].d_val_2;
          }
      }


      }


    async onOpenCharityModal() {
        const charityModal = await this.modalCtrl.create({
            component: CharityComponent,
            cssClass: 'my-custom-class',
            componentProps:{
                'willPayValue':(this.gold_total * this.goldPrice * 0.025) + (this.totalTransformedMoney * 0.025) + (this.tradeOperations_total * 0.025) + (this.silverOperations_total * this.silverPrice * 0.025) + (this.stocksOperations_total * 0.025) + (this.Mutual_fundsOperations_total * 0.025),
                'currency': this.newBase
            }
        });
        return await charityModal.present();
    }
  deleteWholeCategoryOperations(id: number) {

    switch (id) {
      case 1:
        this.goldOperations = [];
        break;
      case 2:
        this.moneyOperations = [];
        this.totalTransformedMoney = 0;
        break;
      case 3:
        this.tradeOperations = [];
        break;
      case 4:
        this.silverOperations = [];
        break;
      case 5:
        this.stocksOperations = [];
        break;
      case 6:
        this.Mutual_fundsOperations = [];
        break;
      default:
        break;
    }
      if(this.platform.is("cordova") || this.platform.is("capacitor")) {
    return this.db.deleteOperationByCategoryId(id).then(() => {
      this.db.loadAllOperations()
    })
      }else {
        return  this.category.deleteOperationByCategoryId(id).subscribe(_=>{
            this.getOperationSubs = this.category.getAllOperations().subscribe(async data => {
                this.lasOps = data;
                this.isEmpty = data.length === 0;
                this.ionViewWillEnter();
                this.ionViewDidEnter();
            });
        })
      }

  }
    async getItem() {
        const ret = await Storage.get({key: 'GLOBAL-RATES'});
        this.allRates = JSON.parse(ret.value);
  }


ionViewDidLeave(){
  this.getOperationSubs.unsubscribe();
}
}
