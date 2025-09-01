import { Directive, ElementRef, Output, EventEmitter, OnInit, OnDestroy, NgZone, Input, Renderer2, OnChanges, SimpleChanges } from '@angular/core';
import Hammer from 'hammerjs';

@Directive({
    selector: '[touchSwappable]'
})
export class TouchDragDropDirective implements OnInit, OnDestroy, OnChanges {
    @Input('touchSwappable') enabled: boolean = true;
    @Input() swapIndex!: number;
    @Input() hideOriginalOnDrag: boolean = true;
    
    @Output() touchLongPress = new EventEmitter<void>();
    @Output() swap = new EventEmitter<{ from: number, to: number }>();
    @Output() swapStart = new EventEmitter<{ from: number }>();
    @Output() swapPreview = new EventEmitter<{ from: number, to: number }>();

    private hammerManager: HammerManager;
    private cloneElement: HTMLElement | null = null;
    private longPressFired: boolean = false;
    private currentTouchSession: number = 0;
    private longPressTouchSession: number = -1;
    private touchActive: boolean = false;
    
    private readonly SWAP_CHECK_THRESHOLD = 100;
    private lastSwapCheck = 0;

    constructor(
        private el: ElementRef, 
        private ngZone: NgZone,
        private renderer: Renderer2
    ) {}

    ngOnInit() {

        if (this.swapIndex !== undefined) {
            this.renderer.setAttribute(this.el.nativeElement, 'data-swap-index', this.swapIndex.toString());
        }

        this.ngZone.runOutsideAngular(() => {
            this.hammerManager = new Hammer(this.el.nativeElement);
            
            this.hammerManager.get('press').set({ time: 500 });
            this.hammerManager.get('pan').set({ direction: Hammer.DIRECTION_ALL });

            this.hammerManager.on('touchstart', () => {
                this.currentTouchSession++;
                this.touchActive = true;
            });
            
            this.hammerManager.on('press', () => this.handlePress());
            this.hammerManager.on('panstart', (event) => this.handlePanStart(event));
            this.hammerManager.on('panmove', (event) => this.handlePanMove(event));
            this.hammerManager.on('panend', (event) => this.handlePanEnd(event));
            
            // Reset flags on touch end
            this.hammerManager.on('touchend', () => {
                this.longPressFired = false;
                this.longPressTouchSession = -1;
                this.touchActive = false;
            });
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['swapIndex'] && this.swapIndex !== undefined) {
            this.renderer.setAttribute(this.el.nativeElement, 'data-swap-index', this.swapIndex.toString());
        }
        
        if (changes['enabled'] && this.enabled && !this.touchActive) {
            this.longPressTouchSession = -1;
            this.longPressFired = false;
        }
    }

    ngOnDestroy() {
        if (this.hammerManager) {
            this.hammerManager.destroy();
        }
        this.cleanupClone();
    }

    private handlePress() {
        this.longPressFired = true;
        this.longPressTouchSession = this.currentTouchSession;
        this.ngZone.run(() => {
            this.touchLongPress.emit();
        });
    }

    private handlePanStart(event: HammerInput) {
        if (!this.enabled || this.longPressTouchSession === this.currentTouchSession) return;
        
        this.ngZone.run(() => {
            this.swapStart.emit({ from: this.swapIndex });
            this.cloneElement = this.createFinalClone();
            if (this.hideOriginalOnDrag) {
                this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
            }
            this.updateClonePosition(event.center.x, event.center.y);
        });
    }

    private handlePanMove(event: HammerInput) {
        if (!this.cloneElement || this.longPressTouchSession === this.currentTouchSession) return;
        this.updateClonePosition(event.center.x, event.center.y);

        const now = Date.now();
        if (now - this.lastSwapCheck >= this.SWAP_CHECK_THRESHOLD) {
            this.lastSwapCheck = now;
            this.checkForSwap(event.center.x, event.center.y);
        }
    }

    private handlePanEnd(event: HammerInput) {
        if (!this.cloneElement || this.longPressTouchSession === this.currentTouchSession) {
            this.cleanupClone();
            return;
        }

        // Find the element at the drop position
        this.renderer.setStyle(this.cloneElement, 'display', 'none');
        const endElement = document.elementFromPoint(event.center.x, event.center.y);
        this.renderer.setStyle(this.cloneElement, 'display', 'flex');

        const targetElement = this.findSwappableTarget(endElement);

        if (targetElement) {
            const targetIndex = targetElement.getAttribute('data-swap-index');
            if (targetIndex) {
                this.ngZone.run(() => this.swap.emit({ from: this.swapIndex, to: parseInt(targetIndex, 10) }));
            }
        }
        this.cleanupClone();
    }
    
    private cleanupClone() {
        if (this.cloneElement) {
            this.cloneElement.remove();
            this.cloneElement = null;
        }
        if (this.hideOriginalOnDrag) {
            this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
        }
    }
    
    private findSwappableTarget(element: Element | null): HTMLElement | null {
        let current = element;
        while (current) {
            if (current instanceof HTMLElement && current.hasAttribute('data-swap-index')) {
                return current;
            }
            current = current.parentElement;
        }
        return null;
    }

    private updateClonePosition(clientX: number, clientY: number) {
        if (!this.cloneElement) return;
        const rect = this.cloneElement.getBoundingClientRect();
        const x = clientX - (rect.width / 2);
        const y = clientY - (rect.height / 2);
        this.cloneElement.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
    
    private checkForSwap(clientX: number, clientY: number) {
        if (!this.cloneElement) return;
        this.cloneElement.style.display = 'none';
        const targetElement = this.findSwappableTarget(document.elementFromPoint(clientX, clientY));
        this.cloneElement.style.display = 'flex';

        if (targetElement) {
            const targetIndex = targetElement.getAttribute('data-swap-index');
            if (targetIndex) {
                this.ngZone.run(() => this.swapPreview.emit({ from: this.swapIndex, to: parseInt(targetIndex, 10) }));
            }
        }
    }

    private createFinalClone(): HTMLElement {
        const originalEl = this.el.nativeElement;
        const rect = originalEl.getBoundingClientRect();
        
        const clone = this.renderer.createElement('div');

        clone.className = originalEl.className;
        
        const lottieElements = originalEl.querySelectorAll('ng-lottie');
        if (lottieElements.length > 0) {
            lottieElements.forEach(lottieEl => {
                const lottieClone = lottieEl.cloneNode(true) as HTMLElement;
                lottieClone.className = lottieEl.className;
                lottieClone.style.cssText = (lottieEl as HTMLElement).style.cssText;
                this.renderer.appendChild(clone, lottieClone);
            });
        } else {
            clone.innerHTML = originalEl.innerHTML;
        }

        clone.style.setProperty('position', 'fixed', 'important');
        clone.style.setProperty('z-index', '999999', 'important');
        clone.style.setProperty('pointer-events', 'none', 'important');
        clone.style.setProperty('left', '0px', 'important');
        clone.style.setProperty('top', '0px', 'important');
        clone.style.setProperty('width', `${rect.width}px`, 'important');
        clone.style.setProperty('height', `${rect.height}px`, 'important');
        clone.style.setProperty('opacity', '0.8', 'important');
        clone.style.setProperty('margin', '0', 'important');
        clone.style.setProperty('padding', '0', 'important');
        
        clone.style.setProperty('display', 'flex', 'important');
        clone.style.setProperty('justify-content', 'center', 'important');
        clone.style.setProperty('align-items', 'center', 'important');
        clone.style.setProperty('will-change', 'transform');

        this.renderer.appendChild(document.body, clone);
        return clone;
    }
}