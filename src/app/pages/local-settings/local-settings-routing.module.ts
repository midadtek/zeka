import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocalSettingsPage } from './local-settings.page';

const routes: Routes = [
  {
    path: '',
    component: LocalSettingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocalSettingsPageRoutingModule {}
