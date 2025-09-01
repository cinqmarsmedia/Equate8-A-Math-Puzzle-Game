import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwappableDirective } from './swappable.directive';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [SwappableDirective],
    exports: [SwappableDirective]
})
export class SwappableModule { }