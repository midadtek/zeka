import {NgModule} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

import { CharityComponent } from './charity/charity.component';
import {BannerComponent} from "./banner/banner.component";

@NgModule({
    declarations: [CharityComponent, BannerComponent],
    imports: [
        IonicModule,
        RouterModule,
        FormsModule,
        CommonModule,
    ],
    exports: [CharityComponent, BannerComponent]
})

export class ComponentModule {


}
