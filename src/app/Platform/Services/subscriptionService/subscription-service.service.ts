import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, catchError, Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  ApiUrl = environment.ICC_API ; //Access localhost API path from environment.ts file;
  constructor(private http: HttpClient) { }


   //this is Add Subscription Plan method--
   SaveSubscriptionPlan(dataObj:any): Observable<any>{
    return this.http.post(`${this.ApiUrl}SubscriptionPlan/save/plan`,dataObj).pipe(
      catchError(this.handleError('Add User Service', []))
    )
  }
  
  //this is UpdateSubscription Plan method--
  UpdateSubscriptionPlan(dataObj:any): Observable<any>{
    return this.http.put(`${this.ApiUrl}SubscriptionPlan/update/plan`,dataObj).pipe(
      catchError(this.handleError('Update User Service', []))
    )
  }

  //Methods to get Subscription Plan dropdownList-- 
    GetDropdownListService():Observable<any> {
      return this.http.get(`${this.ApiUrl}SubscriptionPlan/get/dropdownlist`).pipe(catchError(this.handleError('Get All Dropdowns')))
      }

   //Method for get Subscription plan list--
    GetSubscriptionPlanList(search:any,pageNumber:any,pageSize:any):Observable<any> {
      return this.http.get<any>(this.ApiUrl+"SubscriptionPlan/get/planlist?search="+search+"&pageNumber="+pageNumber+"&pageSize="+pageSize+"").pipe(catchError(this.handleError('Get All Users list')))
      }

   //Method for get all Payment Log List--
    GetSubscriptionPaymentLogList(search:any,pageNumber:any,pageSize:any,userId:any):Observable<any> {
      return this.http.get<any>(this.ApiUrl+"UserSubscription/get/paymentlog?search="+search+"&pageNumber="+pageNumber+"&pageSize="+pageSize+"&userId="+userId+"").pipe(catchError(this.handleError('Get All Users list')))
      }

    //Method for get Subscription Plan--
    GetSubscriptionPlan(usertype:any):Observable<any> {
      return this.http.get<any>(this.ApiUrl+"UserSubscription/get/plandetails?usertype="+usertype+"").pipe(catchError(this.handleError('Get Plan Detail')))
      }

        //Method for get Subscription Plan--
    CheckPromoCode(promocode:any):Observable<any> {
          return this.http.get<any>(this.ApiUrl+"UserSubscription/get/promocode?promocode="+promocode+"").pipe(catchError(this.handleError('Get Plan Detail')))
     }

   //Methods for get particular Subscription Plan data-- 
    GetSubscriptionPlanData(id:number){
     return this.http.get<any>(this.ApiUrl+"SubscriptionPlan/getsubscriptionplandata?Id="+id+"").pipe(
     catchError(this.handleError('Get Particular User Data', []))
     )
    }

      //Methods for delete agency -- 
     DeleteSubscriptionPlan(id:number){
     const Id = id;
     const body = JSON.stringify(Id);
     return this.http.delete(`${this.ApiUrl}SubscriptionPlan/delete/plan?Id=`+Id).pipe(
      catchError(this.handleError(' delete user ', []))
      )
     }


        //this is Add User Subscription method--
   SaveUserSubscription(dataObj:any): Observable<any>{
    return this.http.post(`${this.ApiUrl}UserSubscription/save/userplan`,dataObj).pipe(
      catchError(this.handleError('Add User Service', []))
    )
  }

  GetUserOrderDetail(logId:any,email:any,userId:any):Observable<any> {
    return this.http.get<any>(this.ApiUrl+"UserSubscription/get/orderdetails?logId="+logId+"&userEmail="+email+"&UserId="+userId+"").pipe(catchError(this.handleError('Get Plan Detail')))
    }

      //Methods for cancel subscription -- 
  CancelSubscription(dataObj:any): Observable<any>{
    return this.http.post(`${this.ApiUrl}UserSubscription/cancelsubscription`,dataObj).pipe(
     catchError(this.handleError('Cancel Subscription Service', []))
    )}

   //this is error handler method--
   private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
}
}
