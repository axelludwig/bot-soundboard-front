import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { Component } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { Toast, ToastrService, ToastPackage } from 'ngx-toastr';

@Component({
  selector: '[custom-toast-component]',
  styleUrls: [`./custom-toast.scss`],
  templateUrl: `./custom-toast.html`,
  animations: [],
  preserveWhitespaces: false,
})

export class CustomToast extends Toast {
  // used for demo purposes
  undoString = 'undo';

  action(event: Event) {
    event.stopPropagation();
    this.undoString = 'undid';
    this.toastPackage.triggerAction();
    return false;
  }
}