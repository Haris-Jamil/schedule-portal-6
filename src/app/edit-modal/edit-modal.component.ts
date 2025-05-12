import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ProjectService } from '../service/project.service';
import { RejectionService } from '../service/rejection.service';
import { TypeService } from '../service/type.service';
import { LoginService } from '../service/login.service';
declare var $;

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.css']
})
export class EditModalComponent implements OnInit, OnChanges {
  
  @Input() updateData: any;

  to: string;
  typeOfBid: string;
  natureOfBid: string;
  wRemarks: string;
  zRemarks: string;
  otherReason: string = '';
  quoteRec: number = 0;
  loading: boolean = false;
  loadingRejectionDlt: boolean = false;
  loadingRejectionRfiDlt: boolean = false;
  loadingCopy: boolean = false;

  msgType: string;
  msg: string;
  showMsg: boolean = false;
  awarded: string = "";

  types: any[] = [];

  cc: any = { 
    'BD': false,
    'SH': false,
    'RF': false,
    'SD': false,
    'SF': false,
    'NV': false,
    'BR': false,
    'SR': false,
    'JN': false
  };

  isOperator: boolean = false;
  
  constructor(private projectService: ProjectService, private typeService: TypeService, private rejectionService: RejectionService, private loginService: LoginService) { }

  
  reInitForm(){
    this.to = undefined;
    this.typeOfBid = undefined;
    this.natureOfBid = undefined;
    this.wRemarks = undefined;
    this.zRemarks = undefined;
    this.otherReason = '';
    this.quoteRec = 0;
    this.loading = false;

    this.msgType = undefined;
    this.msg = undefined;
    this.showMsg= false;
    this.awarded = '';    

    this.cc = { 
      'BD': false,
      'SH': false,
      'RF': false,
      'SD': false,
      'SF': false,
      'NV': false,
      'BR': false,
      'SR': false,
      'JN': false
    };
  }

  ngOnInit() {
    this.isOperator = this.loginService.isVisitor();
    this.typeService.getAllTypes().subscribe( (resp: any) => {
      this.types = resp;
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.reInitForm();
    this.updateData = changes.updateData.currentValue;        
    this.to = this.updateData._to;
    this.typeOfBid = this.updateData.type;
    this.natureOfBid = this.updateData.nature;
    this.wRemarks = this.updateData.WJ;
    this.zRemarks = this.updateData.ZB;
    this.otherReason = this.updateData.reason;
    this.quoteRec = this.updateData.quote_recieved;
    this.awarded = this.updateData.awarded;
    let submitRadio: any;
    if(this.updateData.submitted){      
      submitRadio = <any>document.querySelector(`input[name="subRadio"][value="${this.updateData.submitted}"]`);
      submitRadio.checked = true;
    } else {  
      submitRadio = <any>document.querySelector(`input[name="subRadio"]:checked`)
      if(submitRadio){
        submitRadio.checked = false
      }
    }    
    this.setCc();
  }

  setCc(): void{
    if(this.updateData._cc){
      let ccToAdd = this.updateData._cc.split(", ");
      for(let i in ccToAdd){
        this.cc[ ccToAdd[i] ] = true;
      }
    } else {
      for(let i in this.cc){
        this.cc[i] = false;
      }
    }
  }

  copyProject(): void {
    this.loadingCopy = true;
    this.projectService.copyProject(this.updateData.id).subscribe((response) => {
      if(response == 1){
        this.projectService.emitDataChange();
        this.loadingCopy = false;
        this.msgType = 'success';
        this.notify('success', 'Copy Successful');
        $('#editModal').modal('toggle');
      } else {
        this.loadingCopy = false;
        this.notify('danger', 'Some Error occured');
      }
    });
  }

  editProject(): void{
    
    let formData = new FormData(); 
    this.loading = true;

    let editObj = {  
      'id': this.updateData.id,  
      'submitted': this.getradioValue('subRadio'),
      'to': this.getradioValue('toRadio'),   
      'zValid': this.getradioValue('zRadio'),
      'wValid': this.getradioValue('wRadio'),    
      'typeOfBid': this.getradioValue('optradio'),
      'nature': this.getradioValue('natureRadio'),
      'reason': this.otherReason,  
      'submitByDay': this.updateData.submit_by_day,
      'submitByMonth': this.updateData.submit_by_month,
      'submitByYear': this.updateData.submit_by_year,  
      'folderAssignDay': this.updateData.folder_assigned_day,
      'folderAssignMonth': this.updateData.folder_assigned_month,
      'folderAssignYear': this.updateData.folder_assigned_year,
      'title': this.updateData.title,
      'state': this.updateData.state,
      'qr': this.quoteRec,     
      'cc': this.getSelectCC(),
      'refnum': this.updateData.refnum,
      'type': this.updateData.ptype,
      'code': this.updateData.code,
      'awarded': this.awarded,
      'submitByHour': this.updateData.submit_by_hour,
      'submitByMinute': this.updateData.submit_by_minute,
      'meridiem': this.updateData.meridiem,
      'timeZone': this.updateData.timeZone
    }

    for(let key in editObj)
      formData.append(key, editObj[key]);
    
    this.projectService.editProject(formData)
      .subscribe( (response) => {
        if(response == 1){
          this.projectService.emitDataChange();
          this.loading = false;
          this.msgType = 'success';
          this.notify('success', 'Edit Successful');
          $('#editModal').modal('toggle');
        } else {
          this.loading = false;
          this.notify('danger', 'Some Error occured');
        }
      }, (error) => {
        this.loading = false;        
        this.notify('danger', 'Some Error occured');
        console.error(error);
      });      
  }

  getradioValue(name: string): string{
    let radio: any = (<any>document.querySelector(`#editModal input[name="${name}"]:checked`));
    return radio ? radio.value : '';
  }

  getSelectCC(): string {
    let allCC: string = '';
    for(let key in this.cc){
      if(this.cc[key])
        allCC += `${key}, `;
    }
    return allCC.slice(0, -2);    
  }

  notify(type: string, msg: string): void {
    this.showMsg = true;    
    this.msg = msg;
    this.msgType = type;
    setTimeout(() => {
      this.showMsg = false;
    }, 2000);
  }

  deleteRejectionFile() {
    this.loadingRejectionDlt = true;
    this.rejectionService.deleteRejectionFile(this.updateData.id).subscribe( (resp) => {
      if(resp == 1){
        this.projectService.emitDataChange();
        this.loadingRejectionDlt = false;
        this.notify('success', 'File deleted');
        $('#editModal').modal('toggle');
      } else {
        this.loadingRejectionDlt = false;
        this.notify('danger', 'Some Error occured');
      }
    } );
  }

  deleteRejectionRfiFile() {
    this.loadingRejectionRfiDlt = true;
    this.rejectionService.deleteRejectionAndRfiFile(this.updateData.id).subscribe( (resp) => {
      if(resp == 1){
        this.projectService.emitDataChange();
        this.loadingRejectionRfiDlt = false;
        this.notify('success', 'Files deleted');
        $('#editModal').modal('toggle');
      } else {
        this.loadingRejectionRfiDlt = false;
        this.notify('danger', 'Some Error occured');
      }
    } );
  }

}
