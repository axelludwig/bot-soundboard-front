import { Component } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { SocketService } from 'src/services/socket/socket.service';
import { StoreService } from 'src/services/store/store.service';

import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { Sound, queueItem } from '../declarations';

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
    console.log(event.value);
    this.socketService.setMode(event.value)
  }

  slideToggle(event: MatSlideToggleChange) {
    if (event.checked) {
      this.queueMode = 'queue';
      this.socketService.setMode('queue')
    } else {
      this.socketService.setMode('overwrite')
      this.queueMode = 'overwrite';
    }
  }

  queueSoundClick(sound: string) {
    console.log(sound);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.store.queue, event.previousIndex, event.currentIndex);
  }
}
