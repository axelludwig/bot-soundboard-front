import { Component, HostBinding } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-context-menu',
  template: '<ng-content></ng-content>',
  styles: ['']
})

export class ContextMenuComponent extends MatMenuTrigger {

  @HostBinding('style.position') private position = 'fixed';
  @HostBinding('style.pointer-events') private events = 'none';
  @HostBinding('style.left') private x: string = '';
  @HostBinding('style.top') private y: string = '';

  // Intercepts the global context menu event
  public open({ x, y }: MouseEvent, data?: any) {
    // Pass along the context data to support lazily-rendered content
    if (!!data) { this.menuData = data; }

    // Adjust the menu anchor position
    this.x = x + 'px';
    this.y = y + 'px';

    // Opens the menu
    // this.openMenu();
    this.closeMenu();
    setTimeout(() => {
      this.openMenu();
    }, 1);

    // prevents default    
    return false;
  }
}