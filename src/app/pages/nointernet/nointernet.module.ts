import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NointernetPageRoutingModule } from './nointernet-routing.module';

import { NointernetPage } from './nointernet.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NointernetPageRoutingModule
  ],
  declarations: [NointernetPage]
})
export class NointernetPageModule {}
