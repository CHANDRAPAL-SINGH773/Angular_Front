import { Component, OnInit, Pipe, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';
import { DefaultNumber } from 'src/app/Shared/Enums/Default.enums';
import { CommonSuccessMessages } from 'src/app/Utilities/common/CommonSuccessMessage';
import { environment } from 'src/environments/environment';
import { ReviewService } from '../../Services/reviewService/review.service';
export interface PeriodicElement {
  checkbox: string;
  dateTime: string;
  title:string;
  ratings: string
  message: string;
  Action:string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {checkbox: '', dateTime: '10:41 PM', title: 'Wirst caregiver', ratings: '2.0', message: 'Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.', Action:''},
  {checkbox: '', dateTime: '10:41 PM', title: 'Wirst caregiver', ratings: '2.0', message: 'Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.', Action:''},
  {checkbox: '', dateTime: '10:41 PM', title: 'Wirst caregiver', ratings: '2.0', message: 'Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.', Action:''},
  {checkbox: '', dateTime: '10:41 PM', title: 'Wirst caregiver', ratings: '2.0', message: 'Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.', Action:''},
  {checkbox: '', dateTime: '10:41 PM', title: 'Wirst caregiver', ratings: '2.0', message: 'Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.', Action:''},
];

@Component({
  selector: 'app-manage-reviews',
  templateUrl: './manage-reviews.component.html',
  styleUrls: ['./manage-reviews.component.css']
})

export class ManageReviewsComponent implements OnInit {
  displayedColumns: string[] = ["dateTime", "title", "ratings", "message","Action"];  
  dataSource : MatTableDataSource<any> = new MatTableDataSource();
  recordcount: number = DefaultNumber.Zero;
  pagesize:number= environment.defaultPageSize;
  pageIndex: number = DefaultNumber.Zero;
  pageSizeList = environment.pageSizeList;
  loaderflag: boolean= false;
  noReview: boolean = false;
  Reviewcounts : any;
  AvgReview:any;
  ratingList:any =[];
  userid:any;
  search : string ='';
  hide : boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  constructor( private _ratingService : ReviewService,
    public authService: AuthService,
    private _toasterService: ToastrService,) { }

  ngOnInit(): void {
    this.userid = this.authService.userID;
    this.getReviewRatings('Searching');
  }

 
  pageChangeEvent(event:any) {}
  getReviewRatings(type:any){
    this.loaderflag = true;
    if(type=="Paging")
    {
      this.recordcount = this.pageIndex * this.pagesize;
    }
    else {
      this.recordcount = DefaultNumber.Zero;
      this.pageIndex = DefaultNumber.Zero;
    }
    this._ratingService.getRatings(this.userid ,this.search,this.pageIndex,this.pagesize).subscribe((response: any) => {

     console.log(response)

     if(response.data.length == 0){
      this.loaderflag = false;
      this.hide= true;
     }
     this.dataSource =  new MatTableDataSource(response.data);
     this.dataSource.paginator = this.paginator;
     this.recordcount =  this.dataSource.data.length > 0 ? this.dataSource.data.length :0;
     if(this.recordcount>0)
     {
      this.loaderflag = false;
       this.hide= true;
     }
     else{
       this.hide = false;
     }
    })
  } 

  ApproveDisapproveReview(Id:Number, flag:any){ 
  const model={
        RatingId : Id,
        RatingFlag:flag
      }
    this._ratingService.ApproveDisapprovedService(model).subscribe((response: any) => {
      if (response.statusCode == 200) {
        let res = parseInt(response.message)
       this._toasterService.success(CommonSuccessMessages.ReviewUpdate, "", {
         timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
       });
      this.getReviewRatings('searching');
      }
    })
  }

  sortData(sort: Sort) {
    const data = this.dataSource.data.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }
 
    this.dataSource.data = data.sort((a:any,b:any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {        
        case 'dateTime': return compare(a.CreatedOn, b.CreatedOn, isAsc);
        case 'title': return compare(a.Comment, b.Comment, isAsc);
        case 'ratings': return compare(a.RatingStar, b.RatingStar, isAsc);
        case 'message': return compare(a.Comment, b.Comment, isAsc);

        // case 'caregiverAssocciate': return compare(, isAsc);
        default: return 0;
      }
    });
    
  }
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
