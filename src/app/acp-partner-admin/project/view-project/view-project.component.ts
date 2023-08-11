import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'src/app/core/storage/localstorage.service';
import { ProjectService } from '../project.service';
import { CommonErrorMessages } from 'src/app/Utilities/common/CommonErrorMessage';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.scss']
})
export class ViewProjectComponent implements OnInit {
  projectid: number;
  loader = false;
  private sub: any;
  companyId: any
  acpPartnerId: any
  userId: any
  projectList: any
  installationType: any
  Manpower: any
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = [
    'name',
    'role',
    'training',
    'Action'
  ];
  constructor(private route: ActivatedRoute, private localstorage: LocalStorageService,
    private projectservice: ProjectService) { }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.projectid = +params['projectid'];
      this.companyId = Number(this.localstorage.getCompanyID());
      this.acpPartnerId = Number(this.localstorage.getAcpPartnerID());
      this.userId = Number(this.localstorage.getUserId());
      this.dataSource.sort = this.sort;
      this.GetInstallationOption();
      this.GetManPower();
      if (this.projectid > 0 && this.companyId > 0 && this.acpPartnerId > 0) {
        this.GetProjectDetails(this.projectid, this.companyId, this.acpPartnerId)

      }

    });
  }

  DeleteStaff(staffDetails: any) {
    console.log("To be deleted",staffDetails)
    if (staffDetails.projectAssessorInstallerId) {
      Swal.fire({
        title: 'Are you sure?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.loader = true;
          this.projectservice.deleteProjectStaff(staffDetails.projectAssessorInstallerId, staffDetails.staffId, staffDetails.companyId,staffDetails.acpPartnerId, this.userId).subscribe((response: any) => {
            if (response.statusCode == 200) {
              this.loader = false;
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: response.message,
                showConfirmButton: false,
                timer: 2200,

              });
              this.GetProjectDetails(this.projectid, this.companyId, this.acpPartnerId);
            }
            else {
              this.loader = false;
              Swal.fire({
                position: 'center',
                icon: 'error',
                title: response.message,
                showConfirmButton: false,
                timer: 2200,

              });

              this.GetProjectDetails(this.projectid, this.companyId, this.acpPartnerId);
            }
          });
        }
      })
    }
  }
  GetProjectDetails(projectId: number, companyID: number, AcpPartnerId: number) {
    this.projectservice.getProjectDetailsByid(projectId, companyID, AcpPartnerId).subscribe((response: any) => {
      if (response != null) {
        console.log("All Project Details", response.responseData[0]);
        this.projectList = response.responseData[0]
        this.GetProjectStaff(projectId, companyID, AcpPartnerId);
      }
      else {
        this.projectList = null;
      }

    })
  }

  GetProjectStaff(projectId: number, companyID: number, AcpPartnerId: number) {
    this.projectservice.getProjectStaffDetails(projectId, companyID, AcpPartnerId).subscribe((response: any) => {
      if (response != null) {
        this.dataSource = new MatTableDataSource(response.responseData);

      }
      else {
        this.dataSource = new MatTableDataSource();
      }

    })
  }
  GetInstallationOption() {
    this.installationType = CommonErrorMessages.installationType()
  }
  GetManPower() {
    this.Manpower = CommonErrorMessages.Manpower()
  }
  getInstallationType(id: any) {
    const matchedObject = this.installationType.find((item: any) => item.id === id);
    return matchedObject ? matchedObject.name : 'Not found';
  }
  getStatus(id: any) {
    const matchedObject = this.Manpower.find((item: any) => item.id === id);
    return matchedObject ? matchedObject.name : 'Not found';
  }

}
