import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddedValuesPageRoutingModule } from './added-values-routing.module';

import { AddedValuesPage } from './added-values.page';
import {ComponentModule} from "../../../../component/component.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddedValuesPageRoutingModule,
    ComponentModule
  ],
  declarations: [AddedValuesPage, ]
})
export class AddedValuesPageModule {}
