import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../Models/user';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Message } from '../Models/message';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PrivateChatComponent } from '../private-chat/private-chat.component';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
myName:string = '';
onlineUsers:string[] =[];
messages:Message[] =[];
privateMessages:Message[]=[];
isPrivateMessageInitalized:boolean =false;
  private chatConnection?:HubConnection;
  constructor(private httpClient:HttpClient,private activeModal:NgbModal) { }

  registerUser(user:User):Observable<any>
  {
    return this.httpClient.post<any>(`${environment.apiUrl}api/Chat/register-uesr`,user, { withCredentials: true })
  }
  // this will call the OnConnectedAsync() From The hub
  createChatConnection(){
    // init the connection with the hub
    this.chatConnection = new HubConnectionBuilder()
    .withUrl(`${environment.apiUrl}hubs/chat`).withAutomaticReconnect().build();

    // start the connection
    this.chatConnection.start().catch(error =>console.log(error));

    // if the connection success =>
      //Call User Connected Form the server ,
      // add A ConnectionId The The User
    this.chatConnection.on('UserConnected',()=>{
      this.addUserConnectionId();
    });
      //Call Online Users Form the server ,
      //OnlineUsers Comes From The Server After Assign a ConnectionId The The User
      this.chatConnection.on('OnlineUsers',(onlineUsers)=>{
        this.onlineUsers = [...onlineUsers];
      });
      this.chatConnection.on('NewMessage',(newMessage:Message) =>{
        this.messages = [...this.messages,newMessage];
      });

      this.chatConnection.on('OpenPrivateChat',(newMessage:Message) =>{
        this.privateMessages = [...this.privateMessages,newMessage];
        this.isPrivateMessageInitalized = true;
        const modelRef = this.activeModal.open(PrivateChatComponent);
        modelRef.componentInstance.toUser = newMessage.from;
      });
      this.chatConnection.on('NewPrivateMessage',(newMessage:Message) =>{
        this.privateMessages = [...this.privateMessages,newMessage];
      });
      this.chatConnection.on('ClosePrivateChat',() =>{
        this.isPrivateMessageInitalized  =false;
        this.privateMessages =[];
        this.activeModal.dismissAll();
      });
  }

  stopchatConnection(){
    this.chatConnection?.stop().catch(error=>console.log(error));
 
  }
  // this will asign a connectionId To The User
  // Call AddUserConnectionId from The hub
  async addUserConnectionId(){
    return this.chatConnection?.invoke('AddUserConnectionId',this.myName).catch(error=>console.log(error));
  }

  async sendMessage(content:string){
    const message:Message ={
      from: this.myName,
      content
    };
    this.chatConnection?.invoke('ReceiveMessage',message).catch(error=>console.log(error));
  }
  async closePrivateChatMessage(otherUser:string){
    this.chatConnection?.invoke('RemovePrivateChat',this.myName,otherUser).catch(error =>console.log(error));
  }
  async sendPrivateMessage(to:string,content:string)
  {
    const message:Message ={
      from: this.myName,
      to,
      content
    };
    if(!this.isPrivateMessageInitalized)
      {
        this.isPrivateMessageInitalized = true;
        this.chatConnection?.invoke('CreatePrivateChat',message).then(()=>{
          this.privateMessages = [...this.privateMessages,message]
        }).catch(error=>console.log(error));
      }else{
        this.chatConnection?.invoke('ReceivePrivateMessage',message)
          .catch(error=>console.log(error));

      }
  }













}
