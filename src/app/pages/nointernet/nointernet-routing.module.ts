import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NointernetPage } from './nointernet.page';

const routes: Routes = [
  {
    path: '',
    component: NointernetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NointernetPageRoutingModule {}
