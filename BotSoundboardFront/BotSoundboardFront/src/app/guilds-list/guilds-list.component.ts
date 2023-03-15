import { Component } from '@angular/core';
import { AxiosService, GetOptions } from "src/services/axios/axios.service"
import { SocketService } from 'src/services/socket/socket.service';

export interface Channel {
  name: string,
  id: string,
  members: Member[]
}

export interface Member {
  id: string,
  name: string
}

@Component({
  selector: 'app-guilds-list',
  templateUrl: './guilds-list.component.html',
  styleUrls: ['./guilds-list.component.css']
})

export class GuildsListComponent {
  private axiosService: AxiosService;
  private socketService: SocketService;

  channels: Channel[] = [];
  currentChannel: Channel | null = null;
  gotCurrentChannel: boolean = false;

  constructor(socketService: SocketService, axiosService: AxiosService) {
    this.axiosService = axiosService;
    this.socketService = socketService;

    this.getChannels();
    this.getCurrentChannel();

    this.socketService.botChangeChannel$.subscribe((id: string) => {
      this.currentChannel = this.getChannelById(id);
    })

    this.socketService.userChangeChannel$.subscribe((res: any) => {
      var member: Member = {
        id: res.userId,
        name: res.name
      }; var channelId = res.channelId;

      this.channels.forEach((c) => {
        c.members = c.members.filter((m) => {
          return m.id !== member.id
        }); if (c.id == channelId) {
          c.members.push(member);
        }
      })
    })

    this.socketService.userDisconnectsChannel$.subscribe((id: string) => {
      this.channels.forEach((c) => {
        c.members = c.members.filter((m) => {
          return m.id !== id
        })
      })
    })

    this.socketService.botDisconnect$.subscribe((res: object) => {
      this.currentChannel = null;
    })
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

  getChannelById(id: string): Channel | null {
    for (let index = 0; index < this.channels.length; index++) {
      const element = this.channels[index];
      if (element.id === id) return element;
    } return null;
  }

  channelClick(id: string) {
    this.socketService.joinChannel(id);
  }

  leaveChannel() {
    this.socketService.leaveChannel();
    this.currentChannel = null;
  }
}