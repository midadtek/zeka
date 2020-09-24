import {Component, OnDestroy, OnInit} from '@angular/core';
import {Category_operationsService} from "../../../../services/category_operations.service";
import {Subscription} from "rxjs";
import {NgForm} from "@angular/forms";
import { DbServiceService, operation } from 'src/app/services/db-service.service';
import { Platform } from '@ionic/angular';


import { Plugins } from '@capacitor/core';
import {ModalController, AlertController, LoadingController, NavController} from '@ionic/angular';
import { CharityComponent } from '../../../../component/charity/charity.component';
import { take } from 'rxjs/operators';
import {ActivatedRoute, Router} from "@angular/router";
const { Storage } = Plugins;

export interface country  {
  id: string,
  country_name:string,
  country_code: string,
  fitir_value: number,
  created_at: Date,
  updated_at: Date
}


@Component({
  selector: 'app-add-new-value',
  templateUrl: './add-new-value.page.html',
  styleUrls: ['./add-new-value.page.scss'],
})
export class AddNewValuePage implements OnInit, OnDestroy{
  availableCurrencies:any[];
  categorySub: Subscription;
  id: number;
  catEl: any;
  goldPrice: number;
  silverPrice: number;
  operations: operation[];
  defaultCountry: string;
  availableCountries:country[];
  fitir_value: number = 0;
  pickedCurrency: string;
  private sub: Subscription;
  private defaultDate: any;
  private allRates: any;
  public newBase: string;
  public translatedCurrencyName: string;


  constructor(private platform: Platform,public navCtrl: NavController, private loadingCtrl: LoadingController,private router: Router, private alertCtrl:AlertController , private category: Category_operationsService, private modalCtrl: ModalController, private db: DbServiceService, private route: ActivatedRoute) {
  }

  async ngOnInit() {
    this.getItem().then(_ => {
      this.newBase =  this.category.currencyCode
      this.pickedCurrency= this.category.currencyCode
      this.goldPrice = +this.allRates.rates.gold * +this.allRates.rates.rates[this.newBase]
      this.silverPrice = +this.allRates.rates.silver * +this.allRates.rates.rates[this.newBase]
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
    });
    this.sub = this.route
        .queryParams
        .subscribe(params => {
          this.id = +params['id'];
        });
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'يرجى الانتظار',
      mode:'ios',
      spinner:'circular',
    })
    await loading.present();
    if (this.id == 7) {
      this.category.getAllCountries().pipe(take(1)).subscribe(data => {
            this.availableCountries = data

            for(let i = 0; i < this.availableCountries.length; i++) {
              if (this.availableCountries[i].country_name === this.defaultCountry){
                this.fitir_value = this.availableCountries[i].fitir_value;
              }
            }
          }
      )
    }

    this.category.getAllCurrencies().subscribe(data => {
      this.availableCurrencies = data
    })

    this.categorySub = this.category.getAllCategory().subscribe(result => {
      this.catEl = result[this.id -1]
    })

    this.getItem().then(async () => {
        await loading.dismiss()
      // })
    })
  }
  async getItem() {
    const ret = await Storage.get({key: 'GLOBAL-RATES'});
    this.allRates = JSON.parse(ret.value);
  }

  ngOnDestroy() {
    this.categorySub.unsubscribe();
  }


  async onAddOperation(form :NgForm){
    console.log(form.value)
    let message: string;
    let value: string;
    let insertedValue: string;
  let insertedValueForBase:string ;

    if (this.id == 1){
      message = `<ion-label>${((form.value.d_val_1 + (form.value.d_val_2)*(21/24) + (form.value.d_val_3)*(18/24)) * this.goldPrice * 0.025).toFixed(0)}  ${this.translatedCurrencyName}</ion-label>`;
      insertedValue = (form.value.d_val_1 + (form.value.d_val_2)*(21/24) + (form.value.d_val_3)*(18/24)) + 'جرام 24 قيراط'
      value = ((form.value.d_val_1 + (form.value.d_val_2)*(21/24) + (form.value.d_val_3)*(18/24)) * this.goldPrice * 0.025).toFixed(0);
    }
    else if (this.id == 2) {
      if (this.pickedCurrency !== this.newBase) {
        insertedValue =  form.value.d_val_1;
        insertedValueForBase = (form.value.d_val_1 * 1 / this.allRates.rates.rates[form.value.currency_type] * this.allRates.rates.rates[this.newBase]).toFixed(0)
        message = `<ion-label>${(+insertedValueForBase * 0.025).toFixed(0)}  ${this.translatedCurrencyName}</ion-label>`;
        value = (+insertedValueForBase * 0.025).toFixed(0)
      }
     else {
        insertedValue =  form.value.d_val_1;
        message = `<ion-label>${(+insertedValue * 0.025).toFixed(0)}  ${this.translatedCurrencyName}</ion-label>`;
        value = (+insertedValue * 0.025).toFixed(0)
      }
    }else if (this.id == 3) {
      message = `<ion-label>${(form.value.d_val_1 * 0.025).toFixed(0)}  ${this.translatedCurrencyName}</ion-label>`;
      insertedValue = form.value.d_val_1.toFixed(0)
      value = (form.value.d_val_1 * 0.025).toFixed(0);
    }
    else if (this.id == 4) {
      message = `<ion-label>${(form.value.d_val_1 * this.silverPrice * 0.025).toFixed(0)}  ${this.translatedCurrencyName}</ion-label>`;
      insertedValue = (form.value.d_val_1).toFixed(0) + 'جرام'
      value = (form.value.d_val_1 * this.silverPrice * 0.025).toFixed(0)
    }
    else if (this.id == 5 || this.id == 6) {
      message = `<ion-label>${(form.value.d_val_1 * form.value.d_val_2 * 0.025).toFixed(0)}  ${this.translatedCurrencyName}</ion-label>`;
      insertedValue = (form.value.d_val_1 * form.value.d_val_2).toFixed(0)
      value = (form.value.d_val_1 * form.value.d_val_2 * 0.025).toFixed(0)
    }
    let data:any = [form.value.category_id, form.value.category_name, form.value.country_id, form.value.currency_type, form.value.d_val_1, form.value.d_val_2, form.value.d_val_3, form.value.name, form.value.user_id];
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class-alert',
      header: 'احتساب',
      subHeader:` مقدار الزكاة ل${insertedValue} ${(this.id == 1 || this.id == 4 )? '' : (this.id == 2 ? this.pickedCurrency: this.translatedCurrencyName)}`,
      message: message,
      mode:'ios',
      buttons: [{
        text:' إضافة الى المحفظة',
        role:'added',
        handler:() => {}
      },
        {
          text:'التوجه طرق الدفع',
          role:'paymentWays',
          handler:async () => {
            const charityModal = await this.modalCtrl.create({
              component: CharityComponent,
              cssClass: 'my-custom-class',
              componentProps:{
                'willPayValue':parseInt(value),
                'currency': this.translatedCurrencyName
              }
            });
            return await charityModal.present();
          }
        },
      ]
    });

    await alert.present().then(_=>{
      if(this.id == 1 && (+form.value.d_val_1 + +form.value.d_val_2*0.875 + +form.value.d_val_3*0.75) < 85){
        document.querySelector('ion-alert div.alert-button-group button:nth-of-type(2)').setAttribute('disabled', 'true');
        document.querySelector('ion-alert div.alert-button-group button:nth-of-type(2)').setAttribute('style', 'opacity:0.3');
      }
      if((this.id == 2 || this.id == 3) && +form.value.d_val_1 < this.goldPrice * 85){
        document.querySelector('ion-alert div.alert-button-group button:nth-of-type(2)').setAttribute('disabled', 'true');
        document.querySelector('ion-alert div.alert-button-group button:nth-of-type(2)').setAttribute('style', 'opacity:0.3');
      }
      if(this.id == 4 && +form.value.d_val_1 < 595){
        document.querySelector('ion-alert div.alert-button-group button:nth-of-type(2)').setAttribute('disabled', 'true');
        document.querySelector('ion-alert div.alert-button-group button:nth-of-type(2)').setAttribute('style', 'opacity:0.3');
      }
      if((this.id == 5 || this.id == 6) && (+form.value.d_val_1 * +form.value.d_val_2) < this.goldPrice*85){
        document.querySelector('ion-alert div.alert-button-group button:nth-of-type(2)').setAttribute('disabled', 'true');
        document.querySelector('ion-alert div.alert-button-group button:nth-of-type(2)').setAttribute('style', 'opacity:0.3');
      }
      return;
    });
    let result = await alert.onDidDismiss();
    if (result.role == 'added'){
      if(this.platform.is("cordova") || this.platform.is("capacitor")) {
        this.db.addNewOperation(data).then(responsedata => {
          this.router.navigate(['home', responsedata.insertId], {replaceUrl: true});
        })
      }else{
        console.log(form.value)
        return this.category.createNewOperation(form.value).subscribe(resData=>{
          console.log(resData)
          this.router.navigate(['home', resData], {replaceUrl: true});
        })
      }
    }
  }

  onSelect(option: string) {
      this.pickedCurrency=option
      this.goldPrice = +this.allRates.rates.gold * +this.allRates.rates.rates[this.pickedCurrency]
  }

  onCurChange(cur: string){
   this.pickedCurrency = cur
  }

}