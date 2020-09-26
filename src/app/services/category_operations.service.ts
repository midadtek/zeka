import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

export interface charity {
  id: number;
  charity_name: string;
  charity_description: string;
  payment_link: string;
  charity_website: string;
  charity_phone: string;
  charity_address: string;
  charity_country: string;
  facebook_link: string;
  youtube_link: string;
  twitter_link: string;
  instagram_link: string;
}

export interface charityBankInfo {
  id: number,
  charity_id: number,
  bank_name: string,
  branch_name: string,
  account_name: string,
  account_number: number,
  swift_code: string,
  USD_IBAN: string,
  EUR_IBAN: string,
  LOCAL_IBAN: string
}

@Injectable({
  providedIn: 'root'
})
export class Category_operationsService {
  public charities: charity[];
  public selectedDate: Date;
  public currencyCode: any;
  public countryCode: any;
  public curreciesList: any[];
  public countriesList: any[];
  public GlobalRates: any;

  constructor(private http: HttpClient) {

  }


  
  
  getAllCategory(){
  return this.http.get<any>('http://zakatiadmin.samhayir.com/api/v1/category/all')
}
  getAllOperations() {
    return this.http.get<any>('http://zakatiadmin.samhayir.com/api/v1/operation/allOperationOrderedLimited');
  }
  getAllCharities() {
    this.http.get<charity[]>('http://zakatiadmin.samhayir.com/api/v1/charity/all').subscribe(resData => {
      this.charities = resData;
    });
  }
  getAllCharitiesBankInfo(id) {
    return this.http.get<charityBankInfo[]>(`http://zakatiadmin.samhayir.com/api/v1/charity/bankInfo/${id}`);
  }
  createNewOperation(data: any) {
    return this.http.post<any>('http://zakatiadmin.samhayir.com/api/v1/operation/create',data );
  }

  getAllOperationByCategoryLimited(catId: string, limit: string) {
    return this.http.get<any>('http://zakatiadmin.samhayir.com/api/v1/operation/allOperationByCategory/'+catId+'/'+limit)
  }

  getAllOperationByCategory(catId){
    return this.http.get<any>('http://zakatiadmin.samhayir.com/api/v1/operation/allOperationByCategory/'+catId);
  }

  getAllOperationsOrderedLimited() {
    return this.http.get<any>('http://zakatiadmin.samhayir.com/api/v1/operation/allOperationOrderedLimited');
  }
  
  getAllCurrencies() {
    return this.http.get<any[]>('http://zakatiadmin.samhayir.com/api/v1/currency/all').subscribe(responseData => {
      this.curreciesList = responseData
    })
  }
  getAllCountries() {
    return this.http.get<any[]>('http://zakatiadmin.samhayir.com/api/v1/country/all').subscribe(responseData => {
      this.countriesList = responseData
    })
  }

  deleteOperationById(id: number) {
    return this.http.delete<any>('http://zakatiadmin.samhayir.com/api/v1/operation/delete/'+id);
  }
  
  deleteOperationByCategoryId(id: number) {
    return this.http.delete<any>('http://zakatiadmin.samhayir.com/api/v1/operation/deleteByCategory/'+id);
  }

getGlobalRates () {
 return this.http.get<any>('http://zakatiadmin.samhayir.com/api/v1/allPrices/price')
     .subscribe(async resData => {
       this.GlobalRates = resData
       console.log(resData)
       await Storage.set({
         key: 'GLOBAL-RATES',
         value: JSON.stringify({
           rates: resData,
           date: new Date().getTime()
         })
       }).then(_=>{
       });
     });
  };

  async getSettingObject() {
    const ret = await Storage.get({ key: 'setting' });
    const setting = JSON.parse(ret.value);
    if (setting){
      this.selectedDate = new Date(setting.date);
      this.currencyCode = setting.currency;
      this.countryCode = setting.country;
    }
  }
  }



// async getItem() {
//   const ret = await Storage.get({key: 'GLOBAL-RATES'});
//   this.allRates = JSON.parse(ret.value);
// }
