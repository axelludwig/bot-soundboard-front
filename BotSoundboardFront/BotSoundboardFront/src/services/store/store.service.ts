import { Injectable, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { Channel, queueItem } from 'src/app/declarations';
import { Sound } from 'src/app/models/sound';
import { AxiosService, GetOptions } from "src/services/axios/axios.service"
import { SocketService } from 'src/services/socket/socket.service';

@Injectable({
  providedIn: 'root'
})
export class StoreService implements OnInit {

  public currentChannel: Channel | null = null;
  public channels: Channel[] = [];
  public channelsLoaded: boolean = true;
  public queue: queueItem[] = [];

  public sounds: Sound[] = [];
  public soundsCopy: Sound[] = [];

  private _wavesurferBase64 = new Subject<any>();
  wavesurferBase64$ = this._wavesurferBase64.asObservable();

  public newSound: string | null = null;

  constructor(private socketService: SocketService, private axiosService: AxiosService) {
    socketService.queueUpdate$.subscribe((queue: queueItem[]) => {
      this.queue = queue;
    })

    this.socketService.botChangeChannel$.subscribe((id: string) => {
      this.currentChannel = this.getChannelById(id);
    })

    this.socketService.channels$.subscribe((channels: Channel[]) => {
      this.channels = channels;
      this.channelsLoaded = true;
    })

    this.socketService.sounds$.subscribe((sounds: Sound[]) => {
      this.sounds = sounds;
      this.soundsCopy = sounds;
      this.sortSounds();
    })
  }

  ngOnInit() {
  }

  sortSounds(): void {
    this.sounds.sort((a, b): number => {
      if (a.Name.toLowerCase() < b.Name.toLowerCase()) return -1;
      else if (a > b) return 1;
      else return 0
    })
  }

  getChannelById(id: string): Channel | null {
    for (let index = 0; index < this.channels.length; index++) {
      const element = this.channels[index];
      if (element.id === id) return element;
    } return null;
  }

  updateWavesurferBase64(base64: string): void {
    this._wavesurferBase64.next(base64);
  }
}
