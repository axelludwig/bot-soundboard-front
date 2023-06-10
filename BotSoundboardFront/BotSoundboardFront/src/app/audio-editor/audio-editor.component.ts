import { AfterViewChecked, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { StoreService } from 'src/services/store/store.service';
import { Base64File } from '../declarations';
import { AxiosService, GetOptions, Params } from 'src/services/axios/axios.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingSnackbar } from '../snackbars/loading-snackbar/loading-snackbar';
import { Subject } from 'rxjs';

declare var WaveSurfer: any;

@Component({
  selector: 'app-audio-editor',
  templateUrl: './audio-editor.component.html',
  styleUrls: ['./audio-editor.component.css']
})
export class AudioEditorComponent implements OnInit {

  @Output() closeDialog = new EventEmitter<any>();

  protected wavesurfer: any;
  public volume: number = 50;
  public isPaused: boolean = true;
  public region: any;
  public base64File: Base64File | undefined;

  public loadingSnackbar: any;

  @ViewChild('waveform') private waveform: any | undefined;

  constructor(private store: StoreService, private axios: AxiosService, private _snackBar: MatSnackBar) {
    store.updateBase64File$.subscribe((base64: Base64File) => {
      this.base64File = base64;
      this.initWaveSurfer();
      this.loadBase64Sound(base64);
    })

    store.newSoundName$.subscribe((name: string) => {
      if (this.base64File) this.base64File!.name = name;
    })
  }

  ngOnInit() { }

  openLoadingSnackbar() {
    this.loadingSnackbar = this._snackBar.openFromComponent(LoadingSnackbar, {
      duration: 0,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  close() {
    this.loadingSnackbar.dismiss();
  }

  initWaveSurfer() {
    const myNode = document.getElementById("waveform");
    while (myNode?.firstChild) { if (myNode.lastChild) myNode.removeChild(myNode.lastChild); }

    this.wavesurfer = WaveSurfer.create({
      container: document.querySelector('#waveform'),
      waveColor: '#D9DCFF',
      progressColor: '#4353FF',
      cursorColor: '#4353FF',
      barWidth: 3,
      barRadius: 3,
      cursorWidth: 1,
      height: 200,
      barGap: 3,
      fillParent: true,
      minPxPerSec: 10,
      plugins: [
        WaveSurfer.regions.create({
          regionsMinLength: 0,
          enableDragSelection: {
            slop: 5,
          },
          dragSelection: {
            slop: 5
          }
        })
      ]
    });

    const margin = 0.1;
    this.wavesurfer.on('ready', () => {
      let duration = this.wavesurfer.getDuration();
      this.wavesurfer.addRegion({
        start: duration * margin, // time in seconds
        end: this.wavesurfer.getDuration() - (duration * margin), // time in seconds
        color: 'hsla(222, 93%, 74%, 0.5)',
        loop: false,
        multiple: false,
        id: "region"
      });

      this.wavesurfer.skip(duration * margin);
    });

    this.wavesurfer.on('region-created', (region: any) => {
      if (Object.keys(this.wavesurfer.regions.list).length > 1)
        region.remove();
      else {
        this.region = region;
      }
    })

    this.wavesurfer.on('pause', () => {
      this.isPaused = true;
    });

    this.wavesurfer.on('play', () => {
      this.isPaused = false;
    });

    this.wavesurfer.on('finish', () => {
      this.isPaused = true;
    });
  }

  convertToBlob(binary: Uint8Array): Blob {
    return new Blob([binary], {
      type: 'audio/ogg'
    });
  }

  convertBase64ToBinary(base64data: string) {
    let raw = window.atob(base64data);
    let rawLength = raw.length;
    let arr = new Uint8Array(new ArrayBuffer(rawLength));

    for (let i = 0; i < rawLength; i++) {
      arr[i] = raw.charCodeAt(i);
    } return arr;
  }

  playPause() {
    if (this.isPaused) this.wavesurfer.regions.list["region"].play()
    else this.wavesurfer.pause();
  }

  loadBase64Sound(base64: Base64File) {
    let binary = this.convertBase64ToBinary(base64.data);
    let blob = this.convertToBlob(binary);
    this.wavesurfer.loadBlob(blob);
  }

  initRegionEvents() {
    this.region.on('update', (region: any) => {
      this.region = region;
    });

    this.region.on('update-end', (region: any) => {
      this.region = region;
    });
  }

  onSliderChange(event: any) {
    this.wavesurfer.setVolume(event.value / 100);
  }

  unsubscribleAll() {
    this.wavesurfer.pause();
    if (this.wavesurfer) this.wavesurfer.unAll();
  }

  save() {
    var options: GetOptions = { url: "/processYoutubeCreation" }
    var params: Params = {
      "id": this.base64File?.id,
      "start": this.region.start,
      "end": this.region.end,
      "name": this.base64File?.name
    }
    this.openLoadingSnackbar();
    this.closeDialog.next('');
    this.wavesurfer.pause();
    options.params = params;
    this.axios.post(options)
      .then((res) => {
        this.close();
        this.store.openSucessSnackBar();
        this.store.updateSoundName(this.base64File!.name);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  selectAll() {
    this.region.update({
      start: 0,
      end: this.wavesurfer.getDuration()
    }); this.wavesurfer.seekTo(0);
  }
}