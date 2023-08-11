import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusinessPartnerServiceService } from '../business-partner-service.service';
import { environment } from 'src/environments/environment';
import { AcpPartnerService } from 'src/app/lib/services/AcpPartner/acp-partner.service';

@Component({
  selector: 'app-business-partner-detail',
  templateUrl: './business-partner-detail.component.html',
  styleUrls: ['./business-partner-detail.component.scss']
})
export class BusinessPartnerDetailComponent implements OnInit {
  id: number;
  loader=false;
  private sub: any;
  businessPartnerDetail:any
  constructor(private route: ActivatedRoute,private bpservice:BusinessPartnerServiceService,
    private Acp_Partner:AcpPartnerService) { }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; 
      if(this.id>0){
        this.GetBPDetails(this.id)
      }
      
   });
  }

  GetBPDetails(bpId:number){
    this.loader=true;
    this.bpservice.GetBusinessPartnerDetail(bpId).subscribe((response: any) => {
      if (response.statusCode==200){
        this.businessPartnerDetail=response.responseData[0];
        this.loader=false;
      }

    else{
      this.businessPartnerDetail=[]
      this.loader=false;
    }

      
    });
  }

  downloadfile(doc:any){
    this.loader=true;
 var fullPath=this.createImgPath(doc.fileUrl)
 this.loader=false;
 this.Acp_Partner.downloadFile(fullPath)
  }

  createImgPath = (serverPath: string) => {
    var path = `${environment.imageUrl}${serverPath}`;
    return path;

  };

}
