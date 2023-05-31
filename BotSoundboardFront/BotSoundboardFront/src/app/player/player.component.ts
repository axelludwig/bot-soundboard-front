import { Component } from '@angular/core';
import { SocketService } from 'src/services/socket/socket.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent {
  constructor(private socket: SocketService){
    
  }
}
