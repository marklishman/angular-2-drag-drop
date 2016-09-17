import { Component, ViewChild, ElementRef, AfterViewInit, Renderer } from '@angular/core';
import { Observable } from "rxjs/Rx";

const containerSize:number = 400;
const draggableHeight:number = 50;
const draggableWidth:number = 100;

@Component({
    selector: 'drag-drop',
    template: `<div>
                    <div #container class="container">
                        <div #draggable class="draggable"></div>
                    </div>
               </div>`,
    styles: [`
        .container {
            height: ${containerSize}px;
            width: ${containerSize}px;
            background-color: lightgray;
        }
        .draggable {
            height: ${draggableHeight}px;
            width: ${draggableWidth}px;
            background-color: green;
            position: absolute;
            cursor: move;
        }
    `]
})
export class DragDropComponent implements AfterViewInit  {

    @ViewChild('container') containerElement: ElementRef;
    @ViewChild('draggable') draggableElement: ElementRef;

    constructor(private renderer: Renderer) {

    }

    ngAfterViewInit():any {

        const container = this.containerElement.nativeElement;
        const draggable = this.draggableElement.nativeElement;

        const mouseDown$ = Observable.fromEvent(draggable, "mousedown");
        const mouseMove$ = Observable.fromEvent(container, "mousemove");
        const mouseUp$ = Observable.fromEvent(container, "mouseup");

        const drag$ = mouseDown$
            .map(() => mouseMove$
                .filter(event => boundaryCheck(event))
                .takeUntil(mouseUp$))
            .concatAll();

        drag$.subscribe( (event: MouseEvent) => {
                this.renderer.setElementStyle(draggable, 'left', event.clientX - (draggableWidth / 2) + "px");
                this.renderer.setElementStyle(draggable, 'top', event.clientY - (draggableHeight / 2) + "px");
            },
            error => console.log('error')
        );

        function boundaryCheck(event) {

            const leftBoundary = container.offsetLeft + (draggableWidth / 2);
            const rightBoundary = container.clientWidth + container.offsetLeft - (draggableWidth / 2);
            const topBoundary = container.offsetTop + (draggableHeight / 2);
            const bottomBoundary = container.clientWidth + container.offsetTop - (draggableHeight / 2);

            return event.clientX > leftBoundary &&
                event.clientX < rightBoundary &&
                event.clientY > topBoundary &&
                event.clientY < bottomBoundary;
        }
    }

}