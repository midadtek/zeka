import {Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category_operationsService } from 'src/app/services/category_operations.service';
import {DbServiceService} from 'src/app/services/db-service.service';
import {AnimationController, ModalController} from '@ionic/angular';
import { CharityComponent } from 'src/app/component/charity/charity.component';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;
import { LoadingController } from '@ionic/angular';
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {AuthService} from "../../services/auth.service";
import {BannerComponent} from "../../component/banner/banner.component";
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
    images = [
        '../assets/images/banner-1.jpg',
        '../assets/images/banner-2.jpg',
        '../assets/images/banner-3.jpg',
        '../assets/images/banner-4.jpg',
        '../assets/images/banner-5.jpg',
        '../assets/images/banner-6.jpg',
        '../assets/images/banner-7.jpg',
    ];
  id: number
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

    lastOperation: string | any[];
    theFinalTotal: number;
    private sub: Subscription;
    private allRates: any;
    public newBase :string;

  constructor(private platform: Platform,private auth:AuthService,private animationCtrl: AnimationController, private db: DbServiceService, private http: HttpClient, private modalCtrl: ModalController, private category: Category_operationsService, public loadingController: LoadingController,private route: ActivatedRoute) {
      this.sub = this.route.params.subscribe(params => {
          this.id = +params.id
      })
  }

 async ngOnInit() {
     this.getItem();
     this.category.getAllCharities();
     const loading = await this.loadingController.create({
         cssClass: 'my-custom-class',
         duration:1000,
         mode: 'ios',
         spinner: 'circular',
     });
     await loading.present();
 }
    ionViewWillEnter() {

        if(this.platform.is("cordova") || this.platform.is("capacitor")){
            this.db.getoperations().subscribe(data => {
                this.lastOperation = data;
            })

        }else{
            this.category.getAllOperations().subscribe(data=> {
                this.lastOperation = data;
            })
            // this.sub = this.route.params.subscribe(params => {
            //     this.id = +params.id
            // })
        }
        this.category.getObject().then(_ => {
            this.newBase =  this.category.currencyCode
            this.goldPrice = +this.allRates.rates.gold * +this.allRates.rates.rates[this.newBase]
            this.silverPrice = this.allRates.rates.silver * this.allRates.rates.rates[this.newBase]
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
        })
    }
ionViewDidEnter () {
             this.goldTotalPrice = 0;
             this.silverTotalPrice = 0;
             this.moneyTotalPrice = 0;
             this.tradeTotalPrice = 0;
             this.stockTotalPrice = 0;
             this.mutualTotalPrice = 0;
             this.totalAmount = 0;
    setTimeout(_=>{
        for (let i = 0; i < this.lastOperation.length; i++) {
            if (this.lastOperation[i].category_id === 1) {
                this.goldTotalPrice += (+this.lastOperation[i].d_val_1 + +this.lastOperation[i].d_val_2 * 0.875 + +this.lastOperation[i].d_val_3 * 0.75) * +this.goldPrice;
            } else if (this.lastOperation[i].category_id === 2) {

                if (this.lastOperation[i].currency_type !== this.newBase) {
                    this.moneyTotalPrice += this.lastOperation[i].d_val_1 * (1 / this.allRates.rates.rates[this.lastOperation[i].currency_type]) * this.allRates.rates.rates[this.newBase];
                }
                if (this.lastOperation[i].currency_type == this.newBase) {
                    this.moneyTotalPrice += +this.lastOperation[i].d_val_1;
                }
            } else if (this.lastOperation[i].category_id === 3) {
                this.tradeTotalPrice += +this.lastOperation[i].d_val_1
            } else if (this.lastOperation[i].category_id === 4) {
                this.silverTotalPrice += this.lastOperation[i].d_val_1 * this.silverPrice;
            } else if (this.lastOperation[i].category_id === 5) {
                this.stockTotalPrice += +this.lastOperation[i].d_val_1 * +this.lastOperation[i].d_val_2;
            } else if (this.lastOperation[i].category_id === 6) {
                this.mutualTotalPrice += +this.lastOperation[i].d_val_1 * +this.lastOperation[i].d_val_2;
            }
        }
    }, 500)

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
                    .play()
                }, 2000)

}
    async getItem() {
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
    ionViewWillLeave () {
     this.id = -1;
     this.sub.unsubscribe();
}

    async openBanner(bannerIndex) {
        const modal = await this.modalCtrl.create({
            component: BannerComponent,
            componentProps: {
                banners: this.images,
                index: bannerIndex
            }
        });
        modal.present();
    }
}
//
