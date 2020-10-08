import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddNewValuePage } from './add-new-value.page';

const routes: Routes = [
  {
    path: '',
    component: AddNewValuePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddNewValuePageRoutingModule {}
