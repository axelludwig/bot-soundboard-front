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
  public gotCurrentChannel: boolean = false;
  public queue: queueItem[] = [];

  constructor(private socketService: SocketService, private axiosService: AxiosService) {

    socketService.queueUpdate$.subscribe((queue: queueItem[]) => {
      this.queue = queue;
    })

    this.getQueue();
    this.getChannels();
    this.getCurrentChannel();
  }

  getChannels() {
    var options: GetOptions = {
      url: "/channels"
    }
    this.axiosService.get(options)
      .then((res: any) => {
        res.map((c: Channel) => {
          this.channels.push(c)
        })
      })
      .catch((err) => {
        console.log(err);
      })
  }

  getCurrentChannel() {
    var options: GetOptions = {
      url: "/currentChannel"
    }
    this.axiosService.get(options)
      .then((res: any) => {
        this.currentChannel = res;
        this.gotCurrentChannel = true;
      })
      .catch((err) => {
        console.log(err);
      })
  }

  getQueue() {
    var options: GetOptions = {
      url: "/queue"
    }
    this.axiosService.get(options)
      .then((res: any) => {
        this.queue = res
      })
      .catch((err) => {
        console.log(err);
      })
  }
}
