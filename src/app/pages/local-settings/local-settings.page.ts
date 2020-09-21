import { Component, OnInit} from '@angular/core';
import {take} from 'rxjs/operators';
import { Category_operationsService } from 'src/app/services/category_operations.service';
import { Subscription } from 'rxjs';
import {Router} from "@angular/router";
import { Plugins } from '@capacitor/core';
import {NgForm} from "@angular/forms";

const { Storage } = Plugins;


@Component({
  selector: 'app-local-settings',
  templateUrl: './local-settings.page.html',
  styleUrls: ['./local-settings.page.scss'],
})
export class LocalSettingsPage implements OnInit {
  formatedDate: string;
  allCountries: any[] = [];
  countrySub: Subscription;
  currencySub: Subscription;
  public currencies: any[];
  public currencyCode: string;
  public countryCode: string;
  public selectedDate: string;
  public translatedCurrencyName: string;
  public translatedCountryName: string;

  constructor(private router:Router, private category: Category_operationsService) { }

  ngOnInit() {
    this.category.getObject()
    this.currencyCode =  this.category.currencyCode
    if(this.currencyCode) {
      switch (this.currencyCode) {
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
        this.countryCode = this.category.countryCode;
    if(this.countryCode) {
      switch (this.countryCode) {
        case 'TR' :
          this.translatedCountryName = "تركيا";
          break;
        case 'KSA' :
          this.translatedCountryName = "المملكة العربية السعودية";
          break;
        case "QR" :
          this.translatedCountryName = "قطر";
          break;
        case "KWD" :
          this.translatedCountryName = "الكويت";
          break;
        default:
          return;
      }
    }
        this.formatedDate = this.category.selectedDate
    this.currencySub = this.category.getAllCurrencies().pipe(take(1)).subscribe(data => {
      this.currencies = data;
    })
    this.countrySub = this.category.getAllCountries().pipe(take(1)).subscribe(data => {
      this.allCountries =  data;
    })

  }

  async setObject() {
    await Storage.set({
      key: 'setting',
      value: JSON.stringify({
        currency: this.currencyCode,
        country: this.countryCode,
        date: this.selectedDate
      })
    }).then(_=>{
      this.router.navigateByUrl('/home')
    });
  }


  pickedDate(date: string) {
    this.selectedDate = date;
  }
  formatDate(date: any) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }
  setCurrencyItem(currencycode: string) {
    this.currencyCode = currencycode
  }
  setCountryItem(countrycode: string) {
    this.countryCode = countrycode
  }

  ionViewDidLeave(){
    this.currencySub.unsubscribe();
    this.countrySub.unsubscribe();
  }

}
