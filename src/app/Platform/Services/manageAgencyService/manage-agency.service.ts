import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, catchError, Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ManageAgencyService {

  ApiUrl = environment.ICC_API ; //Access localhost API path from environment.ts file;
  constructor(private http: HttpClient) { }
  
   //Method for get all agency list for manage screen--
   GetAgencyListService(search:any,pageNumber:any,pageSize:any):Observable<any> {
    return this.http.get(this.ApiUrl+"Agency/get/getAgencyList?search="+search+"&pageNumber="+pageNumber+"&pageSize="+pageSize+"").pipe(catchError(this.handleError('Get All Agencies list')))
    }

     //this is error handler method--
    private handleError<T>(operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {
        return of(result as T);
      };
    }

     //Methods for agency status details-- 


  ChangeAgencyStatus(dataObj:any): Observable<any>{
    return this.http.post(`${this.ApiUrl}Agency/changeAgencyStatus`,dataObj).pipe(
      catchError(this.handleError('Change Agency details Service', []))
    )
}
    //Methods for agency lock and unblock details-- 
    BlockUnblockAgency(dataObj:any): Observable<any>{
      return this.http.post(`${this.ApiUrl}Agency/blockUnblockAgency`,dataObj).pipe(
        catchError(this.handleError('Block Unblock Agency details Service', []))
      )
    }
  //Methods for delete agency -- 
  DeletedAgency(id:number){
    const Id = id;
    const body = JSON.stringify(Id);
   return this.http.post(`${this.ApiUrl}Agency/deleteAgency?Id=`+Id,body).pipe(
     catchError(this.handleError(' delete agency ', []))
   )
 }
}
