import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, catchError, Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ManagePlanService {
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

  //Method for get all plan list--
    GetSubscriptionPlanList(search:any,pageNumber:any,pageSize:any):Observable<any> {
      return this.http.get<any>(this.ApiUrl+"SubscriptionPlan/get/planlist?search="+search+"&pageNumber="+pageNumber+"&pageSize="+pageSize+"").pipe(catchError(this.handleError('Get All Users list')))
      }

   //Methods for get particular Subscription Plan data-- 
    GetSubscriptionPlanData(id:number){
     return this.http.get<any>(this.ApiUrl+"SubscriptionPlan/getsubscriptionplandata?Id="+id+"").pipe(
     catchError(this.handleError('Get Particular User Data', [])))
    }

      //Methods for delete agency -- 
     DeleteSubscriptionPlan(id:number){
     const Id = id;
     const body = JSON.stringify(Id);
     return this.http.delete(`${this.ApiUrl}SubscriptionPlan/delete/plan?Id=`+Id).pipe(
      catchError(this.handleError(' delete user ', []))
      )
     }

   //Methods for plan active and deactive details-- 
    ActiveDeactivePlan(dataObj:any): Observable<any>{
      return this.http.post(`${this.ApiUrl}SubscriptionPlan/activedeactiveplan`,dataObj).pipe(
        catchError(this.handleError('Active Deactive details Service', []))
      )
    }


   //-------------------Discount Code Services ----------------------//

     //Method for get all Discount Code list--
     GetDiscountCodeList(search:any,pageNumber:any,pageSize:any):Observable<any> {
      return this.http.get<any>(this.ApiUrl+"DiscountCode/get/discountcodelist?search="+search+"&pageNumber="+pageNumber+"&pageSize="+pageSize+"").pipe(catchError(this.handleError('Get All Users list')))
      }
     
      //Methods to get Discount Code dropdownList-- 
     GetDiscountCodeDropdownListService():Observable<any> {
      return this.http.get(`${this.ApiUrl}DiscountCode/get/dropdownlist`).pipe(catchError(this.handleError('Get All Dropdowns')))
      }

         //this is Add Discount Code method--
     SaveDiscountCode(dataObj:any): Observable<any>{
     return this.http.post(`${this.ApiUrl}DiscountCode/save/discountcode`,dataObj).pipe(
      catchError(this.handleError('Add User Service', [])))
      }

      //this is Update Discount Code method--
     UpdateDiscountCode(dataObj:any): Observable<any>{
     return this.http.put(`${this.ApiUrl}DiscountCode/update/discountcode`,dataObj).pipe(
      catchError(this.handleError('Update User Service', [])))
     }

        //Methods for get particular Discount Code data-- 
     GetDiscountCodeData(id:number){
      return this.http.get<any>(this.ApiUrl+"DiscountCode/get/discountcodedata?Id="+id+"").pipe(
      catchError(this.handleError('Get Particular User Data', [])))
     }

        //Methods for plan active and deactive Discount Code 
     ActiveDeactiveDiscountCode(dataObj:any): Observable<any>{
      return this.http.post(`${this.ApiUrl}DiscountCode/activedeactive/discountcode`,dataObj).pipe(
        catchError(this.handleError('Active Deactive details Service', [])))
    }

      //Methods for delete agency -- 
      DeleteDiscountCode(id:number){
        const Id = id;
        const body = JSON.stringify(Id);
        return this.http.delete(`${this.ApiUrl}DiscountCode/delete/discountcode?Id=`+Id).pipe(
         catchError(this.handleError(' delete user ', [])))
        }





   //this is error handler method--
   private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
}
}
