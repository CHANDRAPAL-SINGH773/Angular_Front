import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, catchError, Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CaregiverAssignedServiceService { 
  ApiUrl = environment.ICC_API ; //Access localhost API path from environment.ts file;
  constructor(private http: HttpClient) { }


   //Service is used for Add Request Caregiver--
   AddRequestCaregiverService(dataObj:any): Observable<any>{
    return this.http.post(`${this.ApiUrl}RequestCaregivers/requestCaregivers`,dataObj).pipe(
      catchError(this.handleError('Add Request Caregiver Service', []))
    )
  }

    //Service is used for Update Requested Caregiver--
    UpdateRequestCaregiverService(dataObj:any): Observable<any>{
      return this.http.post(`${this.ApiUrl}RequestCaregivers/requestCaregivers`,dataObj).pipe(
        catchError(this.handleError('Update Requested Caregiver Service', []))
      )
    }


    //Method for get caregiver Assigned list--
   GetCaregiverAssignedListService(status:any,userId:any,search:any,pageNumber:any,pageSize:any):Observable<any> {
   return this.http.get<any>(this.ApiUrl+"RequestCaregivers/get/caregiverAssignedlist?status="+status+"&userId="+userId+"&search="+search+"&pageNumber="+pageNumber+"&pageSize="+pageSize+"").pipe(catchError(this.handleError('Get Caregiver Assigned List')))
   }

   //this is error handler method--
   private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
}
}
