import { Component, OnInit, ViewChild} from '@angular/core';
import { Category_operationsService } from 'src/app/services/category_operations.service';
import {Router} from '@angular/router';
import { Plugins } from '@capacitor/core';
import { IonSlides } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
const { Storage } = Plugins;

@Component({
  selector: 'app-first-run',
  templateUrl: './first-run.page.html',
  styleUrls: ['./first-run.page.scss'],
})
export class FirstRunPage implements OnInit {
  @ViewChild('slides', { static: false }) slides: IonSlides;
  settingForm: FormGroup;
  public formattedDate: Date;
  public currencies: any[];
  public Countries: any[];
  public currencyCode: string;
  public countryCode: string;
  public selectedDate: string;
  public translatedCurrencyName: string;
  public translatedCountryName: string;
  monthShortNames = 'كانون ثاني, شباط, آذار, نيسان, آيار, حزيران, تموز, آب, أيلول, تشرين أول, تشرين ثاني, كانون أول';
  constructor(private router: Router, private categoryService: Category_operationsService,
              private formBuilder: FormBuilder) { }
  async ngOnInit() {
    this.settingForm = this.formBuilder.group({
      currencyCode: [null, Validators.compose([Validators.required])],
      countryCode: [null, Validators.compose([Validators.required])],
      selectedDate: [null, Validators.compose([Validators.required])],
    });
    this.categoryService.getCountries().subscribe(responseCountry => {
      this.Countries = responseCountry;
      this.categoryService.getCurrencies().subscribe(responseCurrency => {
        this.currencies = responseCurrency;
        Storage.get({ key: 'setting' }).then(resp => {
          if (resp && resp.value){
            const setting = JSON.parse(resp.value);
            this.currencyCode = setting.currency;
            this.countryCode = setting.country;
            this.formattedDate = new Date(setting.date);
            this.translatedCurrencyName = this.currencies.find(x => x.code === setting.currency).name;
            this.translatedCountryName = this.Countries.find(x => x.country_code === setting.country).country_name;
          }
        });
      });
    });
  }
  ionViewWillEnter() {
    this.slides.lockSwipes(true);
  }
  nextSlide() {
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipes(true);
  }
  saveSetting(formValues) {
    Storage.set({
      key: 'setting',
      value: JSON.stringify({
        currency: formValues.currencyCode,
        country: formValues.countryCode,
        date: formValues.selectedDate
      })
    }).then(_ => {
      this.router.navigateByUrl('/home', {replaceUrl: true});
    });
  }
  async setSettingObject() {
    await Storage.set({
      key: 'setting',
      value: JSON.stringify({
        currency: this.currencyCode,
        country: this.countryCode,
        date: this.selectedDate
      })
    }).then(_ => {
      this.router.navigateByUrl('/home', {replaceUrl: true});
    });
  }
  pickedDate(date: string) {
    this.selectedDate = date;
  }
  setCurrencyItem(currencycode: string) {
    this.currencyCode = currencycode;
  }
  setCountryItem(countrycode: string) {
    this.countryCode = countrycode;
  }
}
