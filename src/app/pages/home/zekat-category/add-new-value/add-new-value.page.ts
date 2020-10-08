import { Component, OnInit } from '@angular/core';
import { Category_operationsService } from '../../../../services/category_operations.service';
import { NgForm } from '@angular/forms';
import { DbServiceService} from 'src/app/services/db-service.service';
import {Operation} from 'src/app/services/interfaces';
import { Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { ModalController, AlertController, LoadingController, NavController } from '@ionic/angular';
import { CharityComponent } from '../../../../component/charity/charity.component';
import { ActivatedRoute, Router } from '@angular/router';
const { Storage } = Plugins;
@Component({
  selector: 'app-add-new-value',
  templateUrl: './add-new-value.page.html',
  styleUrls: ['./add-new-value.page.scss'],
})
export class AddNewValuePage implements OnInit {
  availableCurrencies = this.categoryService.curreciesList;
  id: number;
  catEl: any;
  goldPrice: number;
  silverPrice: number;
  operations: Operation[];
  availableCountries = this.categoryService.countriesList;
  pickedCurrency: string;
  private allRates: any;
  public currentBase: string;
  public moneyCurrencyIndex: number;
  public translatedMoneyCurrencyName: any;
  public currentCountry: any;
  public countryIndex: number;
  public translatedCountryName: string;
  constructor(private platform: Platform, public navCtrl: NavController,
              private router: Router, private alertCtrl: AlertController,
              private categoryService: Category_operationsService,
              private modalCtrl: ModalController, private db: DbServiceService,
              private route: ActivatedRoute) {
    // tslint:disable-next-line: radix
    this.id = Number(this.route.snapshot.params.id);
  }
  ngOnInit() {
    this.getGlobalRatesObject();
    Storage.get({ key: 'setting' }).then(resp => {
      if (resp && resp.value) {
        const setting = JSON.parse(resp.value);
        this.pickedCurrency = this.currentBase = setting.currency;
        this.goldPrice = this.allRates.rates.gold * this.allRates.rates.rates[this.currentBase];
        this.silverPrice = this.allRates.rates.silver * this.allRates.rates.rates[this.currentBase];
        this.moneyCurrencyIndex = this.categoryService.curreciesList.findIndex(I => I.code === this.currentBase);
        this.translatedMoneyCurrencyName = this.categoryService.curreciesList[this.moneyCurrencyIndex].name;
        this.translatedCountryName = this.categoryService.countriesList.find(x => x.country_code === setting.country).country_name;
        this.currentCountry = setting.country;
        this.categoryService.getAllCategory().subscribe(result => {
          this.catEl = result[this.id - 1];
        });
      }
    });
  }
  async getGlobalRatesObject() {
    const ret = await Storage.get({ key: 'GLOBAL-RATES' });
    this.allRates = JSON.parse(ret.value);
  }
  async onAddOperation(form: NgForm) {
    let message: string;
    let value: string;
    let insertedValue: string;
    let insertedValueForBase: string;
    if (this.id === 1) {
      message = `<ion-label>${((form.value.d_val_1 + (form.value.d_val_2) * (21 / 24) +
        (form.value.d_val_3) * (18 / 24)) * this.goldPrice * 0.025).toFixed(2)}
        ${this.translatedMoneyCurrencyName}</ion-label>`;
      insertedValue = (form.value.d_val_1 + (form.value.d_val_2) * (21 / 24) +
      (form.value.d_val_3) * (18 / 24)) + 'جرام 24 قيراط';
      value = ((form.value.d_val_1 + (form.value.d_val_2) * (21 / 24) +
      (form.value.d_val_3) * (18 / 24)) * this.goldPrice * 0.025).toFixed(2);
    }
    else if (this.id === 2) {
      if (this.pickedCurrency !== this.currentBase) {
        insertedValue = form.value.d_val_1;
        insertedValueForBase = (form.value.d_val_1 * 1 / this.allRates.rates.rates[form.value.currency_type] *
                                this.allRates.rates.rates[this.currentBase]).toFixed(2);
        message = `<ion-label>${(+insertedValueForBase * 0.025).toFixed(2)}  ${this.translatedMoneyCurrencyName}</ion-label>`;
        value = (+insertedValueForBase * 0.025).toFixed(2);
      }
      else {
        insertedValue = form.value.d_val_1;
        message = `<ion-label>${(+insertedValue * 0.025).toFixed(2)}  ${this.translatedMoneyCurrencyName}</ion-label>`;
        value = (+insertedValue * 0.025).toFixed(2);
      }
    } else if (this.id === 3) {
      message = `<ion-label>${(form.value.d_val_1 * 0.025).toFixed(2)}  ${this.translatedMoneyCurrencyName}</ion-label>`;
      insertedValue = form.value.d_val_1.toFixed(2);
      value = (form.value.d_val_1 * 0.025).toFixed(2);
    }
    else if (this.id === 4) {
      message = `<ion-label>${(form.value.d_val_1 * this.silverPrice * 0.025).toFixed(2)}  ${this.translatedMoneyCurrencyName}</ion-label>`;
      insertedValue = (form.value.d_val_1).toFixed(2) + 'جرام';
      value = (form.value.d_val_1 * this.silverPrice * 0.025).toFixed(2);
    }
    else if (this.id === 5 || this.id === 6) {
      message = `<ion-label>${(form.value.d_val_1 * form.value.d_val_2 * 0.025).toFixed(2)}  ${this.translatedMoneyCurrencyName}</ion-label>`;
      insertedValue = (form.value.d_val_1 * form.value.d_val_2).toFixed(2);
      value = (form.value.d_val_1 * form.value.d_val_2 * 0.025).toFixed(2);
    }
    const data: any = [form.value.category_id, form.value.category_name, form.value.country_id,
                      form.value.currency_type, form.value.d_val_1, form.value.d_val_2, form.value.d_val_3,
                      form.value.name, form.value.user_id];
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class-alert',
      header: 'احتساب',
      subHeader:` مقدار الزكاة ل${insertedValue} ${(this.id == 1 || this.id == 4 )? '' : this.getMoneyCurrencyName(this.pickedCurrency)}`,
      message,
      mode: 'ios',
      buttons: [{
        text: ' إضافة الى المحفظة',
        role: 'added',
        handler: () => { }
      },
      {
        text: 'التوجه طرق الدفع',
        role: 'paymentWays',
        handler: async () => {
          const charityModal = await this.modalCtrl.create({
            component: CharityComponent,
            cssClass: 'my-custom-class',
            componentProps: {
              willPayValue: Number(value),
              currency: this.translatedMoneyCurrencyName
            }
          });
          return await charityModal.present();
        }
      },
      ]
    });
    await alert.present().then(_ => {
      if (this.id === 1 && (+form.value.d_val_1 + +form.value.d_val_2 * 0.875 + +form.value.d_val_3 * 0.75) < 85) {
        document.querySelector('ion-alert div.alert-button-group button:nth-of-type(2)').setAttribute('disabled', 'true');
        document.querySelector('ion-alert div.alert-button-group button:nth-of-type(2)').setAttribute('style', 'opacity:0.3');
      }
      if ((this.id === 2 || this.id === 3) && +form.value.d_val_1 < this.goldPrice * 85) {
        document.querySelector('ion-alert div.alert-button-group button:nth-of-type(2)').setAttribute('disabled', 'true');
        document.querySelector('ion-alert div.alert-button-group button:nth-of-type(2)').setAttribute('style', 'opacity:0.3');
      }
      if (this.id === 4 && +form.value.d_val_1 < 595) {
        document.querySelector('ion-alert div.alert-button-group button:nth-of-type(2)').setAttribute('disabled', 'true');
        document.querySelector('ion-alert div.alert-button-group button:nth-of-type(2)').setAttribute('style', 'opacity:0.3');
      }
      if ((this.id === 5 || this.id === 6) && (+form.value.d_val_1 * +form.value.d_val_2) < this.goldPrice * 85) {
        document.querySelector('ion-alert div.alert-button-group button:nth-of-type(2)').setAttribute('disabled', 'true');
        document.querySelector('ion-alert div.alert-button-group button:nth-of-type(2)').setAttribute('style', 'opacity:0.3');
      }
      return;
    });
    const result = await alert.onDidDismiss();
    if (result.role === 'added') {
      if (this.platform.is('cordova') || this.platform.is('capacitor')) {
        this.db.addNewOperation(data).then(responsedata => {
          this.router.navigate(['home', responsedata.insertId], { replaceUrl: true });
        });
      } else {
        return this.categoryService.createNewOperation(form.value).subscribe(resData => {
          this.router.navigate(['home', resData], { replaceUrl: true });
        });
      }
    }
  }
  onSelect(option: string) {
    this.pickedCurrency = option;
    this.moneyCurrencyIndex = this.categoryService.curreciesList.findIndex(I => I.code === this.pickedCurrency);
    this.translatedMoneyCurrencyName = this.categoryService.curreciesList[this.moneyCurrencyIndex].name;
    this.goldPrice = this.allRates.rates.gold * this.allRates.rates.rates[this.pickedCurrency];
  }
  async openCharityModal(value) {
    const charityModal = await this.modalCtrl.create({
      component: CharityComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        willPayValue: Number(value),
        currency: this.translatedMoneyCurrencyName
      }
    });
    return await charityModal.present();
  }
  getFitirValue(country: string) {
    const name = this.categoryService.countriesList.filter(C => C.country_code === country);
    return name[0].fitir_value;
  }
  getMoneyCurrencyName (currency: string) {
    let name = this.categoryService.curreciesList.filter(I => I.code == currency)
    return name[0].name;
  }
}
