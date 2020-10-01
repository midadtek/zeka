import { Component, OnInit} from '@angular/core';
import { Category_operationsService } from 'src/app/services/category_operations.service';
import {Router} from "@angular/router";
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
  public Countries: any[] ;
  public currencyCode: string;
  public countryCode: string;
  public selectedDate: string;
  public translatedCurrencyName: string;
  public translatedCountryName: string;
  private currencyIndex: number;

  constructor(private router:Router, private categoryService: Category_operationsService) {}

  async ngOnInit() {

    await this.categoryService.getSettingObject()
    this.currencyCode = this.categoryService.currencyCode
    this.currencyIndex = this.categoryService.curreciesList.findIndex(I => I.code == this.currencyCode);
    console.log(this.currencyIndex)
    this.translatedCurrencyName = this.categoryService.curreciesList[this.currencyIndex].name;
    console.log(this.translatedCurrencyName);

    this.countryCode = this.categoryService.countryCode;
    if (this.countryCode) {
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
    this.formattedDate = this.categoryService.selectedDate
  }

  async setSettingObject() {
    await Storage.set({
      key: 'setting',
      value: JSON.stringify({
        currency: this.currencyCode,
        country: this.countryCode,
        date: this.selectedDate
      })
    }).then(_=>{
      this.router.navigateByUrl('/home', {replaceUrl:true})
    });
  }


  pickedDate(date: string) {
    this.selectedDate = date;
  }
  setCurrencyItem(currencycode: string) {
    this.currencyCode = currencycode
  }
  setCountryItem(countrycode: string) {
    this.countryCode = countrycode
  }

  ionViewDidEnter(){
    this.currencies =this.categoryService.curreciesList;
    this.Countries = this.categoryService.countriesList;
  }
}
