import { Component, OnInit } from '@angular/core';
import { CommonService } from './lib/Models/Common/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'CareConnectionsUI';
  constructor(private api:CommonService) { }
  ngOnInit(): void {
    let obj={
      productCode:20,
      productName:"ssp",
      search:4,
      pageNumber:22,
      pageSize:40
    }
    this.api.getProduct(obj).subscribe(res=>{console.log(res.data)})
  }

}
