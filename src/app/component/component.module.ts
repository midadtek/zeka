import {NgModule} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {FooterComponent} from "./footer/footer.component";
import { PopoverComponent } from './popover/popover.component';
import { CountryPopoverComponent } from './country-popover/country-popover.component';
import { CharityComponent } from './charity/charity.component';
import {BannerComponent} from "./banner/banner.component";

@NgModule({
    declarations: [FooterComponent, PopoverComponent, CountryPopoverComponent, CharityComponent, BannerComponent],
    imports: [
        IonicModule,
        RouterModule,
        FormsModule,
        CommonModule,
    ],
    exports: [FooterComponent, PopoverComponent, CountryPopoverComponent, CharityComponent, BannerComponent]
})

export class ComponentModule {


}
