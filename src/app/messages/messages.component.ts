import { Component, Input } from '@angular/core';
import { Message } from '../Models/message';
import { ChatService } from '../Services/chat.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent {

@Input() messages:Message[] =[];
constructor(public chatService:ChatService){}
}
