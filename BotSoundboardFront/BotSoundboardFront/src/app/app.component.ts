import { Component, HostListener, Inject, ViewEncapsulation } from '@angular/core';
import { SocketService } from 'src/services/socket/socket.service';
import { AxiosService, GetOptions } from "src/services/axios/axios.service"
import { StoreService } from 'src/services/store/store.service';
import { SoundUploadModalComponent } from './modals/sound-upload-modal/sound-upload-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Sound } from './declarations';

declare var WaveSurfer: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class AppComponent {
  
  public socketConnection: boolean = false;
  
  public queueMode: string = '';
  queueModes: string[] = ['queue', 'overwrite'];

  public isPaused = true;

  constructor(private store: StoreService, private socketService: SocketService, private axiosService: AxiosService, public dialog: MatDialog) {
    this.socketService.connect$.subscribe(() => {
      this.socketConnection = true;
    })

    this.socketService.disconnect$.subscribe(() => {
      this.socketConnection = false;
    })
    
    this.socketService.botChangeMode$.subscribe((value: string) => {
      this.queueMode = value;
    })
  }

  ngOnInit() { }

  clearQueue() {
    this.socketService.clearQueue();
  }

  onRadioClick(event: any) {
    this.socketService.setMode(event.value)
  }

  openUploadDialog() {
    let dialog = this.dialog.open(SoundUploadModalComponent, {
      height: '60%',
      width: '40%',
    });

    dialog.afterClosed().subscribe(result => {
      if (result === undefined || result === null || result === '') return;
    });
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
}
