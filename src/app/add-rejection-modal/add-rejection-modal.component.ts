import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Rejection } from './rejection'
import { RejectionService } from '../service/rejection.service';

@Component({
  selector: 'app-add-rejection-modal',
  templateUrl: './add-rejection-modal.component.html',
  styleUrls: ['./add-rejection-modal.component.css']
})
export class AddRejectionModalComponent implements OnInit {

  newRejection: Rejection = new Rejection();
  loading: boolean = false;

  msgType: string;
  msg: string;
  showMsg: boolean = false;
  formData: FormData = new FormData();

  @Output() rejectionAdded: EventEmitter<any> = new EventEmitter<any>();

  constructor(private rejectionService: RejectionService) { }

  ngOnInit() {
  }

  setType(bidType: string){
    this.newRejection.type = bidType; 
  }

  addNewRejection(){    
    this.formData = new FormData();    
    this.loading = true;

    for(let key in this.newRejection)
      this.formData.append(key, this.newRejection[key]);

    this.rejectionService.addNewRejection(this.formData)
    .subscribe( (response) => {
      this.rejectionAdded.emit(true);
      this.loading = false;
      this.notify('success', 'Rejection Added');
    }, (error) => {
      this.loading = false;
      this.notify('danger', 'Some Error occured');
      console.error(error);
    }); 

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
