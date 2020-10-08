import {Component, Input, OnInit} from '@angular/core';
import {LoadingController, ModalController, ToastController} from '@ionic/angular';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import {Category_operationsService} from '../../services/category_operations.service';
import {Router} from '@angular/router';
import { Charity, CharityBankInfo } from 'src/app/services/interfaces';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-charity',
  templateUrl: './charity.component.html',
  styleUrls: ['./charity.component.scss'],
})
export class CharityComponent implements OnInit {
  public charityBankInfo: CharityBankInfo[];
  constructor(private router: Router, private toast: ToastController, private clipboard: Clipboard,
              private modalCtrl: ModalController, private categoryService: Category_operationsService,
              private loadingCtrl: LoadingController) { }
@Input() willPayValue: number;
@Input() currency: string;
charities: Charity[];
selectedCharity: string;
singleCharity: Charity;
locenvironment: { production: boolean; is_local: boolean; base_url: string; };

  ngOnInit() {
    this.locenvironment = environment;
    this.charities = this.categoryService.charities;
    console.log(this.charities);
    for (let ch = 0 ; ch < this.charities.length; ch++){
      if(this.charities[ch].is_default) {
        this.singleCharity = this.charities[ch];
        break;
      }
    }
  }

  ionViewDidEnter(){
    this.categoryService.getAllCharitiesBankInfo(this.singleCharity.id).subscribe(resData => {
      this.charityBankInfo = resData;
    });
  }
  async copy(row) {
    await this.clipboard.copy(row);
    const toast = await this.toast.create({
      message: 'تم النسخ',
      duration: 1500,
    });
    await toast.present();
  }
  async onSelect(ev) {
    this.selectedCharity = ev;
    const tempCharity = this.charities.filter(ch => {
      return ch.id === +this.selectedCharity;
    });
    this.singleCharity = tempCharity[0];
    this.categoryService.getAllCharitiesBankInfo(this.singleCharity.id).subscribe(resData => {
      this.charityBankInfo = resData;
    });
    const loading = await this.loadingCtrl.create({
      message: 'يرجى الانتظار',
      mode: 'ios',
      duration: 1000,
      spinner: 'circular',
    });
    await loading.present();
  }
  openLink(link) {
    window.open(link, '_system');
  }
  async onModalDismiss() {
   await this.modalCtrl.dismiss();
   await this.router.navigateByUrl('/home');
  }
}
