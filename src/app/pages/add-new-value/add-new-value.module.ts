import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddNewValuePageRoutingModule } from './add-new-value-routing.module';

import { AddNewValuePage } from './add-new-value.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddNewValuePageRoutingModule
  ],
  declarations: [AddNewValuePage]
})
export class AddNewValuePageModule {}
