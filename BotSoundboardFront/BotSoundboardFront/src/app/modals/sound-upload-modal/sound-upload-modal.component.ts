import { Component, HostListener, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AudioEditorComponent } from 'src/app/audio-editor/audio-editor.component';
import { Base64File, YoutubeSearchLink } from 'src/app/declarations';
import { AxiosService, GetOptions, Params } from "src/services/axios/axios.service"
import { SocketService } from 'src/services/socket/socket.service';
import { StoreService } from 'src/services/store/store.service';
import { UtilsService } from 'src/services/utils/utils.service';

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
  public youtubeUrl: string = '';
  public isLoaded: Troolean = Troolean.notStarted;
  public name: string = '';
  public urlIsValid: boolean = false;
  public modified: boolean = false;
  public localBase64: any;

  public youtubeSearch: string = '';
  public youtubeSearchLinks: YoutubeSearchLink[] = [];

  private youtubeRegex: RegExp = new RegExp(/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/);

  @ViewChild(AudioEditorComponent) child: AudioEditorComponent | undefined;

  constructor(public dialogRef: MatDialogRef<SoundUploadModalComponent>, @Inject(MAT_DIALOG_DATA) public data: string, private axiosService: AxiosService, public store: StoreService, public utils: UtilsService) {
    this.dialogRef.backdropClick().subscribe(() => {
      this.child?.unsubscribleAll();
    });
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
        this.axiosService.post(options).then((res: any) => {
          this.hasFiles = false;
          this.filesToUpload = [];
          if (this.store.playAfterUpload && this.store.playNextAfterUpload) this.store.playNext(res.ID);
          else if (this.store.playNextAfterUpload) this.store.playSound(res.ID);
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
        if (res) {
          if (this.name) res.name = this.name;
          this.store.updateBase64File(res)
          this.localBase64 = res;
        } else throw new Error("null response from server");
        this.isLoaded = Troolean.loaded;
      })
      .catch((err) => {
        console.log(err);
      })
  }

  SearchOnYoutube(): void {
    var options: GetOptions = {
      url: "/youtube/search",
      params: {
        "text": this.youtubeSearch
      }
    }
    this.axiosService.get(options)
      .then((res: any) => {
        if (res) {
          this.youtubeSearchLinks = res;
        } else throw new Error("null response from server");
      })
      .catch((err) => {
        console.log(err);
      })
  }

  updateName() {
    this.store.updateNewSoundName(this.name);
  }

  closeSelf() {
    this.dialogRef.close();
  }

  async pasteClipboard() {
    let clipboardContent = await navigator.clipboard.readText();
    if (clipboardContent) {
      this.youtubeUrl = clipboardContent;
      this.urlValidation();
    }
  }

  onKeyup($event: any) {
    this.modified = true;
    if ($event.key == ("Enter" || "NumpadEnter")) this.getSoundFromUrl();
    else this.urlValidation();
  }

  onKeyupSearch($event: any) {
    if ($event.key == ("Enter" || "NumpadEnter")) this.SearchOnYoutube();
  }

  urlValidation() {
    this.modified = true;
    this.urlIsValid = this.youtubeRegex.test(this.youtubeUrl);
    if (this.urlIsValid) {
      var options: GetOptions = {
        url: '/youtubeVideoName',
        params: { "link": this.youtubeUrl }
      }
      this.axiosService.get(options)
        .then((res: any) => {
          this.name = res;
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }


  saveInChild() {
    this.child?.save();
  }

  saveWithoutCropping(): void {
    this.child?.save(this.name, this.youtubeUrl);
  }

  videoClick(video: YoutubeSearchLink) {
    this.youtubeUrl = video.url;
    this.urlIsValid = true;
    this.name = video.title;

    document.getElementById("top")?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  playAfterUploadChange(): void {
    this.store.playNextAfterUpload = false;
  }

}


