import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatService } from '../Services/chat.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
userForm:FormGroup = new FormGroup({});
submitted = false;
apiErrorMessages:string[] =[];
openChat:boolean = false;
constructor(private formBuilder:FormBuilder,private chat:ChatService){}
ngOnInit(): void {
  this.initializeForm();
}

initializeForm(){
  this.userForm = this.formBuilder.group({
    name:['',[Validators.required,Validators.minLength(3),Validators.maxLength(15)]]
  })
}
submitForm(){
  this.submitted =true;
  this.apiErrorMessages =[];
  if(this.userForm.valid)
    {
      let observer  = {
        next:() =>{
          this.chat.myName = this.name?.value;
          this.openChat = true;
          this.userForm.reset();
          this.submitted = false;
        },
        error:(error:any)=>
        {
          if(typeof(error.error) !=='object')
            this.apiErrorMessages.push(error.error);
        }
      }
      this.chat.registerUser(this.userForm.value).subscribe(observer);
    }
}
get name(){
  return this.userForm.get('name');
}
closeChat(){
  this.openChat=false;
}
}
