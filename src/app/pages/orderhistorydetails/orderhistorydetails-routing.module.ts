import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderhistorydetailsPage } from './orderhistorydetails.page';

const routes: Routes = [
  {
    path: '',
    component: OrderhistorydetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderhistorydetailsPageRoutingModule {}
