import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GetAllMasterService } from '../../Services/Masters/get-all-master.service';
@Component({
  selector: 'app-masters',
  templateUrl: './masters.component.html',
  styleUrls: ['./masters.component.css']
})
export class MastersComponent implements OnInit {

  constructor( private getallMasterService :GetAllMasterService, private route: ActivatedRoute,private router: Router) { }
  masters : FormGroup;
  masterList:any =[];
  mastertype:any;
  ngOnInit(): void {
    this.GetAllMasterTypes();

  }
  GetAllMasterTypes():any{
    this.getallMasterService.getAllMastersList().subscribe((res:any)=>{
    if(res.data != null){
     this.masterList = res.data;
     }
    })
  }

  viewMasters():any{

  }
}
