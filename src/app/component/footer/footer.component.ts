import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  constructor(public popoverController: PopoverController) { }
  ngOnInit() {}
  // async presentCurrencyPopover(ev: any) {
  //   const currencyPopover = await this.popoverController.create({
  //     component: PopoverComponent,
  //     cssClass: 'my-custom-class popover-content',
  //     event: ev,
  //     translucent: true
  //   });
  //   return await currencyPopover.present();
  // }
  // async presentCountryPopover(ev: any) {
  //   const countryPopover = await this.popoverController.create({
  //     component: CountryPopoverComponent,
  //     cssClass: 'my-custom-class popover-content',
  //     event: ev,
  //     translucent: true
  //   });
  //   return await countryPopover.present();
  // }

  pickedDate(date) {
    console.log(date);
  }
}
