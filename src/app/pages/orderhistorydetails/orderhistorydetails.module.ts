import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderhistorydetailsPageRoutingModule } from './orderhistorydetails-routing.module';

import { OrderhistorydetailsPage } from './orderhistorydetails.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderhistorydetailsPageRoutingModule
  ],
  declarations: [OrderhistorydetailsPage]
})
export class OrderhistorydetailsPageModule {}
