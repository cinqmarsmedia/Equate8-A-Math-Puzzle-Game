import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LottieModule } from 'ngx-lottie';
import { HomePageRoutingModule } from './home-routing.module';
import { OrdinalDatePipe } from '../../OrdinalDatePipe';
import { ParticletextComponent } from '../particletext/particletext.component';
import { SwappableModule } from '../swappable.module';
import { TouchDragModule } from '../touch-drag.module';
import { LottieOptimizedModule } from '../lottie-optimized/lottie-optimized.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SwappableModule,
    LottieModule,
    TouchDragModule,
    LottieOptimizedModule
  ],
  declarations: [HomePage, ParticletextComponent, OrdinalDatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePageModule {}
