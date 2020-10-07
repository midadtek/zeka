import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { FirstRunPageRoutingModule } from './first-run-routing.module';

import { FirstRunPage } from './first-run.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    IonicModule,
    FirstRunPageRoutingModule
  ],
  declarations: [FirstRunPage]
})
export class FirstRunPageModule {}
