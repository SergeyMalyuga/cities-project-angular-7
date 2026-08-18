import {Directive, HostListener, inject, Input} from '@angular/core';
import {DOCUMENT} from '@angular/common';

@Directive({
  selector: '[appScrollUp]',
})
export class ScrollUpDirective {
  @Input() enabled = false;

  private document = inject(DOCUMENT);
  private windowRef = this.document.defaultView;

  @HostListener('click')
  onClick() {
    if(this.enabled && this.windowRef) {
      this.windowRef.scrollTo({top: 0, behavior: 'smooth'});
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(evt: KeyboardEvent) {
    if (
      this.enabled &&
      this.windowRef &&
      (evt.key === 'Enter' || evt.key === ' ')
    ) {
      evt.preventDefault();
      this.windowRef.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
