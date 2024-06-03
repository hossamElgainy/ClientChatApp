import { Component, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ChatService } from '../Services/chat.service';

@Component({
  selector: 'app-private-chat',
  templateUrl: './private-chat.component.html',
  styleUrl: './private-chat.component.css'
})
export class PrivateChatComponent implements OnDestroy{
  toUser:string ='';
  constructor(public activeModel:NgbActiveModal,public chatService:ChatService)
  {

  }
  ngOnDestroy(): void {
    this.chatService.closePrivateChatMessage(this.toUser);
  }
  sendMessage(content:string)
  {
    this.chatService.sendPrivateMessage(this.toUser,content);
  }
}
