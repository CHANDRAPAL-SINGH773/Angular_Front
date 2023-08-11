import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, catchError, Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ManageReferralService {

  ApiUrl = environment.ICC_API ; //Access localhost API path from environment.ts file;
  constructor(private http: HttpClient) { }
   //Method for get all Referral list for manage screen--
   GetReferralListService(status:any,search:any,pageNumber:any,pageSize:any):Observable<any> {
    return this.http.get(this.ApiUrl+"Referral/get/getReferralList?status="+status+"&search="+search+"&pageNumber="+pageNumber+"&pageSize="+pageSize+"").pipe(catchError(this.handleError('Get All Referral list')))
    }

   //Methods for Referral status details-- 


   ChangeReferralStatus(dataObj:any): Observable<any>{
    return this.http.post(`${this.ApiUrl}Referral/changeReferralStatus`,dataObj).pipe(
      catchError(this.handleError('Change Referral details Service', []))
    )
}
    //Methods for Referral lock and unblock details-- 
    BlockUnblockReferral(dataObj:any): Observable<any>{
      return this.http.post(`${this.ApiUrl}Referral/blockUnblockReferral`,dataObj).pipe(
        catchError(this.handleError('Block Unblock Referral details Service', []))
      )
    }
  //Methods for delete Referral -- 
  DeletedReferral(id:number){
    const Id = id;
    const body = JSON.stringify(Id);
   return this.http.post(`${this.ApiUrl}Referral/deleteReferral?Id=`+Id,body).pipe(
     catchError(this.handleError(' delete Referral ', []))
   )
 }

     //this is error handler method--
     private handleError<T>(operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {
        return of(result as T);
      };
    }
}
