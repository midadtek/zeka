import {Component, OnInit} from '@angular/core';
import { Category_operationsService } from 'src/app/services/category_operations.service';
import {DbServiceService} from 'src/app/services/db-service.service';
import {AnimationController, ModalController} from '@ionic/angular';
import { CharityComponent } from 'src/app/component/charity/charity.component';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;
import { LoadingController } from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {BannerComponent} from '../../component/banner/banner.component';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  locenviroment;
  banners;
  id: number;
  goldPrice: number;
  silverPrice: number;
  goldTotalPrice: number;
  moneyTotalPrice: number;
  tradeTotalPrice: number;
  silverTotalPrice: number;
  stockTotalPrice: number;
  mutualTotalPrice: number;
  totalAmount: number;
  translatedCurrencyName: string;
    theFinalTotal: number;
    private sub: Subscription;
    private allRates: any;
    public currentBase: string;
    private currencyIndex: any;
    public moneyCurrencyIndex: number;
    public translatedMoneyCurrencyName: any;
    lastOperation: import("c:/Users/MidadEng/Downloads/zeka-templating/src/app/services/interfaces").Operation[];
  constructor(private animationCtrl: AnimationController,
              private db: DbServiceService, private modalCtrl: ModalController,
              private categoryService: Category_operationsService, public loadingController: LoadingController,
              private route: ActivatedRoute) {
      this.sub = this.route.params.subscribe(params => {
          this.id = +params.id;
      });
  }
 async ngOnInit() {
     
     this.locenviroment = environment;
     this.categoryService.getBanners().subscribe(resData => {
        this.banners =  resData;
      });
     this.getGlobalRatesObject();
     
     this.categoryService.getAllCharities();
     const loading = await this.loadingController.create({
         cssClass: 'my-custom-class',
         mode: 'ios',
         spinner: 'circular',
     });
     await loading.present();
 }
    ionViewWillEnter() {
        Storage.get({ key: 'setting' }).then(resp => {
            if (resp && resp.value){
                const setting = JSON.parse(resp.value);
                this.currentBase =  setting.currency;
                this.goldPrice = this.allRates.rates.gold * this.allRates.rates.rates[this.currentBase];
                this.silverPrice = this.allRates.rates.silver * this.allRates.rates.rates[this.currentBase];
                this.currencyIndex = this.categoryService.curreciesList.findIndex(I => I.code === this.currentBase);
                this.translatedCurrencyName = this.categoryService.curreciesList[this.currencyIndex].name;
            }
        });
        if (environment.is_local){
            this.db.getoperations().subscribe(async data => {
                this.dataOrganizier(data);
                this.lastOperation = data;
                await this.loadingController.dismiss();
            });
        }else{
            this.categoryService.getAllOperations().subscribe(async data => {
                this.dataOrganizier(data);
                this.lastOperation = data;
                await this.loadingController.dismiss();

            });
        }
        
    }
dataOrganizier(lastOperation: string | any[]) {
             this.goldTotalPrice = 0;
             this.silverTotalPrice = 0;
             this.moneyTotalPrice = 0;
             this.tradeTotalPrice = 0;
             this.stockTotalPrice = 0;
             this.mutualTotalPrice = 0;
             this.totalAmount = 0;
    if (lastOperation){
        for (let i = 0; i < lastOperation.length; i++) {
            if (lastOperation[i].category_id === 1) {
                this.goldTotalPrice += (+lastOperation[i].d_val_1 +
                    +lastOperation[i].d_val_2 * 0.875 +
                    +lastOperation[i].d_val_3 * 0.75) * +this.goldPrice;
            } else if (lastOperation[i].category_id === 2) {
                if (lastOperation[i].currency_type !== this.currentBase) {
                    this.moneyTotalPrice += lastOperation[i].d_val_1
                    * (1 / this.allRates.rates.rates[lastOperation[i].currency_type])
                    * this.allRates.rates.rates[this.currentBase];
                }
                if (lastOperation[i].currency_type == this.currentBase) {
                    this.moneyTotalPrice += +lastOperation[i].d_val_1;
                }
            } else if (lastOperation[i].category_id === 3) {
                this.tradeTotalPrice += +lastOperation[i].d_val_1;
            } else if (lastOperation[i].category_id === 4) {
                this.silverTotalPrice += lastOperation[i].d_val_1 * this.silverPrice;
            } else if (lastOperation[i].category_id === 5) {
                this.stockTotalPrice += +lastOperation[i].d_val_1 * +lastOperation[i].d_val_2;
            } else if (lastOperation[i].category_id === 6) {
                this.mutualTotalPrice += +lastOperation[i].d_val_1 * +lastOperation[i].d_val_2;
            }
        }
    }
        
  
             setTimeout(() => {
        this.animationCtrl.create()
            .addElement(document.querySelector('.new'))
            .duration(500)
            .iterations(1)
            .keyframes([
                {offset: 0, background: '#00ffd4'},
                {offset: 0.25, background: '#08ecc4'},
                {offset: 0.5, background: '#0a8071'},
                {offset: 0.75, background: '#012d26'},
                {offset: 1, background: 'var(--background)'}
            ])
                    .play();
                }, 500);
}
    async getGlobalRatesObject() {
        const ret = await Storage.get({key: 'GLOBAL-RATES'});
        this.allRates = JSON.parse(ret.value);
        }
    async charityModal() {
      const homeCharityModal = await this.modalCtrl.create({
        component: CharityComponent,
        cssClass: 'my-custom-class'
      });
      return await homeCharityModal.present();
    }
    ionViewWillLeave() {
     this.id = -1;
     this.sub.unsubscribe();
}
    async openBanner(bannerIndex) {
        const modal = await this.modalCtrl.create({
            component: BannerComponent,
            componentProps: {
                banners: this.banners,
                id: bannerIndex
            }
        });
        modal.present();
    }
    getMoneyCurrencyName(currency: string) {
      const name = this.categoryService.curreciesList.filter(I => I.code === currency);
      return name[0].name;
    }
}
