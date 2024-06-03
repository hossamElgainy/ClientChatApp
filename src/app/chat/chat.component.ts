import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ChatService } from '../Services/chat.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PrivateChatComponent } from '../private-chat/private-chat.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit,OnDestroy{
@Output() closeChatEmitter = new EventEmitter();

constructor(public chat:ChatService,private modelService:NgbModal){}
  ngOnDestroy(): void {
    this.chat.stopchatConnection();
  }
ngOnInit(): void {
  this.chat.createChatConnection()
}
backToHome()
{
  this.closeChatEmitter.emit();
}
sendMessage(content:string){
  this.chat.sendMessage(content);
}
openPrivateChat(toUser:string){
  const modelRef = this.modelService.open(PrivateChatComponent);
  modelRef.componentInstance.toUser = toUser;
}
}
