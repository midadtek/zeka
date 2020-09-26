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
export class AddNewValuePage implements OnInit{
  availableCurrencies = this.categoryService.curreciesList;
  categorySub: Subscription;
  id: number;
  catEl: any;
  goldPrice: number;
  silverPrice: number;
  operations: operation[];
  availableCountries = this.categoryService.countriesList;
  pickedCurrency: string;
  private sub: Subscription;
  private defaultDate: any;
  private allRates: any;
  public currentBase: string;
  private currencyIndex: number;
  public moneyCurrencyIndex: number;
  public translatedMoneyCurrencyName: any;
  public currentCountry: any;
  public countryIndex: number;
  public translatedCountryName: string;


  constructor(private platform: Platform,public navCtrl: NavController, private loadingCtrl: LoadingController,private router: Router, private alertCtrl:AlertController , private categoryService: Category_operationsService, private modalCtrl: ModalController, private db: DbServiceService, private route: ActivatedRoute) {
    this.id = parseInt(this.route.snapshot.params['id']);

  }

  ngOnInit() {
    this.currentBase =  this.categoryService.currencyCode
    this.currentCountry = this.categoryService.countryCode;
    this.pickedCurrency= this.currentBase

    this.moneyCurrencyIndex = this.categoryService.curreciesList.findIndex(I => I.code == this.pickedCurrency);
    console.log(this.moneyCurrencyIndex);
    this.translatedMoneyCurrencyName = this.categoryService.curreciesList[this.moneyCurrencyIndex].name;
    console.log(this.translatedMoneyCurrencyName);


    this.getGlobalRatesObject().then(_ => {
      this.goldPrice = this.allRates.rates.gold * this.allRates.rates.rates[this.currentBase]
      this.silverPrice = this.allRates.rates.silver * this.allRates.rates.rates[this.currentBase]

      this.countryIndex = this.categoryService.countriesList.findIndex(C => C.country_code == this.currentCountry);
      console.log(this.countryIndex);
      this.translatedCountryName = this.categoryService.countriesList[this.countryIndex].country_name;
      console.log(this.translatedCountryName);
    });



    this.categorySub = this.categoryService.getAllCategory().subscribe(result => {
      this.catEl = result[this.id -1]
    })

    this.getGlobalRatesObject()
  }
  async getGlobalRatesObject() {
    const ret = await Storage.get({key: 'GLOBAL-RATES'});
    this.allRates = JSON.parse(ret.value);
  }

  async onAddOperation(form :NgForm){
    console.log(form.value)
    let message: string;
    let value: string;
    let insertedValue: string;
  let insertedValueForBase:string ;

    if (this.id == 1){
      message = `<ion-label>${((form.value.d_val_1 + (form.value.d_val_2)*(21/24) + (form.value.d_val_3)*(18/24)) * this.goldPrice * 0.025).toFixed(2)}  ${this.translatedMoneyCurrencyName}</ion-label>`;
      insertedValue = (form.value.d_val_1 + (form.value.d_val_2)*(21/24) + (form.value.d_val_3)*(18/24)) + 'جرام 24 قيراط'
      value = ((form.value.d_val_1 + (form.value.d_val_2)*(21/24) + (form.value.d_val_3)*(18/24)) * this.goldPrice * 0.025).toFixed(2);
    }
    else if (this.id == 2) {
      if (this.pickedCurrency !== this.currentBase) {
        insertedValue =  form.value.d_val_1;
        insertedValueForBase = (form.value.d_val_1 * 1 / this.allRates.rates.rates[form.value.currency_type] * this.allRates.rates.rates[this.currentBase]).toFixed(2)
        message = `<ion-label>${(+insertedValueForBase * 0.025).toFixed(2)}  ${this.translatedMoneyCurrencyName}</ion-label>`;
        value = (+insertedValueForBase * 0.025).toFixed(2)
      }
     else {
        insertedValue =  form.value.d_val_1;
        message = `<ion-label>${(+insertedValue * 0.025).toFixed(2)}  ${this.translatedMoneyCurrencyName}</ion-label>`;
        value = (+insertedValue * 0.025).toFixed(2)
      }
    }else if (this.id == 3) {
      message = `<ion-label>${(form.value.d_val_1 * 0.025).toFixed(2)}  ${this.translatedMoneyCurrencyName}</ion-label>`;
      insertedValue = form.value.d_val_1.toFixed(2)
      value = (form.value.d_val_1 * 0.025).toFixed(2);
    }
    else if (this.id == 4) {
      message = `<ion-label>${(form.value.d_val_1 * this.silverPrice * 0.025).toFixed(2)}  ${this.translatedMoneyCurrencyName}</ion-label>`;
      insertedValue = (form.value.d_val_1).toFixed(2) + 'جرام'
      value = (form.value.d_val_1 * this.silverPrice * 0.025).toFixed(2)
    }
    else if (this.id == 5 || this.id == 6) {
      message = `<ion-label>${(form.value.d_val_1 * form.value.d_val_2 * 0.025).toFixed(2)}  ${this.translatedMoneyCurrencyName}</ion-label>`;
      insertedValue = (form.value.d_val_1 * form.value.d_val_2).toFixed(2)
      value = (form.value.d_val_1 * form.value.d_val_2 * 0.025).toFixed(2)
    }

    let data:any = [form.value.category_id, form.value.category_name, form.value.country_id, form.value.currency_type, form.value.d_val_1, form.value.d_val_2, form.value.d_val_3, form.value.name, form.value.user_id];
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class-alert',
      header: 'احتساب',
      subHeader:` مقدار الزكاة ل${insertedValue} ${(this.id == 1 || this.id == 4 )? '' : (this.id == 2 ? this.pickedCurrency: this.translatedMoneyCurrencyName)}`,
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
                'currency': this.translatedMoneyCurrencyName
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
        return this.categoryService.createNewOperation(form.value).subscribe(resData=>{
          console.log(resData)
          this.router.navigate(['home', resData], {replaceUrl: true});
        })
      }
    }
  }

  onSelect(option: string) {
      this.pickedCurrency=option
    console.log(this.pickedCurrency)
    this.moneyCurrencyIndex = this.categoryService.curreciesList.findIndex(I => I.code == this.pickedCurrency);
    console.log(this.currencyIndex);
    this.translatedMoneyCurrencyName = this.categoryService.curreciesList[this.moneyCurrencyIndex].name;
    console.log(this.translatedMoneyCurrencyName);
      this.goldPrice = this.allRates.rates.gold * this.allRates.rates.rates[this.pickedCurrency]
    console.log(this.goldPrice)
  }

  async openCharityModal(value) {
    const charityModal = await this.modalCtrl.create({
      component: CharityComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        'willPayValue': parseInt(value),
        'currency': this.translatedMoneyCurrencyName
      }
    });
    return await charityModal.present();
  }


  getFitirValue (country: string) {
    let name = this.categoryService.countriesList.filter(C => C.country_code == country)
    return name[0].fitir_value;
  }

}