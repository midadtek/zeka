import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FatwaDetailPageRoutingModule } from './fatwa-detail-routing.module';

import { FatwaDetailPage } from './fatwa-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FatwaDetailPageRoutingModule
  ],
  declarations: [FatwaDetailPage]
})
export class FatwaDetailPageModule {}
