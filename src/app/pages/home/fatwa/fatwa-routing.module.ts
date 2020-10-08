import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FatwaPage } from './fatwa.page';

const routes: Routes = [
  {
    path: '',
    component: FatwaPage
  },
  // {
  //   path: 'fatwa-list',
  //   loadChildren: () => import('./fatwa-list/fatwa-list.module').then( m => m.FatwaListPageModule)
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FatwaPageRoutingModule {}
