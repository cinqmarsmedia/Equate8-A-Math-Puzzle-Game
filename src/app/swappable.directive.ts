import { Directive, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[swappable]'
})
export class SwappableDirective implements OnInit {
  @Input() swapIndex!: number;
  @Input() set swappable(value: boolean) {
    this.renderer.setAttribute(this.el.nativeElement, 'draggable', value.toString());
  }
  @Input() dragImage?: string | HTMLElement;
  @Input() dragText?: string;
  @Input() dragTextStyle?: { [key: string]: string };
  @Input() hideOriginalOnDrag: boolean = false; 
  @Output() swap = new EventEmitter<{ from: number, to: number }>();
  @Output() swapStart = new EventEmitter<{ from: number }>();
  @Output() swapPreview = new EventEmitter<{ from: number, to: number }>();

  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  ngOnInit() {
  }

  @HostListener('dragstart', ['$event']) async onDragStart(event: DragEvent) {
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', this.swapIndex.toString());
      event.dataTransfer.effectAllowed = 'move';

      if (this.dragImage) {
        if (typeof this.dragImage === 'string') {
          const img = new Image();
          img.src = this.dragImage;
          img.onload = () => {
            event.dataTransfer!.setDragImage(img, img.width / 2, img.height / 2);
          };
        } else {
          const rect = this.dragImage.getBoundingClientRect();
          event.dataTransfer.setDragImage(this.dragImage, rect.width / 2, rect.height / 2);
        }
      } else if (this.dragText || this.dragTextStyle) {
        const text = this.dragText || this.el.nativeElement.innerText;
        const dragTextElement = this.createDragTextElement(text, this.dragTextStyle);
        document.body.appendChild(dragTextElement);
        const rect = dragTextElement.getBoundingClientRect();
        event.dataTransfer.setDragImage(dragTextElement, rect.width / 2, rect.height / 2);
        setTimeout(() => document.body.removeChild(dragTextElement), 0);
      } else {
        // Check if element contains canvas elements
        const hasCanvas = this.el.nativeElement.querySelector('canvas');
        
        if (hasCanvas) {
          // Use canvas-to-image approach for elements with canvas
          const dragImageElement = await this.createDragImageFromCanvas();
          const rect = this.el.nativeElement.getBoundingClientRect();
          const height = window.innerHeight;
          
          event.dataTransfer.setDragImage(dragImageElement, 
            rect.width / 2 + height/14,
            rect.height / 2 + height/18
          );
          
          // Clean up after drag image is set
          setTimeout(() => {
            if (dragImageElement.parentNode) {
              document.body.removeChild(dragImageElement);
            }
          }, 0);
        } else {
          // Use original cloning approach for non-canvas elements
          const tempElement = this.el.nativeElement.cloneNode(true) as HTMLElement;
          
          this.renderer.setStyle(tempElement, 'position', 'absolute');
          this.renderer.setStyle(tempElement, 'top', '-9999px');
          this.renderer.setStyle(tempElement, 'left', '-9999px');
          this.renderer.setStyle(tempElement, 'margin', '0');
          
          document.body.appendChild(tempElement);
          tempElement.style.color = window.getComputedStyle(this.el.nativeElement).color;
          const rect = tempElement.getBoundingClientRect();
          const height = window.innerHeight;
          
          event.dataTransfer.setDragImage(tempElement, 
            rect.width / 2 + height/14,
            rect.height / 2 + height/18
          );
          setTimeout(() => document.body.removeChild(tempElement), 0);
        }
      }
    }

    if (this.hideOriginalOnDrag) {
      this.renderer.setStyle(this.el.nativeElement, 'opacity', 0);
    }

    this.swapStart.emit({ from: this.swapIndex });
  }

  private async createDragImageFromCanvas(): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      // Use html2canvas or similar approach to capture the element
      // For now, we'll use a simpler canvas-to-image approach
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const rect = this.el.nativeElement.getBoundingClientRect();
      
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      // Try to find and copy canvas content
      const sourceCanvas = this.el.nativeElement.querySelector('canvas');
      
      if (sourceCanvas && ctx) {
        // Copy the canvas content
        ctx.drawImage(sourceCanvas, 0, 0, canvas.width, canvas.height);
        
        // Convert to image
        const img = new Image();
        img.onload = () => {
          // Position off-screen
          img.style.position = 'absolute';
          img.style.top = '-9999px';
          img.style.left = '-9999px';
          document.body.appendChild(img);
          resolve(img);
        };
        img.src = canvas.toDataURL();
      } else {
        // Fallback: create a simple colored rectangle
        if (ctx) {
          ctx.fillStyle = window.getComputedStyle(this.el.nativeElement).backgroundColor || '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = window.getComputedStyle(this.el.nativeElement).color || '#000000';
          ctx.font = '16px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(this.el.nativeElement.textContent || '', canvas.width/2, canvas.height/2);
        }
        
        const img = new Image();
        img.onload = () => {
          img.style.position = 'absolute';
          img.style.top = '-9999px';
          img.style.left = '-9999px';
          document.body.appendChild(img);
          resolve(img);
        };
        img.src = canvas.toDataURL();
      }
    });
  }

  @HostListener('dragend') onDragEnd() {
    if (this.hideOriginalOnDrag) {
      this.renderer.setStyle(this.el.nativeElement, 'opacity', 1);
    }
  }

  @HostListener('dragover', ['$event']) onDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    const draggedIndex = event.dataTransfer.getData('text');
    this.swapPreview.emit({ from: +draggedIndex, to: this.swapIndex });
  }

  @HostListener('drop', ['$event']) onDrop(event: DragEvent) {
    
    event.preventDefault();
    if (event.dataTransfer) {
      const draggedIndex = event.dataTransfer.getData('text');
      this.swap.emit({ from: +draggedIndex, to: this.swapIndex });
    }
  }

  private createDragTextElement(text: string, styles?: { [key: string]: string }): HTMLElement {
    const element = this.renderer.createElement('div');
    const textNode = this.renderer.createText(text);
    this.renderer.appendChild(element, textNode);

    const computedStyle = getComputedStyle(this.el.nativeElement);
    for (const key of Array.from(computedStyle)) {
      this.renderer.setStyle(element, key, computedStyle.getPropertyValue(key));
    }

    if (styles) {
      for (const [key, value] of Object.entries(styles)) {
        this.renderer.setStyle(element, key, value);
      }
    }

    this.renderer.setStyle(element, 'position', 'absolute');
    this.renderer.setStyle(element, 'top', '-9999px');
    this.renderer.setStyle(element, 'left', '-9999px');

    document.body.appendChild(element);

    return element;
  }
}