import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, catchError, Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AddAgencyService {
  ApiUrl = environment.ICC_API ; //Access localhost API path from environment.ts file;
  constructor(private http: HttpClient) { }


   //this is Add agency service method--
   SaveAgencyService(dataObj:any): Observable<any>{
    return this.http.post(`${this.ApiUrl}Agency/addAgency`,dataObj).pipe(
      catchError(this.handleError('Add Agency Service', []))
    )
  }
  //Methods for get particular agency data-- 
  GetAgencyData(id:number){
    const Id = id;
    const body = JSON.stringify(Id);
    return this.http.post(`${this.ApiUrl}Agency/getAgencyData?Id=`+Id,body).pipe(
     catchError(this.handleError('Get Particular Agency Data', []))
   )
 }
   //this is Update agency details service method--
   UpdateAgencyService(dataObj:any): Observable<any>{
    return this.http.post(`${this.ApiUrl}Agency/updateAgency`,dataObj).pipe(
      catchError(this.handleError('Update Agency details Service', []))
    )
  } 

    //Methods for get particular agency data-- 
  GetAgencyProfileData(id:number){
      const Id = id;
      const body = JSON.stringify(Id);
      return this.http.post(`${this.ApiUrl}Agency/getAgencyProfileData?Id=`+Id,body).pipe(
       catchError(this.handleError('Get Particular Agency Data', []))
     )
   }

       //Methods for get particular agency data-- 
  GetAgencyID(id:number){
    const Id = id;
    const body = JSON.stringify(Id);
    return this.http.post(`${this.ApiUrl}Agency/getAgencyId?Id=`+Id,body).pipe(
     catchError(this.handleError('Get Particular Agency Id', []))
   )
 }

      //this is Add agency profile service method--
   SaveAgencyProfileService(dataObj:any): Observable<any>{
        return this.http.post(`${this.ApiUrl}Agency/addAgencyProfile`,dataObj).pipe(
          catchError(this.handleError('Add Agency Service', []))
        )
      }

        //this is Update user service method--
  UpdateAgencyProfileService(dataObj:any): Observable<any>{
    return this.http.put(`${this.ApiUrl}Agency/updateAgencyProfile`,dataObj).pipe(
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
