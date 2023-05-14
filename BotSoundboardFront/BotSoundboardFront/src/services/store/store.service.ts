import { Injectable } from '@angular/core';
import { Component } from '@angular/core';
import { Channel, queueItem } from 'src/app/declarations';
import { AxiosService, GetOptions } from "src/services/axios/axios.service"
import { SocketService } from 'src/services/socket/socket.service';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  currentChannel: Channel | null = null;
  public channels: Channel[] = [];
  public channelsLoaded: boolean = true;
  public queue: queueItem[] = [];

  public sounds: string[] = [];
  soundsCopy: string[] = [];

  constructor(private socketService: SocketService, private axiosService: AxiosService) {

    socketService.queueUpdate$.subscribe((queue: queueItem[]) => {
      this.queue = queue;
    })

    socketService.channels$.subscribe((channels) => {
      this.channels = channels
    })

    this.socketService.botChangeChannel$.subscribe((id: string) => {
      this.currentChannel = this.getChannelById(id);      
    })

    this.socketService.channels$.subscribe((channels: Channel[]) => {
      this.channels = channels;
      this.channelsLoaded = true;
    })

    this.socketService.sounds$.subscribe((sounds: string[]) => {
      this.sounds = sounds;
      this.soundsCopy = sounds;
      this.sortSounds();

    })
  }

  sortSounds(): void {
    this.sounds.sort((a, b): number => {
      a = a.toLowerCase();
      b = b.toLowerCase();
      if (a < b) return -1;
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
}
