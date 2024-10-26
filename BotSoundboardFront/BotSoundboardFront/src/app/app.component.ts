import { Component, HostListener, Inject, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { SocketService } from 'src/services/socket/socket.service';
import { AxiosService, GetOptions } from "src/services/axios/axios.service"
import { StoreService } from 'src/services/store/store.service';
import { MatDialog } from '@angular/material/dialog';
import { SplitAreaDirective, SplitComponent } from 'angular-split';
import { SessionService } from 'src/services/session/session.service';

declare var WaveSurfer: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class AppComponent {
  @ViewChild(SplitComponent) splitEl: SplitComponent | null = null;
  @ViewChildren(SplitAreaDirective) areasEl: QueryList<SplitAreaDirective> | null = null;

  public socketConnection: boolean = false;
  public isPaused = true;
  public variable: string = "";

  public menuSize: number = 1000;
  public queueSize: number = 500;

  constructor(public store: StoreService, private socketService: SocketService, private axiosService: AxiosService, public dialog: MatDialog, public sessionService: SessionService) {
    this.socketService.connect$.subscribe(() => {
      this.socketConnection = true;
    })

    this.socketService.disconnect$.subscribe(() => {
      this.socketConnection = false;
    })

    let primaryColorTemp = localStorage.getItem('primaryColor');
    if (primaryColorTemp == null) primaryColorTemp = '#6c61fa';
    this.store.primaryColor = primaryColorTemp;
    this.store.changeThemeColor(primaryColorTemp);

    let sizes = localStorage.getItem('sizes');
    if (sizes) {
      let sizesArray = sizes.split(',');
      this.menuSize = parseInt(sizesArray[1]);
      this.queueSize = parseInt(sizesArray[2]);
    }
  }

  testHttp() {
    var options: GetOptions = {
      url: "/"
    }
    this.axiosService.get(options).then((res) => {
      console.log(res);
    })
      .catch((err) => {
        console.log(err);
      })
  }

  dragStart() {
    this.store.toggleHideSoundsList();
  }

  dragEnd(event: any) {
    this.menuSize = event.sizes[1];
    this.queueSize = event.sizes[2];
    this.saveSizes(event.sizes)
    this.store.toggleHideSoundsList();
  }

  saveSizes(sizes: number[]) {
    localStorage.setItem("sizes", sizes.join(','));
  }

  onClose1() {
    let middle: any;
    let queue: any;
    let count = 0;
    this.areasEl?.forEach(element => {
      if (count == 1) {
        middle = element;
      }
      else if (count == 2) {
        queue = element;
      }
      count++;
    });

    var width = document.getElementById('split')?.offsetWidth;
    middle.size = width! - this.queueSize - 48;

    this.saveSizes([0, middle.size, queue.size]);
  }
}
