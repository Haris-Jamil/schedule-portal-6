import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { LoginService } from '../service/login.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit, OnChanges {
 
  @Input() dataToFilter: any[];
  @Output() dataFiltered: EventEmitter<any[]> = new EventEmitter();
  filteredData: any[];
  selectedType: string;
  submittedSelection: string;
  wjSelection: string;
  zbSelection: string;

  operator: string = "";
  title: string = "";
  state: string = "";
  sealed: boolean = false;
  online: boolean = false;
  email: boolean = false;
  fax: boolean = false;
  nes: boolean = false;
  submittedYes: boolean = false;
  submittedNo:boolean = false; 
  fileYes: boolean = false;
  fileNo: boolean = false;
  wjValid: boolean = false;
  wjInvalid: boolean = false;
  zbValid: boolean = false;
  zbInvalid: boolean = false;
  show: boolean;
  rejectionFile: boolean = false;
  noQuoteFile: boolean = false;
  bidResultFile: boolean = false;
  rfiFile: boolean = false;
  rejectionMode: boolean = false;

  error: boolean = false;
  done: boolean = false;
  verified: boolean = false;

  constructor(private loginService: LoginService){      
  }

  ngOnInit() {
    if (window['rejectionMode']) {
      this.rejectionMode = true;
    }
    this.show = this.loginService.isVisitor();  
  }

  ngOnChanges(changes: SimpleChanges): void {    
    this.applyFilter(changes.dataToFilter.currentValue);
    this.show = !this.loginService.isVisitor();  
  }

  applyFilter(data: any[]): void {

    this.selectedType = this.getSelectedTypes();  
    this.submittedSelection = this.getSubmittedSelection(); 
    this.wjSelection = this.getWjSelection();
    this.zbSelection = this.getZbSelection();

    this.filteredData = data.filter(
      d => (this.operator != "" ? d.code == this.operator.toUpperCase() : true) &&                  
           (this.title != "" ? d.title.toUpperCase().includes(this.title.toUpperCase()) : true ) &&
           (this.state != "" ? d.state == this.state.toUpperCase() : true ) &&
           (this.selectedType != "" ? this.selectedType.includes(d.type) : true) &&
           (this.submittedSelection != "" ? ( d.submitted == "" ? false : this.submittedSelection.includes(d.submitted) ) : true) &&
           (this.wjSelection != "" ? ( d.WJ == "" ? false : this.wjSelection.includes(d.WJ) ) : true) &&
           (this.zbSelection != "" ? ( d.ZB == "" ? false : this.zbSelection.includes(d.ZB) ) : true) &&
           (this.rejectionFile ? (d.rejection_link != "" ? true : false ) : true ) && 
           (this.noQuoteFile ? (d.noquote_link != "" ? true : false ) : true ) &&
           (this.bidResultFile ? (d.bidResult_link != "" ? true : false ) : true ) &&
           (this.rfiFile ? (d.rfi_link != "" ? true : false ) : true ) && 
           (this.error ? (d.status == "" ? false : d.status === 'error') : true ) &&
           (this.done ? (d.status == "" ? false : d.status === 'done') : true ) &&
           (this.verified ? (d.status == "" ? false : d.status === 'verified') : true )
    )
    this.dataFiltered.emit(this.filteredData);
  }

  getSelectedTypes(): string{
    return `${this.sealed ? 'sealed' : ''}${this.online ? 'online' : ''}${this.email ? 'email' : ''}${this.fax ? 'fax' : ''}${this.nes ? 'NES/SEPTA' : ''}`
  }

  getSubmittedSelection(): string{
    return `${this.submittedYes ? 'yesHO': ''}${this.submittedNo ? 'no': ''}`
  }

  getWjSelection(): string{
    return `${this.wjValid ? 'YES': ''}${this.wjInvalid ? 'NO': ''}`
  }

  getZbSelection(): string{
    return `${this.zbValid ? 'YES': ''}${this.zbInvalid ? 'NO': ''}`
  }

}
