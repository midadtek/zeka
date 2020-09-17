import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {InitialGuard} from "./services/initial.guard";


const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
    canLoad:[InitialGuard],
  },
  {
    path:'home/:id',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),

  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'zekat-category',
    children: [{
      path: '',
      loadChildren: () => import('./pages/zekat-category/zekat-category.module').then(m => m.ZekatCategoryPageModule)
    },
      {
        path: ':id',

        loadChildren: () => import('./pages/zekat-category/added-values/added-values.module').then(m => m.AddedValuesPageModule)

      }
    ],
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then( m => m.AuthPageModule)
  },
  {
    path: 'wallet',
    loadChildren: () => import('./pages/wallet/wallet.module').then( m => m.WalletPageModule)
  },
  {
    path: 'contact',
    loadChildren: () => import('./pages/contact/contact.module').then( m => m.ContactPageModule)
  },
  {
    path: 'fatwa',
    loadChildren: () => import('./pages/fatwa/fatwa.module').then( m => m.FatwaPageModule)
  },
  {
    path: 'add-new-value',
    loadChildren: () => import('./pages/add-new-value/add-new-value.module').then( m => m.AddNewValuePageModule)
  },
  {
    path: 'setting',
    loadChildren: () => import('./pages/setting/setting.module').then( m => m.SettingPageModule)
  },
  {
    path: 'local-settings',
    loadChildren: () => import('./pages/local-settings/local-settings.module').then( m => m.LocalSettingsPageModule)
  },
  {
    path: 'setting',
    loadChildren: () => import('./pages/setting/setting.module').then( m => m.SettingPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
