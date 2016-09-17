import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { DragDropComponent }   from './drag-drop.component';

@NgModule({
    imports:      [BrowserModule],
    declarations: [DragDropComponent],
    bootstrap:    [DragDropComponent]
})
export class AppModule { }