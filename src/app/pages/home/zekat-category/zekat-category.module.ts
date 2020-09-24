import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ZekatCategoryPageRoutingModule } from './zekat-category-routing.module';

import { ZekatCategoryPage } from './zekat-category.page';
import {ComponentModule} from "../../../component/component.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ZekatCategoryPageRoutingModule,
    ComponentModule
  ],
  declarations: [ZekatCategoryPage],
  entryComponents:[]
})
export class ZekatCategoryPageModule {}
