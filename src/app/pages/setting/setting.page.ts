import { Component, OnInit} from '@angular/core';
import { Category_operationsService } from 'src/app/services/category_operations.service';
import {Router} from '@angular/router';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;
@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {
  public formattedDate: Date;
  public currencies: any[];
  public Countries: any[];
  public currencyCode: string;
  public countryCode: string;
  public selectedDate: string;
  public translatedCurrencyName: string;
  public translatedCountryName: string;
  constructor(private router: Router, private categoryService: Category_operationsService) { }
  async ngOnInit() {
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
