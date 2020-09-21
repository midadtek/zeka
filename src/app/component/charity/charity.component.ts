import {Component, Input, OnInit} from '@angular/core';
import {LoadingController, ModalController, ToastController} from '@ionic/angular';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import {Category_operationsService, charity, charityBankInfo} from "../../services/category_operations.service";
import {Router} from "@angular/router";
@Component({
  selector: 'app-charity',
  templateUrl: './charity.component.html',
  styleUrls: ['./charity.component.scss'],
})
export class CharityComponent implements OnInit {
  public charityBankInfo: charityBankInfo[] =[{
    EUR_IBAN: null,
    LOCAL_IBAN: "TR380001002457887576915003",
    USD_IBAN: "TR110001002457887576915004",
    account_name: "ŞAM HAYIR VE YARDIMLAŞMA DERNEĞI",
    account_number: 88757691,
    bank_name: "ZIRAAT BANKASI",
    branch_name: "BASAKSEHIR-ISTANBUL",
    charity_id: 1,
    id: 1,
    swift_code: "TCZBTR2A",
  }, {
    EUR_IBAN: null,
    LOCAL_IBAN: "TR260006400000110700858879",
    USD_IBAN: "TR070006400000210703284895",
    account_name: "ŞAM HAYIR VE YARDIMLAŞMA DERNEĞI",
    account_number: 858879,
    bank_name: "IS BANKASI",
    branch_name: "BASAKSEHIR-ISTANBUL",
    charity_id: 1,
    id: 2,
    swift_code: "ISBKTRIS",
  }]

  constructor(private router: Router,private toast: ToastController, private clipboard: Clipboard, private modalCtrl: ModalController, private category: Category_operationsService,private loadingCtrl:LoadingController) { }
@Input() willPayValue: number;
@Input() currency: string;
charities: charity[];
selectedCharity: string;
singleCharity: charity = {
  charity_address: "اسطنبول باشاك شهير",
  charity_country: "تركيا",
  charity_description: "ﻣﺆﺳﺴﺔ أهلية ﺗﻘﺪم المساعدات الإنسانية ، وﺗﻨﻔﺬ المشروعات المجتمعية التنموية حيث نسعى على تخفيف آﻻم المهجرين و النازحين ﻣﻦ ﺧﻼل المساعدات الانسانية، ورﻓﻊ ﻗﺪرات اﻷﻓﺮاد و المجتمع ﻣﻦ ﺧﻼل تقديم المشروعات التنموية",
  charity_name: "جمعية شام الخير",
  charity_phone: "+90 (552) 530 12 00",
  charity_website: "http://shamalkher.org/",
  facebook_link: "https://www.facebook.com/samhayir",
  id: 1,
  instagram_link: "https://www.instagram.com/shamalkher/",
  payment_link: null,
  twitter_link: "https://twitter.com/shamalhayir",
  youtube_link: "https://www.youtube.com/channel/UCCQuj-q38pSqoObzrg2-__A",
}
  ngOnInit() {
    this.charities = this.category.charities;
  }

  async copy(row) {
    await this.clipboard.copy(row);
    const toast = await this.toast.create({
      message:'تم النسخ',
      duration:1500,
    })
    await toast.present();
  }
  async onSelect(ev) {
    console.log(ev)
    this.selectedCharity = ev;
    let tempCharity = this.charities.filter(ch => {
      return ch.id === +this.selectedCharity
    });
    this.singleCharity = tempCharity[0]
    console.log(this.singleCharity)
    this.category.getAllCharitiesBankInfo(this.singleCharity.id).subscribe(resData => {
      this.charityBankInfo = resData
      console.log(this.charityBankInfo)
    })
    const loading = await this.loadingCtrl.create({
      message: 'يرجى الانتظار',
      mode: 'ios',
      duration:1000,
      spinner: 'circular',
    })

    await loading.present();
    console.log(this.singleCharity)
  }

  openLink (link) {
    window.open(link, '_system')
  }

  async onModalDismiss() {
   await this.modalCtrl.dismiss()
    await this.router.navigateByUrl('/home')

  }
}
