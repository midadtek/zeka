import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocalSettingsPageRoutingModule } from './local-settings-routing.module';

import { LocalSettingsPage } from './local-settings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocalSettingsPageRoutingModule
  ],
  declarations: [LocalSettingsPage]
})
export class LocalSettingsPageModule {}
