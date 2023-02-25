import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { RejectionService } from '../service/rejection.service';
declare var $;

@Component({
  selector: 'app-rejection-edit-modal',
  templateUrl: './rejection-edit-modal.component.html',
  styleUrls: ['./rejection-edit-modal.component.css']
})
export class RejectionEditModalComponent implements OnInit {

  @Input() updateData: any;
  loading: boolean = false;

  msgType: string;
  msg: string;
  showMsg: boolean = false;
  typeOfBid: string;
  otherReason: string;
  
  constructor(private rejectionService: RejectionService) { }
  
  
  ngOnInit() {
  }

  
  reInitForm(){
    this.typeOfBid = undefined;
    this.otherReason = '';
    this.loading = false;

    this.msgType = undefined;
    this.msg = undefined;
    this.showMsg= false;

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.reInitForm();
    this.updateData = changes.updateData.currentValue;   
    this.typeOfBid = this.updateData.type;  
    this.otherReason = this.updateData.reason;
  }

  editRejection(): void{
    
    let formData = new FormData(); 
    this.loading = true;

    let editObj = {  
      'id': this.updateData.id, 
      'type': this.getradioValue('optradio'),
      'reason': this.otherReason,  
      'submitByDay': this.updateData.submit_by_day,
      'submitByMonth': this.updateData.submit_by_month,
      'submitByYear': this.updateData.submit_by_year,  
      'folderAssignDay': this.updateData.folder_assigned_day,
      'folderAssignMonth': this.updateData.folder_assigned_month,
      'folderAssignYear': this.updateData.folder_assigned_year,
      'title': this.updateData.title,
      'state': this.updateData.state,
    }

    for(let key in editObj)
      formData.append(key, editObj[key]);
    
    this.rejectionService.editRejection(formData)
      .subscribe( (response) => {
        if(response == 1){
          this.rejectionService.emitDataChange();
          this.loading = false;
          this.msgType = 'success';
          this.notify('success', 'Edit Successful');
          $('#editRejectionModal').modal('toggle');
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
    let radio: any = (<any>document.querySelector(`input[name="${name}"]:checked`));
    return radio ? radio.value : '';
  }

  notify(type: string, msg: string): void {
    this.showMsg = true;    
    this.msg = msg;
    this.msgType = type;
    setTimeout(() => {
      this.showMsg = false;
    }, 2000);
  }

}
