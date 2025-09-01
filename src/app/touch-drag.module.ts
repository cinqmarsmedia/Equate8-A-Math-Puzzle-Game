import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TouchDragDropDirective } from './touch-drag.directive';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [TouchDragDropDirective],
    exports: [TouchDragDropDirective]
})
export class TouchDragModule { }