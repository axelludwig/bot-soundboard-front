import { Component } from '@angular/core';
import { AxiosService, GetOptions } from "src/services/axios/axios.service"
import { SocketService } from 'src/services/socket/socket.service';
import { StoreService } from "../../services/store/store.service"
import { Channel, Member } from '../declarations';

@Component({
  selector: 'app-guilds-list',
  templateUrl: './guilds-list.component.html',
  styleUrls: ['./guilds-list.component.css']
})

export class GuildsListComponent {

  constructor(public socketService: SocketService, public axiosService: AxiosService, public store: StoreService) {
    this.socketService.userChangeChannel$.subscribe((res: any) => {
      var member: Member = {
        id: res.userId,
        name: res.name
      }; var channelId = res.channelId;

      this.store.channels.forEach((c) => {
        c.members = c.members.filter((m: any) => {
          return m.id !== member.id
        }); if (c.id == channelId) {
          c.members.push(member);
        }
      })
    })

    this.socketService.userDisconnectsChannel$.subscribe((id: string) => {
      this.store.channels.forEach((c) => {
        c.members = c.members.filter((m: any) => {
          return m.id !== id
        })
      })
    })

    this.socketService.botDisconnect$.subscribe((res: object) => {
      this.store.currentChannel = null;
    })
  }

  channelClick(id: string) {
    this.socketService.joinChannel(id);
  }

  leaveChannel() {
    this.socketService.leaveChannel();
    this.store.currentChannel = null;
  }

  hide() {
    console.log('hide');
    
  }
}