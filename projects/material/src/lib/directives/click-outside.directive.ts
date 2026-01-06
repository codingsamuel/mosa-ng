import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[clickOutside]',
})
export class ClickOutsideDirective {

    @Output()
    public clickOutside: EventEmitter<[ HTMLElement, HTMLElement ]> = new EventEmitter<[ HTMLElement, HTMLElement ]>();

    @Input()
    public enableWhiteListing: boolean = false;

    constructor(
        private readonly elementRef: ElementRef,
    ) {
    }

    @HostListener('document:click', [ '$event.target' ])
    public onClick(targetElement: EventTarget | null): void {
        const clickedInside = this.elementRef.nativeElement.contains(targetElement);
        const whiteListedClass = 'whitelisted';
        if (clickedInside || !targetElement) {
            return;
        }

        const htmlElement: HTMLElement = targetElement as HTMLElement;
        if (this.enableWhiteListing) {
            const isWhiteListed = htmlElement.classList.contains(whiteListedClass)
                || ClickOutsideDirective.getClosest(htmlElement, whiteListedClass)
                || ClickOutsideDirective.getClosest(htmlElement, 'cdk-overlay-container');
            if (!isWhiteListed) {
                this.clickOutside.emit([ this.elementRef.nativeElement, htmlElement ]);
            }
        } else {
            this.clickOutside.emit([ this.elementRef.nativeElement, htmlElement ]);
        }
    }

    private static getClosest(el: HTMLElement | null, selector: string): HTMLElement | null {
        while (el) {
            if (el.classList.contains(selector)) {
                return el;
            }
            el = el.parentElement;
        }
        return null;
    }

}
