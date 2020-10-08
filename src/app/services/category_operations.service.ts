import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Plugins } from '@capacitor/core';
import { environment } from 'src/environments/environment';
import { Charity, CharityBankInfo } from './interfaces';
const { Storage } = Plugins;
// tslint:disable: class-name

@Injectable({
  providedIn: 'root'
})
export class Category_operationsService {
  public charities: Charity[];
  public selectedDate: Date;
  public currencyCode: any;
  public countryCode: any;
  public curreciesList: any[];
  public countriesList: any[];
  public GlobalRates: any;
  constructor(private http: HttpClient) {
  }
  getBanners() {
    return this.http.get<any>(environment.base_url + '/api/v1/banner/all');
  }
  getAllCategory() {
    return this.http.get<any>(environment.base_url + '/api/v1/category/all');
  }
  getAllOperations() {
    return this.http.get<any>(environment.base_url + '/api/v1/operation/allOperationOrderedLimited');
  }
  getAllCharities() {
    this.http.get<Charity[]>(environment.base_url + '/api/v1/charity/all').subscribe(resData => {
      this.charities = resData;
    });
  }
  getAllCharitiesBankInfo(id) {
    return this.http.get<CharityBankInfo[]>(environment.base_url + `/api/v1/charity/bankInfo/${id}`);
  }
  createNewOperation(data: any) {
    return this.http.post<any>(environment.base_url + '/api/v1/operation/create', data);
  }
  getAllOperationByCategoryLimited(catId: string, limit: string) {
    return this.http.get<any>(environment.base_url + '/api/v1/operation/allOperationByCategory/' + catId + '/' + limit);
  }
  getAllOperationByCategory(catId) {
    return this.http.get<any>(environment.base_url + '/api/v1/operation/allOperationByCategory/' + catId);
  }
  getAllOperationsOrderedLimited() {
    return this.http.get<any>(environment.base_url + '/api/v1/operation/allOperationOrderedLimited');
  }
  getAllCurrencies() {
    return this.http.get<any[]>(environment.base_url + '/api/v1/currency/all').subscribe(responseData => {
      this.curreciesList = responseData;
    });
  }
  getAllCountries() {
    return this.http.get<any[]>(environment.base_url + '/api/v1/country/all').subscribe(responseData => {
      this.countriesList = responseData;
    });
  }
  getCountries() {
    return this.http.get<any[]>(environment.base_url + '/api/v1/country/all');
  }
  getCurrencies() {
    return this.http.get<any[]>(environment.base_url + '/api/v1/currency/all');
  }
  deleteOperationById(id: number) {
    return this.http.delete<any>(environment.base_url + '/api/v1/operation/delete/' + id);
  }
  deleteOperationByCategoryId(id: number) {
    return this.http.delete<any>(environment.base_url + '/api/v1/operation/deleteByCategory/' + id);
  }
  getGlobalRates() {
    return this.http.get<any>(environment.base_url + '/api/v1/allPrices/price')
      .subscribe(async resData => {
        this.GlobalRates = resData;
        await Storage.set({
          key: 'GLOBAL-RATES',
          value: JSON.stringify({
            rates: resData,
            date: new Date().getTime()
          })
        }).then(_ => {
        });
      });
  }
  async getSettingObject() {
    const ret = await Storage.get({ key: 'setting' });
    const setting = JSON.parse(ret.value);
    if (setting) {
      this.selectedDate = new Date(setting.date);
      this.currencyCode = setting.currency;
      this.countryCode = setting.country;
    }
  }
}
