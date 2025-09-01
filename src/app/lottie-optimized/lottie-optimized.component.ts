import { Component, OnInit, Input, ElementRef, OnDestroy, NgZone } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-lottie-optimized',
  template: `
    <ng-lottie
      [width]="width"
      [styles]="styles"
      [options]="internalOptions"
      (animationCreated)="onAnimationCreated($event)">
    </ng-lottie>
  `,
  styles: [`
    :host {
      display: block;
      transform: translateZ(0);
      backface-visibility: hidden;
      will-change: transform;
      contain: layout style paint;
    }
  `]
})
export class LottieOptimizedComponent implements OnInit, OnDestroy {
  @Input() width: string;
  @Input() styles: any = {};
  @Input() options: AnimationOptions;
  @Input() customStyle: string;
  @Input() animationId: string;
  
  internalOptions: AnimationOptions;
  animationItem: AnimationItem;
  private observer: IntersectionObserver;
  private isVisible = false;
  private isLoaded = false;
  
  constructor(
    private el: ElementRef,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.setupIntersectionObserver();
    
    this.internalOptions = {
      ...this.options,
      renderer: 'svg',
      rendererSettings: {
        ...this.options.rendererSettings,
        progressiveLoad: true,
        imagePreserveAspectRatio: 'xMidYMid meet',
        preserveAspectRatio: 'xMidYMid meet'
      }
    };
  }

  ngOnDestroy() {
    // Cleanup resources
    if (this.observer) {
      this.observer.disconnect();
    }
    
    if (this.animationItem) {
      this.animationItem.destroy();
    }
  }

  onAnimationCreated(animation: AnimationItem) {
    this.animationItem = animation;
    this.isLoaded = true;
    
    if (!this.isVisible) {
      this.animationItem.pause();
    }
    
    if (!this.options.loop) {
      this.animationItem.addEventListener('complete', () => {
        this.animationItem.goToAndStop(this.animationItem.totalFrames - 1, true);
      });
    }
  }

  private setupIntersectionObserver() {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        this.ngZone.run(() => {
          const isVisible = entries[0].isIntersecting;
          if (isVisible !== this.isVisible) {
            this.isVisible = isVisible;
            this.handleVisibilityChange();
          }
        });
      }, {
        root: null, 
        threshold: 0.1 
      });
      
      this.observer.observe(this.el.nativeElement);
    } else {
      this.isVisible = true;
    }
  }

  private handleVisibilityChange() {
    if (!this.isLoaded || !this.animationItem) return;
    
    if (this.isVisible) {
      this.animationItem.play();
    } else {
      this.animationItem.pause();
    }
  }
} 