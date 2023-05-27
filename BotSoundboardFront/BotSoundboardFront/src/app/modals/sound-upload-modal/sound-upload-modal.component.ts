import { Component, HostListener, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AudioEditorComponent } from 'src/app/audio-editor/audio-editor.component';
import { AxiosService, GetOptions, Params } from "src/services/axios/axios.service"
import { StoreService } from 'src/services/store/store.service';

enum Troolean {
  notStarted = 0,
  isLoading = 1,
  loaded = 2,
}

@Component({
  selector: 'app-sound-upload-modal-component',
  templateUrl: './sound-upload-modal.component.html',
  styleUrls: ['./sound-upload-modal.component.css']
})


export class SoundUploadModalComponent {

  public filesToUpload: Iterable<File> = [];
  public hasFiles: boolean = false;
  public youtubeUrl: string = 'https://youtu.be/OBPPneIlhDA';
  public isLoaded: Troolean = Troolean.notStarted;

  @ViewChild(AudioEditorComponent) child: AudioEditorComponent | undefined ;

  constructor(public dialogRef: MatDialogRef<SoundUploadModalComponent>, @Inject(MAT_DIALOG_DATA) public data: string, private axiosService: AxiosService, private store: StoreService) {
    this.dialogRef.backdropClick().subscribe(() => {
      this.child?.unsubscribleAll();
    });
    // this.dialog.disableClose = true;
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

        var soundInfos = {
          "name": file.name
        }

        var params: Params = {
          "data": base64,
          "infos": soundInfos,
          "type": file.type
        }
        options.params = params;
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

  getSoundFromUrl() {
    this.isLoaded = Troolean.isLoading;
    var options: GetOptions = {
      url: "/convertYoutubeToMp3",
      params: {
        "link": this.youtubeUrl
      }
    }
    this.axiosService.get(options)
      .then((res: any) => {
        if (res) this.store.updateWavesurferBase64(res);
        else throw new Error("null response from server");
        this.isLoaded = Troolean.loaded;
      })
      .catch((err) => {
        console.log(err);
      })
  }
}


