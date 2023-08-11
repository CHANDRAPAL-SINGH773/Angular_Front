import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, catchError, Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as signalR from "@microsoft/signalr"
import {DataEditor} from '../data-editor.service';

@Injectable({
  providedIn: 'root'
})
export class ManageNotificationService {
  ApiUrl = environment.ICC_API ; //Access localhost API path from environment.ts file;
  private hubConnection: signalR.HubConnection
  constructor(
    private http:HttpClient,
    private dataEditor : DataEditor,) { }
  
    public startConnection = () => {
      this.hubConnection = new signalR.HubConnectionBuilder()
          .withUrl(environment.baseSignalrNotification, {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets}).build();
  
        this.hubConnection.start()
        .catch(err => console.log('Error while starting connection: ' + err))
    }

  public addNotificationRecievedListener = () => {
       this.hubConnection.on('NewNotificationRecieved', (message) => {
       console.log(message);
       this.dataEditor.sendNotificationData(message);
    });
  }
  //Method is used for Get all notification templates Lists--
  GetAllNotificationTemplateList(search:any,pageNumber:any,pageSize:any):Observable<any>{
    return this.http.get(this.ApiUrl+"Notification/get/getNotificationTemplateList?search="+search+"&pageNumber="+pageNumber+"&pageSize="+pageSize+"").pipe(catchError(this.handleError('Get All Notification Template List')))
  }
  //Method is used for Get all notification Lists--
  GetAllNotificationList(search:any,pageNumber:any,pageSize:any):Observable<any>{
    return this.http.get(this.ApiUrl+"Notification/get/getNotificationList?search="+search+"&pageNumber="+pageNumber+"&pageSize="+pageSize+"").pipe(catchError(this.handleError('Get All Notification Template List')))
  }
  
  //Methods is user for Delete Notification template -- 
  DeleteNotificationTemplate(id:number){
  const Id = id;
  const body = JSON.stringify(Id);
   return this.http.post(`${this.ApiUrl}Notification/deleteNotificationTemplate?Id=`+Id,body).pipe(
     catchError(this.handleError(' Delete Notification Template', []))
    )
  }
  DeleteNotification(id:number){
    const Id = id;
    const body = JSON.stringify(Id);
     return this.http.post(`${this.ApiUrl}Notification/deleteNotification?Id=`+Id,body).pipe(
       catchError(this.handleError(' Delete Notification Template', []))
      )
    }
  //Method is used for add new template--
  AddNotificationTemplateService(dataObj:any): Observable<any>{
    return this.http.post(`${this.ApiUrl}Notification/addNotificationTemplate`,dataObj).pipe(
    catchError(this.handleError('Add Notification Template Service', []))
      )
    }
  //Method Is used for Send Notifications --
  SendNewNotificationService(dataObj:any):Observable<any>{
    return this.http.post(`${this.ApiUrl}Notification/sendNotifications`,dataObj).pipe(
      catchError(this.handleError('Send New Notification Service',[]))
    )
  }
  //Method is used for Get particular user notification--
  GetGeneralNotification(dataObj:any):Observable<any>{
    return this.http.get(this.ApiUrl+"Notification/get/getGeneralNotification?UserId="+dataObj.UserId+"&UserEmail="+dataObj.UserEmail+"&UserType="+dataObj.UserType).pipe(
      catchError(this.handleError('Get All Notification Template List')))  }

   //Method is used for get template data--
   GetTemplateData(id:number){
    const Id = id;
    const body = JSON.stringify(Id);
   return this.http.post(`${this.ApiUrl}Notification/getTemplateData?Id=`+Id,body).pipe(
     catchError(this.handleError('Get Particular Template Data', []))
   )
 } 

  //Method is used for Get all notification Lists--
   GetUserAllNotificationList(search:any,pageNumber:any,pageSize:any):Observable<any>{
    return this.http.get(this.ApiUrl+"Notification/get/getNotificationList?search="+search+"&pageNumber="+pageNumber+"&pageSize="+pageSize+"").pipe(catchError(this.handleError('Get All Notification Template List')))
  }
    //Method is used for get template data--
    CheckUniqueTemplateValidation(text:string){
      const TemplateTitle = text;
      const body = JSON.stringify(TemplateTitle);
     return this.http.post(`${this.ApiUrl}Notification/checkUniqueTemplate?TemplateTitle=`+TemplateTitle,body).pipe(
       catchError(this.handleError('Check Unique Template Type', []))
     )
   } 

   //Method is used for  Update template--
   UpdateNotificationTemplateService(dataObj:any): Observable<any>{
    return this.http.post(`${this.ApiUrl}Notification/updateNotificationTemplate`,dataObj).pipe(
    catchError(this.handleError('Update Notification Template Service', []))
      )
    }

    //Method is used for Get all notification Lists--
    GetUserNotificationList(userId:any,status:any,search:any,pageNumber:any,pageSize:any):Observable<any>{
      return this.http.get(this.ApiUrl+"Notification/get/userNotifications?userId="+userId+"&status="+status+"&search="+search+"&pageNumber="+pageNumber+"&pageSize="+pageSize+"").pipe(catchError(this.handleError('Get All Notification Template List')))
    }

        //Method is used for Get all notification Lists--
   GetNotificationData(id:any,notificationId:any):Observable<any>{
    return this.http.get(this.ApiUrl+"Notification/get/notificationData?id="+id+"&notificationId="+notificationId+"").pipe(catchError(this.handleError('Get All Notification Template List')))
   }

     //Method is used for Get all notification Lists--
       ClearAllNotification(userId:string){
        const Id = userId;
        const body = JSON.stringify(Id);
        return this.http.post(`${this.ApiUrl}Notification/clear/notification?userId=`+Id,body).pipe(
         catchError(this.handleError('Check Unique Template Type', []))
       )
     } 


  //this is error handler method--
  private handleError<T>(operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {
    return of(result as T);
  };
  }
}
