import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlatformAdminServiceService {
  ApiUrl = environment.ICC_API;
  constructor(private http: HttpClient) { }
  private getAllComapnyList = "Company/GetCompanyList";
  private changeComStatus="Company/ChangeComStatus";

  getCompanyList(search:string,PageNumber:number,PageSize:number): Observable<any> {    
    return this.http.get(`${this.ApiUrl +this.getAllComapnyList +"?Search="+search+"&PageNumber="+PageNumber+ "&PageSize="+PageSize}`)
      .pipe(map((data: any) => data || {}),
        catchError(this.handleError('getCompanyList Service')))
  }
  changeStatus(data:any): Observable<any> {   
      return this.http.patch(`${this.ApiUrl +this.changeComStatus}`,data)
      .pipe(map((data: any) => data || {}),
        catchError(this.handleError('change company Service')))
  }
  UpdateCompany(dataObj:any): Observable<any>{
    return this.http.post(`${this.ApiUrl}Company/UpdateCompany`,dataObj).pipe(
      catchError(this.handleError('Company Register', []))
    )
  }
  
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }
}

