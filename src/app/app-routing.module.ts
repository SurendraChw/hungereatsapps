import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'orderdetails',
    loadChildren: () => import('./pages/orderdetails/orderdetails.module').then( m => m.OrderdetailsPageModule)
  },
  {
    path: 'orderhistory',
    loadChildren: () => import('./pages/orderhistory/orderhistory.module').then( m => m.OrderhistoryPageModule)
  },
  {
    path: 'orderhistorydetails',
    loadChildren: () => import('./pages/orderhistorydetails/orderhistorydetails.module').then( m => m.OrderhistorydetailsPageModule)
  },  {
    path: 'nointernet',
    loadChildren: () => import('./pages/nointernet/nointernet.module').then( m => m.NointernetPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
