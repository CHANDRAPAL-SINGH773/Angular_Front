import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, catchError, Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AddAssociateService {
  ApiUrl = environment.ICC_API ; //Access localhost API path from environment.ts file;
  constructor(private http: HttpClient) { }


     //Method for get all associate--
   GetAssociateListService(userId:any,search:any,pageNumber:any,pageSize:any):Observable<any> {
      return this.http.get(this.ApiUrl+"Associate/getAssociateList?userId="+userId+"&search="+search+"&pageNumber="+pageNumber+"&pageSize="+pageSize+"").pipe(catchError(this.handleError('Get All Agencies list')))
   }

     //Methods for get All Dropdown list-- 
  GetAssociateDropDownListService():Observable<any> {
    return this.http.get(`${this.ApiUrl}Associate/get/dropdownlist`).pipe(catchError(this.handleError('Get All DropDown')))
   }

   //Methods for Associate 
   DeleteAssociate(id:number){
    const Id = id;
    const body = JSON.stringify(Id);
    return this.http.delete(`${this.ApiUrl}Associate/delete/associate?Id=`+Id).pipe(
     catchError(this.handleError(' delete user ', []))
     )
    }

   //Methods for Associate
    ActiveDeactiveAssociate(dataObj:any): Observable<any>{
    return this.http.post(`${this.ApiUrl}Associate/activedeactiveassociate`,dataObj).pipe(
       catchError(this.handleError('Active Deactive details Service', [])))}

   //this is Add Associate service method--
   SaveAssociateService(dataObj:any): Observable<any>{
    return this.http.post(`${this.ApiUrl}Associate/addassociate`,dataObj).pipe(
      catchError(this.handleError('Add Associate Service', []))
    )
  }
  //Methods for get particular Associate data-- 
  GetAssociateData(id:number){
    const Id = id;
    const body = JSON.stringify(Id);
   return this.http.post(`${this.ApiUrl}Associate/getassociatedata?Id=`+Id,body).pipe(
     catchError(this.handleError('Get Particular Associate Data', []))
   )
 }
   //this is Update Associate details service method--
   UpdateAssociateService(dataObj:any): Observable<any>{
    return this.http.put(`${this.ApiUrl}Associate/updateassociate`,dataObj).pipe(
      catchError(this.handleError('Update Associate details Service', []))
    )
  } 
   //this is error handler method--
   private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
}
}
