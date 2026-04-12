import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { Component, HostBinding } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { Toast, ToastrService, ToastPackage } from 'ngx-toastr';
import { SocketService } from 'src/services/socket/socket.service';

@Component({
  selector: '[custom-toast-component]',
  styleUrls: [`./custom-toast.scss`],
  templateUrl: `./custom-toast.html`,
  animations: [],
  preserveWhitespaces: false,
})

export class CustomToast extends Toast {

  @HostBinding('style.background-color') backgroundColor: string = '#ffffff';

  public data: any;
  public mode: "text" | "loading" = "text";
  public type: "success" | "error" | "info" | "warning" = "info";
  public autoClose: boolean = false;

  public socketService: SocketService;


  private customTimeout: number = 3000;

  constructor(
    protected override  toastrService: ToastrService,
    public override  toastPackage: ToastPackage, socketService: SocketService) {
    super(toastrService, toastPackage);

    this.toastPackage.config.disableTimeOut = true;
    this.customTimeout = toastPackage.config.timeOut;
    this.socketService = socketService;

    this.data = (this.toastPackage.message as any)?.payload;
    this.setData();

    this.socketService.notifyEdit$.subscribe((data: any) => {
      this.data = data;
      this.setData();
    });

  }

  ngOnInit() { }

  action(event: Event) {
    console.log('Toast action button clicked');
    event.stopPropagation();
    this.toastPackage.triggerAction();
    return false;
  }

  setData() {
    console.log('setData', this.data);
    this.mode = this.data.mode ?? "text";
    this.type = this.data.type ?? "info";
    this.message = this.data.message;
    this.backgroundColor = this.getColorFromtype(this.type);
    this.autoClose = this.data.autoClose ?? true;

    if (this.autoClose) {
      setTimeout(() => {
        this.remove();
      }, this.customTimeout);
    }

    this.title = this.data.message;
  }

  getColorFromtype(type: string): string {
    switch (type) {
      case "success":
        return "#4CAF50";
      case "error":
        return "#F44336";
      case "info":
        return 'var(--primary)';
      case "warning":
        return "#FFC107";
    }
    return 'var(--second-background)';
  }
}