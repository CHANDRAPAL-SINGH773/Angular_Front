import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DefaultNumber } from 'src/app/Shared/Enums/Default.enums';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { ManageNotificationService } from '../../Services/manageNotificationService/manage-notification.service';

@Component({
  selector: 'app-manage-notification',
  templateUrl: './manage-notification.component.html',
  styleUrls: ['./manage-notification.component.css']
})
export class ManageNotificationComponent implements OnInit {

  constructor( private _notificationService : ManageNotificationService) { }

  ngOnInit(): void {
        this.GetNotificationList("searching");
  }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ["dateTime","title","message", "receiver","action"];  
  dataSource : MatTableDataSource<any> = new MatTableDataSource();
  loaderflag: boolean= false;
  recordcount: number = DefaultNumber.Zero;
  pagesize:number= environment.defaultPageSize;;
  pageIndex: number = DefaultNumber.Zero;
  pageSizeList = environment.pageSizeList;
  hide : boolean = false;
  search : string ='';

  pageChangeEvent(event:any) {}
  totalPages = environment.defaultshowTotalPages;
  //Method used for shorting manage screen data--
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
        case 'title': return compare(a.Title, b.Title, isAsc);
        case 'message': return compare(a.NotificationMessage, b.NotificationMessage, isAsc);
        case 'receiver': return compare(a.Receiver, b.Receiver, isAsc);
        default: return 0;
      }
    });
    
  }

    //Method is used for Get Notification List --
    GetNotificationList(type:any):any{
      if(type=="Paging")
      {
        this.recordcount = this.pageIndex * this.pagesize;
      }
      else {
        this.recordcount = DefaultNumber.Zero;
        this.pageIndex = DefaultNumber.Zero;
      }
    this._notificationService.GetAllNotificationList(this.search,this.pageIndex,this.pagesize).subscribe((response:any)=>{
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

    //Method is used for DeleteNotification--
    DeleteNotification(id:any):any{
        Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
          if (result.isConfirmed) {
            this._notificationService.DeleteNotification(id).subscribe((response:any) => {
              if(response.message='OK'){
                Swal.fire(
                  'Deleted!',
                  'Notification has been deleted successfully.',
                  'success'
                )
                this.GetNotificationList("searching");
              }
            })
          }
        })
    }
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}