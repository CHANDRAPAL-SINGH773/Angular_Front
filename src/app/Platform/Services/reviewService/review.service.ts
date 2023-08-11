import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, catchError, Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  ApiUrl = environment.ICC_API ; //Access localhost API path from environment.ts file;
  constructor(private http: HttpClient) { }

//Methods for get rating reviews service-- 
  getRatings(userId:any, search:any,pageNumber:any,pageSize:any):Observable<any>{
    return this.http.get(this.ApiUrl+"RequestCaregivers/getRatingReviewList?UserId="+userId+"&search="+search+"&pageNumber="+pageNumber+"&pageSize="+pageSize+"").pipe(catchError(this.handleError('Get all rating review list')))
  }

   //method is use for approved and disapproved Service--
   ApproveDisapprovedService(dataObj:any): Observable<any>{
    return this.http.post(`${this.ApiUrl}RequestCaregivers/approvedDisapproved`,dataObj).pipe(
      catchError(this.handleError('method is use for approved and disapproved Service', []))
    )
  }

     //this is error handler method--
     private handleError<T>(operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {
        return of(result as T);
      };
    }
}
