import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, catchError, Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ManageCaregiverService {

  ApiUrl = environment.ICC_API ; //Access localhost API path from environment.ts file;
  constructor(private http: HttpClient) { }
   //Method for get all caregiver list for manage screen--
   GetCaregiverListService(agencyId:any,search:any,pageNumber:any,pageSize:any):Observable<any> {
    return this.http.get(this.ApiUrl+"Caregiver/get/getCaregiverList?AgencyId="+agencyId+"&search="+search+"&pageNumber="+pageNumber+"&pageSize="+pageSize+"").pipe(catchError(this.handleError('Get All Caregiver list')))
    }

   //Methods for caregiver status details-- 


   ChangeCaregiverStatus(dataObj:any): Observable<any>{
    return this.http.post(`${this.ApiUrl}Caregiver/changeCaregiverStatus`,dataObj).pipe(
      catchError(this.handleError('Change caregiver details Service', []))
    )
}
    //Methods for caregiver lock and unblock details-- 
    BlockUnblockcaregiver(dataObj:any): Observable<any>{
      return this.http.post(`${this.ApiUrl}Caregiver/blockUnblockCaregiver`,dataObj).pipe(
        catchError(this.handleError('Block Unblock caregiver details Service', []))
      )
    }
  //Methods for delete caregiver -- 
  DeletedCaregiver(id:number){
    const Id = id;
    const body = JSON.stringify(Id);
   return this.http.post(`${this.ApiUrl}Caregiver/deleteCaregiver?Id=`+Id,body).pipe(
     catchError(this.handleError(' delete caregiver ', []))
   )
 }

     //this is error handler method--
     private handleError<T>(operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {
        return of(result as T);
      };
    }
}
