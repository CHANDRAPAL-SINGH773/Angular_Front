import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, catchError, map, Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CredentialingServiceService {

  ApiUrl = environment.ICC_API ; //Access localhost API path from environment.ts file;
  constructor(private http: HttpClient) { }
  
   //Method is used for get credentialing list service--
   GetCredentialingListService(search:any,pageNumber:any,pageSize:any):Observable<any> {
    return this.http.get(this.ApiUrl+"Credentialing/get/getCredentialingList?search="+search+"&pageNumber="+pageNumber+"&pageSize="+pageSize+"").pipe(catchError(this.handleError('Get All Credentialing list')))
    }

  //Methods is used for change credentialing status-- 
  ChangeCredentialingStatus(dataObj:any): Observable<any>{
    return this.http.post(`${this.ApiUrl}Credentialing/changeCredentialingStatus`,dataObj).pipe(
      catchError(this.handleError('Change Credentialing status Service', []))
    )
  }
    //Methods for get Credentialing data-- 
    GetCredentialingData(id:Number){
      const Id = id;
      const body = JSON.stringify(Id);
      return this.http.post(`${this.ApiUrl}Credentialing/getCredentialingData?Id=`+Id,body).pipe(
       catchError(this.handleError('Get Particular Credential Data', []))
     )
   }

       //Methods for get Credentialing data-- 
    GetParticularCredentialingList(id:number){
        const Id = id;
        const body = JSON.stringify(Id);
        return this.http.post(`${this.ApiUrl}Credentialing/getparticularCredentialingList?Id=`+Id,body).pipe(
         catchError(this.handleError('Get Particular Credential List', []))
       )
     }

  //Methods is used for delete credentialing details-- 
  DeletedCredentialing(id:number){
    const Id = id;
    const body = JSON.stringify(Id);
   return this.http.post(`${this.ApiUrl}Credentialing/deleteAllCredential?Id=`+Id,body).pipe(
     catchError(this.handleError(' delete Credentialing ', []))
   )
 }

   //Methods is used for delete credentialing details-- 
   DeletedParticularCredentialing(id:number){
    const Id = id;
    const body = JSON.stringify(Id);
   return this.http.post(`${this.ApiUrl}Credentialing/deleteParticularCredential?Id=`+Id,body).pipe(
     catchError(this.handleError(' delete Credentialing ', []))
   )
 }

    //this is add credentialing service method--
    SaveCredentialingService(dataObj:any): Observable<any>{
      return this.http.post(`${this.ApiUrl}Credentialing/save/addCredential`,dataObj).pipe(
        catchError(this.handleError('Add Credential Service', []))
      )
    }
 
  //Methods for get All Dropdown list-- 
  GetCredentialingDropDownListService():Observable<any> {
    return this.http.get(`${this.ApiUrl}Credentialing/get/dropdownlist`).pipe(catchError(this.handleError('Get All DropDown')))
    }


   getFiles(url:any){

    return this.http.get(`${this.ApiUrl}Credentialing/download?path=`+url, {responseType:'blob' }).pipe(map(
        (res: any) => {
            return res;
      }));

  }
  

     //this is error handler method--
     private handleError<T>(operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {
        return of(result as T);
      };
    }
}
