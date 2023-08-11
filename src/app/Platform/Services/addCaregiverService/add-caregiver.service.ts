import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddCaregiverService {

  ApiUrl = environment.ICC_API ; //Access localhost API path from environment.ts file;
  constructor(private http: HttpClient) { }




     //this is Add caregiver admin details service method--
     SavecaregiverAdminDetailsService(dataObj:any): Observable<any>{
      return this.http.post(`${this.ApiUrl}Caregiver/addCaregiverAdminSection`,dataObj).pipe(
        catchError(this.handleError('Add Caregiver Admin details Service', []))
      )
    }

     //this is Update caregiver admin details service method--
      UpdatecaregiverAdminDetailsService(dataObj:any): Observable<any>{
      return this.http.post(`${this.ApiUrl}Caregiver/updateCaregiverAdminSection`,dataObj).pipe(
      catchError(this.handleError('Update Caregiver Admin details Service', []))
      )
    }

    //this is Add caregiver service method--
    SavecaregiverService(dataObj:any): Observable<any>{
    return this.http.post(`${this.ApiUrl}Caregiver/addCaregiver`,dataObj).pipe(
      catchError(this.handleError('Add Caregiver Service', []))
    )
   }

   //this is Add caregiver Qualification method--
    SavecaregiverQualificationDetails(dataObj:any): Observable<any>{
    return this.http.post(`${this.ApiUrl}Caregiver/addCaregiverQualification`,dataObj).pipe(
     catchError(this.handleError('Add Caregiver Qualification Service', []))
    )
  }

    //this is Update caregiver Qualification method--
    UpdatecaregiverQualificationDetails(dataObj:any): Observable<any>{
      return this.http.post(`${this.ApiUrl}Caregiver/updateCaregiverQualification`,dataObj).pipe(
        catchError(this.handleError('update Caregiver Qualification Service', []))
       )
     }

  //this is Add caregiver experince method--
  SavecaregiverExperinceDetails(dataObj:any): Observable<any>{
  return this.http.post(`${this.ApiUrl}Caregiver/savecaregiverExperince`,dataObj).pipe(
     catchError(this.handleError('Add Caregiver Experince Service', []))
   )
  }

    //this is Add caregiver experince method--
    UpdatecaregiverExperinceDetails(dataObj:any): Observable<any>{
      return this.http.post(`${this.ApiUrl}Caregiver/updatecaregiverExperince`,dataObj).pipe(
         catchError(this.handleError('Update Caregiver Experince Service', []))
       )
      }

    //this is Delete caregiver qualification method--
    DeletecaregiverQualification(dataObj:any): Observable<any>{
      return this.http.post(`${this.ApiUrl}Caregiver/deletecaregiverQualification`,dataObj).pipe(
         catchError(this.handleError('Delete Caregiver Qualification Service', []))
       )
  }
     //this is Delete caregiver experince method--
     DeletecaregiverExperince(dataObj:any): Observable<any>{
      return this.http.post(`${this.ApiUrl}Caregiver/deletecaregiverExperince`,dataObj).pipe(
         catchError(this.handleError('Delete Caregiver Experince Service', []))
       )
  }

    //this is get  caregiver qualification details for edit (service)--
    GetcaregiverQualificationForEdit(id:number): Observable<any>{
      const Id = id;
      const body = JSON.stringify(Id);
     return this.http.post(`${this.ApiUrl}Caregiver/getCaregiverQualificationForEdit?Id=`+Id,body).pipe(
      catchError(this.handleError('Get Caregive Qualification details for edit', []))
     )
  }
    //method is used for get caregiver experince details for edit (service)--
    GetcaregiverExperinceForEdit(id:number): Observable<any>{
      const Id = id;
      const body = JSON.stringify(Id);
     return this.http.post(`${this.ApiUrl}Caregiver/getCaregiverExperinceForEdit?Id=`+Id,body).pipe(
         catchError(this.handleError('Get caregiver experince details for edit', []))
       )
  }

  //Methods for get particular caregiver data-- 
  GetCaregiverData(id:number){
    const Id = id;
    const body = JSON.stringify(Id);
   return this.http.post(`${this.ApiUrl}Caregiver/getCaregiverData?Id=`+Id,body).pipe(
     catchError(this.handleError('Get Particular Caregiver Data', []))
   )
 }
 //Methods for get particular caregiver  Qualification details-- 
 GetCaregiverQualification(id:number){
  const Id = id;
  const body = JSON.stringify(Id);
 return this.http.post(`${this.ApiUrl}Caregiver/getCaregiverQualificationList?Id=`+Id,body).pipe(
   catchError(this.handleError('Get Particular Caregiver Data', []))
 )
}

 //Methods for get particular caregiver  Experince details-- 
 GetCaregiverExperince(id:number){
  const Id = id;
  const body = JSON.stringify(Id);
 return this.http.post(`${this.ApiUrl}Caregiver/getCaregiverExperinceList?Id=`+Id,body).pipe(
   catchError(this.handleError('Get Particular Caregiver Experince Data', []))
 )
}
   //this is Update Caregiver details service method--
   UpdateCaregiverService(dataObj:any): Observable<any>{
    return this.http.post(`${this.ApiUrl}Caregiver/updateCaregiver`,dataObj).pipe(
      catchError(this.handleError('Update Caregiver details Service', []))
    )
  }
    //Methods for get particular caregiver data-- 
    GetCareGiverData(id:number){
      const Id = id;
      const body = JSON.stringify(Id);
     return this.http.post(`${this.ApiUrl}Caregiver/getCaregiverData?Id=`+Id,body).pipe(
       catchError(this.handleError('Get Particular caregiver Data', []))
     )
   } 

     //this is Add caregiver admin details service method--
     insertCaregiverEvent(dataObj:any): Observable<any>{
      return this.http.post(`${this.ApiUrl}Caregiver/createCaregiverSchedulerEvents`,dataObj).pipe(
        catchError(this.handleError('insert Caregiver Event details Service', []))
      )
    }

     //method for insert caregiver skills--
      insertCaregiverSkillDetails(dataObj:any): Observable<any>{
       return this.http.post(`${this.ApiUrl}Caregiver/insertCaregiverSkills`,dataObj).pipe(
       catchError(this.handleError('insert Caregiver Skill details Service', []))
          )
        }
     //this is Add New Skill service method--
     AddNewSkillsService(dataObj:any): Observable<any>{
      return this.http.post(`${this.ApiUrl}Caregiver/addNewSkills`,dataObj).pipe(
        catchError(this.handleError('Add new skill Service', []))
      )
    }
 
    GetCaregiverProfileData(id:number){
      const Id = id;
      const body = JSON.stringify(Id);
     return this.http.post(`${this.ApiUrl}Caregiver/getCaregiverProfileData?Id=`+Id,body).pipe(
       catchError(this.handleError('Get Particular Caregiver Data', []))
     )
   }


     //this is Add caregiver rating service --
    AddCaregiverRating(dataObj:any): Observable<any>{
    return this.http.post(`${this.ApiUrl}Caregiver/addCaregiverRating`,dataObj).pipe(
       catchError(this.handleError('Add Caregiver Rating Service', []))
     )
    }

   SendCaregiverInviteService(id:any): Observable<any>{
    const Id = id;
    const body = JSON.stringify(Id);
    return this.http.post(`${this.ApiUrl}Caregiver/send/invite?Id=`+Id,body).pipe(
    catchError(this.handleError('Get Caregiver Ratings', []))
      )
    }

//Methods for get caregiver rating service-- 
 GetCaregiverService(id:number){
   const Id = id;
   const body = JSON.stringify(Id);
   return this.http.post(`${this.ApiUrl}Caregiver/getCaregiverRatingList?Id=`+Id,body).pipe(
   catchError(this.handleError('Get Caregiver Ratings', []))
 )
}

   //this is error handler method--
   private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
}
}
