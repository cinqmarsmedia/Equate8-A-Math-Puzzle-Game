import { Injectable, NgZone } from '@angular/core';
import { AnimationItem } from 'lottie-web';

@Injectable({
  providedIn: 'root'
})
export class AnimationOptimizerService {
  private animationRegistry: Map<string, AnimationItem> = new Map();
  private visibleAnimations: Set<string> = new Set();
  private pendingAnimations: Set<string> = new Set();
  private rafId: number | null = null;
  private isProcessing = false;

  constructor(private ngZone: NgZone) {
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        this.handleVisibilityChange();
      });
    }

    if (typeof window !== 'undefined') {
      this.setupPerformanceMonitoring();
    }
  }

  registerAnimation(id: string, animation: AnimationItem): void {
    this.animationRegistry.set(id, animation);
  }

  unregisterAnimation(id: string): void {
    this.animationRegistry.delete(id);
    this.visibleAnimations.delete(id);
    this.pendingAnimations.delete(id);
  }

  markVisible(id: string): void {
    if (!this.visibleAnimations.has(id)) {
      this.visibleAnimations.add(id);
      this.pendingAnimations.add(id);
      this.scheduleAnimationUpdate();
    }
  }

  markHidden(id: string): void {
    if (this.visibleAnimations.has(id)) {
      this.visibleAnimations.delete(id);
      this.pendingAnimations.add(id);
      this.scheduleAnimationUpdate();
    }
  }

  pauseAllAnimations(): void {
    this.ngZone.runOutsideAngular(() => {
      this.animationRegistry.forEach(animation => {
        if (animation.isLoaded) {
          animation.pause();
        }
      });
    });
  }

  stopAllAnimations(): void {
    this.ngZone.runOutsideAngular(() => {
      this.animationRegistry.forEach(animation => {
        if (animation.isLoaded) {
          animation.stop();
        }
      });
    });
  }

  resumeVisibleAnimations(): void {
    this.ngZone.runOutsideAngular(() => {
      this.visibleAnimations.forEach(id => {
        const animation = this.animationRegistry.get(id);
        if (animation && animation.isLoaded) {
          animation.play();
        }
      });
    });
  }

  private handleVisibilityChange(): void {
    if (document.hidden) {
      this.pauseAllAnimations();
    } else {
      this.resumeVisibleAnimations();
    }
  }
  private scheduleAnimationUpdate(): void {
    if (this.rafId === null && !this.isProcessing) {
      this.ngZone.runOutsideAngular(() => {
        this.rafId = requestAnimationFrame(() => {
          this.processPendingAnimations();
        });
      });
    }
  }

  public processPendingAnimations(): void {
    this.rafId = null;
    this.isProcessing = true;

    this.ngZone.runOutsideAngular(() => {
      this.pendingAnimations.forEach(id => {
        const animation = this.animationRegistry.get(id);
        if (animation && animation.isLoaded) {
          if (this.visibleAnimations.has(id)) {
            animation.play();
          } else {
            animation.pause();
          }
        }
      });

      this.pendingAnimations.clear();
      this.isProcessing = false;

      if (this.pendingAnimations.size > 0) {
        this.scheduleAnimationUpdate();
      }
    });
  }

  private setupPerformanceMonitoring(): void {
    let lastTime = performance.now();
    let frames = 0;
    let lowFpsCounter = 0;

    const checkPerformance = () => {
      frames++;
      const currentTime = performance.now();
      const elapsedTime = currentTime - lastTime;

      if (elapsedTime >= 1000) {
        const fps = Math.round((frames * 1000) / elapsedTime);
        frames = 0;
        lastTime = currentTime;

        if (fps < 30) {
          lowFpsCounter++;
          if (lowFpsCounter >= 3) {
            this.reduceLottieQuality();
            lowFpsCounter = 0;
          }
        } else {
          lowFpsCounter = Math.max(0, lowFpsCounter - 1);
        }
      }

      requestAnimationFrame(checkPerformance);
    };

    requestAnimationFrame(checkPerformance);
  }

  private reduceLottieQuality(): void {
    this.animationRegistry.forEach(animation => {
      if (animation.isLoaded && animation.renderer && animation.renderer.svgElement) {
        const svgElement = animation.renderer.svgElement as SVGElement;
        
        svgElement.style.imageRendering = 'optimizeSpeed';
        svgElement.style.shapeRendering = 'optimizeSpeed';
        
        if (animation.setSpeed) {
          animation.setSpeed(0.8); 
        }
      }
    });
  }
} 