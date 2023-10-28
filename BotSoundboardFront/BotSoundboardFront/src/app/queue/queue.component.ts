import { Component } from '@angular/core';
import { SocketService } from 'src/services/socket/socket.service';
import { StoreService } from 'src/services/store/store.service';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.css']
})
export class QueueComponent {

  public queueMode: string = '';
  queueModes: string[] = ['queue', 'overwrite'];

  constructor(public store: StoreService, private socketService: SocketService) {

    this.socketService.botChangeMode$.subscribe((value: string) => {
      this.queueMode = value;
    })
  }

  removeSoundFromQueue(elementId: string) {
    this.socketService.removeSoundFromQueue(elementId);
  }

  clearQueue() {
    this.socketService.clearQueue();
  }

  onRadioClick(event: any) {
    this.socketService.setMode(event.value)
  }
}
