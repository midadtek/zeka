import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FatwaDetailsPageRoutingModule } from './fatwa-list-routing.module';

import { FatwaListPage } from './fatwa-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FatwaDetailsPageRoutingModule
  ],
  declarations: [FatwaListPage]
})
export class FatwaListPageModule {}
