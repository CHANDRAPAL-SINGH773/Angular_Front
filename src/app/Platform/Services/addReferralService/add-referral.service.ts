import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, catchError, Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AddReferralService {
  ApiUrl = environment.ICC_API ; //Access localhost API path from environment.ts file;
  constructor(private http: HttpClient) { }


   //this is Add referral service method--
   SaveReferralService(dataObj:any): Observable<any>{
    return this.http.post(`${this.ApiUrl}Referral/addReferral`,dataObj).pipe(
      catchError(this.handleError('Add Referral Service', []))
    )
  }
  //Methods for get particular agency data-- 
  GetReferralData(id:number){
    const Id = id;
    const body = JSON.stringify(Id);
    return this.http.post(`${this.ApiUrl}Referral/getReferralData?Id=`+Id,body).pipe(
     catchError(this.handleError('Get Particular Referral Data', []))
   )
 }
   //this is Update agency details service method--
   UpdateReferralService(dataObj:any): Observable<any>{
    return this.http.post(`${this.ApiUrl}Referral/updateReferral`,dataObj).pipe(
      catchError(this.handleError('Update Referral details Service', []))
    )
  }
    
    //Methods for get particular agency data-- 
    SendInviteReferralService(id:number){
      const Id = id;
      const body = JSON.stringify(Id);
      return this.http.post(`${this.ApiUrl}Referral/sendinvite?Id=`+Id,body).pipe(
      catchError(this.handleError('Send Invite Referral ', []))
     )
   }

     //Methods for get particular agency data-- 
  GetReferralProfileData(id:number){
    const Id = id;
    const body = JSON.stringify(Id);
    return this.http.post(`${this.ApiUrl}Referral/getReferralProfileData?Id=`+Id,body).pipe(
     catchError(this.handleError('Get Particular Referral Data', []))
   )
 }

    //this is Add referral Profile service method--
    SaveReferralProfileService(dataObj:any): Observable<any>{
      return this.http.post(`${this.ApiUrl}Referral/add/profile`,dataObj).pipe(
        catchError(this.handleError('Add Referral Service', []))
      )
    }

            //this is Update user service method--
  UpdateReferralProfileService(dataObj:any): Observable<any>{
    return this.http.put(`${this.ApiUrl}Referral/update/Profile`,dataObj).pipe(
      catchError(this.handleError('Update User Service', []))
    )
  }

   //this is error handler method--
   private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
}
}
