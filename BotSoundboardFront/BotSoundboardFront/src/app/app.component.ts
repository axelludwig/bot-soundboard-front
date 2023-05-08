import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { SocketService } from 'src/services/socket/socket.service';
import { AxiosService, GetOptions } from "src/services/axios/axios.service"
import { Params } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class AppComponent {
  public socketConnection: boolean = false;

  private axiosService: AxiosService;
  private socketService: SocketService;

  public filesToUpload: Iterable<File> = [];
  public hasFiles: boolean = false;

  public newSound: string | null = null;
  public volume: number = 0;

  public queueMode: string = '';
  queueModes: string[] = ['queue', 'overwrite'];

  public isPaused = true;
  public soundPlaying: string | null = null;

  constructor(socketService: SocketService, axiosService: AxiosService) {
    this.axiosService = axiosService;
    this.socketService = socketService;

    this.socketService.connect$.subscribe(() => {
      this.socketConnection = true;
    })

    this.socketService.disconnect$.subscribe(() => {
      this.socketConnection = false;
    })

    this.socketService.botChangeVolume$.subscribe((value: number) => {
      this.volume = value;
    })

    this.socketService.botChangeMode$.subscribe((value: string) => {
      this.queueMode = value;
    })

    this.socketService.pauseSound$.subscribe(() => {
      this.isPaused = true;

    })

    this.socketService.unpauseSound$.subscribe(() => {
      this.isPaused = false;
    })

    this.socketService.soundPlaying$.subscribe((sound: string) => {
      this.soundPlaying = sound;
    })

    this.getVolume();
    this.getQueueMode();
    this.getIsPaused();
  }

  ngOnInit() { }

  skipSound() {
    this.socketService.skipSound();
  }

  onSliderChange(event: any) {
    this.socketService.setVolume(event.value)
  }

  onRadioClick(event: any) {
    this.socketService.setMode(event.value)
  }

  onFileSelect(event: any) {
    var files = event.target.files;
    this.filesToUpload = files;
    this.hasFiles = true;
  }

  onFileChange() {
    const inputNode: any = document.querySelector('#file');
    this.filesToUpload = inputNode.files;
    this.hasFiles = true;
  }

  uploadFile() {
    var options: GetOptions = { url: "/sounds" }

    Array.from(this.filesToUpload).forEach(file => {
      var filereader = new FileReader();
      filereader.readAsDataURL(file);
      filereader.onload = (evt) => {
        var base64 = evt.target?.result;
        var params: Params = {
          "data": base64,
          "name": file.name,
          "type": file.type
        }
        options.params = params;
        this.newSound = file.name.replace(/\.[^/.]+$/, "");
        this.axiosService.post(options).then((res) => {
          this.hasFiles = false;
          this.filesToUpload = [];
        })
          .catch((err) => {
            console.log(err);
          })
      }
    })
  }

  getIsPaused() {
    var options: GetOptions = {
      url: "/pause"
    }
    this.axiosService.get(options)
      .then((res: any) => {
        this.isPaused = res
      })
      .catch((err) => {
        console.log(err);
      })
  }

  getVolume() {
    var options: GetOptions = {
      url: "/volume"
    }
    this.axiosService.get(options)
      .then((res: any) => {
        this.volume = res
      })
      .catch((err) => {
        console.log(err);
      })
  }

  getQueueMode() {
    var options: GetOptions = {
      url: "/mode"
    }
    this.axiosService.get(options)
      .then((res: any) => {
        this.queueMode = res
      })
      .catch((err) => {
        console.log(err);
      })
  }

  test() {
    this.socketService.test();
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

  togglePause() {
    if (this.isPaused) this.socketService.unpauseSound();
    else this.socketService.pauseSound();
    console.log(this.isPaused);
  }
}
