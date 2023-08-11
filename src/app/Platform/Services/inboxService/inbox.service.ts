import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {  catchError, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InboxService {

  ApiUrl = environment.ICC_API ; //Access localhost API path from environment.ts file;
  constructor(private http: HttpClient) { }
 // Service is used for get messages list--
  GetMessagesListService(userid:any, status:any,search:any,pageNumber:any,pageSize:any):Observable<any> {
    return this.http.get<any>(this.ApiUrl+"Inbox/get/getMessagesList?UserId="+userid+"&status="+status+"&search="+search+"&pageNumber="+pageNumber+"&pageSize="+pageSize+"")
    .pipe(catchError(this.handleError('Get all messages list')))
  }

   //method is used for compose messages--
   ComposeMessagesService(dataObj:any): Observable<any>{
    return this.http.post(`${this.ApiUrl}Inbox/composeMessages`,dataObj).pipe(
      catchError(this.handleError('compose messages', []))
    )
  }

  // service is used for get user name and emails--
  GetFilterdUsersList(UserName:any){
    const UName = UserName;
    const body = JSON.stringify(UserName);
    return this.http.post(`${this.ApiUrl}Inbox/getUsersList?UserName=`+UName,body).pipe(
     catchError(this.handleError('Get filtered user list', []))
   )
   }

  //service is used for trash messages-- 
  MoveToTrash(id:number){
    const Id = id;
    const body = JSON.stringify(Id);
   return this.http.post(`${this.ApiUrl}Inbox/moveToTrash?Id=`+Id,body).pipe(
     catchError(this.handleError('messages move to trash ', []))
   )
 }

  //this is error handler method--
   private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
    return of(result as T);
   };
  }
}
