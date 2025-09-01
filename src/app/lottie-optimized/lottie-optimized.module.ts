import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LottieModule } from 'ngx-lottie';
import { LottieOptimizedComponent } from './lottie-optimized.component';

@NgModule({
  declarations: [
    LottieOptimizedComponent
  ],
  imports: [
    CommonModule,
    LottieModule
  ],
  exports: [
    LottieOptimizedComponent
  ]
})
export class LottieOptimizedModule { } 