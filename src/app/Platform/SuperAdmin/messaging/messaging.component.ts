import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { DataEditor } from '../../Services/data-editor.service';
import { ManageNotificationService } from '../../Services/manageNotificationService/manage-notification.service';
import { MessageService } from '../../Services/messageService/message.service';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css']
})
export class MessagingComponent implements OnInit {
  showChatDetail: boolean = false;
  caregiveractive: boolean = false;
  agencyactive: boolean = false;
  clientactive: boolean = false;
  coordinatoractive: boolean = false;
  messageform!: FormGroup;
  userId : any;
  userName :any;
  userType : any;
  users: any[] = [];
  threadMessages: any[] = [];
  allmessages:any[]=[];
  file: File | null = null;
  caregiverCount=0;
  clientCount=0;
  agencyCount=0;
  coordinatorCount=0;
  selectedReceiverId: any;
  selectedUserType: any;
  selectedProfileName:any;
  loaderflag:boolean = false;
  mesageThreadId:any;
  constructor(
    public authService: AuthService,
    private _notificationService : ManageNotificationService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private messageService : MessageService,
    private http: HttpClient,
    private dataEditor : DataEditor,
    
  ){
    dataEditor.newMessageData.subscribe((res: { data: any; } | null) => {
      if(res == null){
        this.getAllLatestMessages(null);
      }
      else{        
          this.getAllLatestMessages(res.data);
        }      
    });
  }

  ngOnInit(): void {
    this.userId = this.authService.userID;
    this.userName = this.authService.fullUserName;
    this.userType = this.authService.userType; 
    this.CreateFormGroup();
    this.getActiveCaregivers();
    this.messageService.startConnection();
    this.messageService.addNewMessageReceivedListener();  
    this.getLatestMessages();
  }

  getLatestMessages():any{
  this.dataEditor.newMessageData.subscribe((res: { receiverId: any; senderId: any; } | null) => {
    if(res == null){
      this.getAllLatestMessages(null);
    }
    else{
      if(res.receiverId == this.userId || res.senderId == this.userId){
        this.getAllLatestMessages(null);
      }
    }
  });
}


  CreateFormGroup(): void {
    this.messageform = this.fb.group({
      receiverId: ['', [Validators.required]],
      messageText: [''],
      messageFile: [''],
    });
  }

  openChatMobile(currentuser:any,currentuserType:any,currentusername:any):any{
    this.showChatDetail = !this.showChatDetail;
    this.selectedReceiverId=currentuser;
    this.selectedUserType=currentuserType;
    this.selectedProfileName=currentusername;
    this.getCurrentUserThreadMessage(currentuser);
  }

  getActiveCaregivers():any{ 
    this.loaderflag = true;
    this.caregiveractive=true;
    this.clientactive=false;
    this.agencyactive=false;
    this.coordinatoractive = false; 
    let cargiverUserType=3; 
    this.messageService.GetCaregivers(cargiverUserType).subscribe((response:any) => {
      if(response.data != "") {
        this.users = response.data;
        this.caregiverCount=response.data.length;
        this.loaderflag = false;
      }
      else{
        this.loaderflag = false;
      }
    });
  }

  getActiveClients():any{  
    this.loaderflag = true;
    this.clientactive=true;
    this.caregiveractive=false;
    this.agencyactive=false; 
    this.coordinatoractive = false; 
    let cargiverUserType=2; 
    this.messageService.GetCaregivers(cargiverUserType).subscribe((response:any) => {
      if(response.data != "") {
        this.users = response.data;
        this.clientCount=response.data.length;        
        this.loaderflag = false;
      }
      else{
        this.loaderflag = false;
      }
    });
  }

  getActiveAgencies():any{   
    this.loaderflag = true; 
    this.agencyactive=true; 
    this.clientactive=false;
    this.caregiveractive=false;
    this.coordinatoractive = false; 
    let cargiverUserType=4; 
    this.messageService.GetCaregivers(cargiverUserType).subscribe((response:any) => {
      if(response.data != "") {
        this.users = response.data; 
        this.agencyCount=response.data.length;         
        this.loaderflag = false;
      }
      else{
        this.loaderflag = false;
      }
    });
  }

  getActiveCoordinator():any{    
    this.loaderflag = true; 
    this.coordinatoractive = true; 
    this.agencyactive=false; 
    this.clientactive=false;
    this.caregiveractive=false;
    let cargiverUserType=1; 
    this.messageService.GetCaregivers(cargiverUserType).subscribe((response:any) => {
      if(response.data != "") {
        this.users = response.data; 
        this.coordinatorCount=response.data.length;         
        this.loaderflag = false;
      }
      else{
        this.loaderflag = false;
      }
    });
  }

  onChange(event: any) {
    this.file = event.target.files[0];
  }

  getCurrentUserThreadMessage(userId:any){
    this.loaderflag = true;
    this.messageService.getThreadMessagesbyUserId(userId).subscribe((res: { data: any[]; }) => {
      if(res.data.length>0){
        this.allmessages = res.data;
        this.mesageThreadId = res.data[0].MessageThreadId;
        this.getAllThreadMessage(this.mesageThreadId);
        this.loaderflag = false;
      }
      else{
        this.threadMessages = [];
        this.loaderflag = false;
      }
    }); 
  }

  getAllThreadMessage(messageThreadId: any) {
    this.loaderflag = true;
    this.messageService.getThreadMessages(messageThreadId).subscribe(res => {
      if(res.data!=null){
        this.threadMessages = res.data;
        this.loaderflag = false;
      }
      else{
        this.loaderflag = false;
      }
    });
  }

  getAllLatestMessages(data:any) {
    if(data!=null){
      this.getAllThreadMessage(data);
    }
    else{
    this.messageService.getAllLatestMessages(this.userId).subscribe((res: { data: any[]; }) => {
        this.allmessages = res.data;
    });
  }
  }

  SendMessage(): any {  
    this.loaderflag = true;
    var formData=new FormData();
    if(this.file != null){
      formData.append("file", this.file!, this.file!.name);
    }
    else{
      formData.append("messageText", this.messageform.controls['messageText'].value)
    }
    this.messageform.controls['receiverId'].setValue(this.selectedReceiverId); 
    formData.append("receiverId", this.selectedReceiverId);
    formData.append("receiverType", this.selectedUserType);
    formData.append("userId", this.userId);
    formData.append("userType", this.userType); 
    formData.append("senderType",this.userType);
    this.messageService.sendMessage(formData).subscribe(res =>{ 
      if(res!=null)  {   
      formData=new FormData();
      this.file = null;
      this.loaderflag = false;
      this.messageform.controls['messageText'].setValue(''); 
      this.getAllThreadMessage(res.data);
      
      }
      else{
      this.loaderflag = false;
      }
    });
  }

  downloadFile(messageId: any, messageFile: any){
    let fileType = this.messageService.GetFileType(messageFile);
    
    this.messageService.downloadMessageFile(messageId).subscribe(res =>{
        var blob = new Blob([res], { type: fileType });
        var url = window.URL.createObjectURL(blob);
        var anchor = document.createElement("a");
        anchor.download = messageFile.split('_').pop();
        anchor.href = url;
        anchor.click();
    })
  }

  // imagePreview(preview: any, fileContent: any) {
  //   this.previewImageContent = fileContent;
  //   this.modalService.open(preview, { centered: true });
  // }

}
