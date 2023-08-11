import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GetAllMasterService } from 'src/app/Platform/Services/Masters/get-all-master.service';

@Component({
  selector: 'app-all-masters',
  templateUrl: './all-masters.component.html',
  styleUrls: ['./all-masters.component.css']
})
export class AllMastersComponent implements OnInit {

  constructor( private getallMasterService :GetAllMasterService, private route: ActivatedRoute,private router: Router) { }
  masters : FormGroup;
  masterList:any =[];
  mastertype:any;
  ngOnInit(): void {
    //this.getOfficeMastersList();

  }
  // getOfficeMastersList():any{
  //   this.getallMasterService.getOfficeMastersList().subscribe((res:any)=>{
  //   if(res.data != null){
  //    this.masterList = res.data;
  //    }
  //   })
  // }

  viewMasters():any{

  }
}
