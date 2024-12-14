import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Project } from './project';
import { ProjectService } from '../service/project.service';
import { LoginService } from '../service/login.service';
import { TypeService } from '../service/type.service';

@Component({
  selector: 'app-add-new-modal',
  templateUrl: './add-new-modal.component.html',
  styleUrls: ['./add-new-modal.component.css']
})
export class AddNewModalComponent implements OnInit {

  newProject: Project = new Project();
  showReasonField: boolean;
  loading: boolean = false;

  msgType: string;
  msg: string;
  showMsg: boolean = false;

  bond: boolean;
  installation: boolean;
  trade: boolean;
  siteVisit: boolean;
  otherReason: boolean;

  formData: FormData = new FormData();
  rejectionFile: File = null;
  types: any[] = [];

  @Output() projectAdded: EventEmitter<any> = new EventEmitter<any>();

  constructor(private projectService: ProjectService, private loginService: LoginService, private typeService: TypeService) { }

  ngOnInit() {
    this.showReasonField = false;
    this.typeService.getAllTypes().subscribe( (resp: any) => {
      this.types = resp;
    })
  }

  toggleReasonField(){
    this.showReasonField = !this.showReasonField;
  }

  setTypeOfBid(bidType: string){
    this.newProject.bidType = bidType; 
  }

  handleFileInput(files: FileList){
    this.rejectionFile = files.item(0);
  }

  getReasonForNotBidding(): string{
    let reasons: string = '';
    reasons += this.bond ? 'bond ' : '';
    reasons += this.installation ? 'installation ' : '';
    reasons += this.trade ? 'trade ' : '';
    reasons += this.siteVisit ? 'Site visit ' : '';
    reasons += this.showReasonField ?  `${ this.otherReason} ` : '';    
    return reasons.trim();
  }

  getCurrentPakistanTime(): string {
    const now = new Date();
    const options = {
        timeZone: 'Asia/Karachi',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };
    const formatter = new Intl.DateTimeFormat('en-US', (options as any));
    const currentTimeInPKT = formatter.format(now);
    return currentTimeInPKT;
  }

  addNewProject(){
    this.newProject.reasonNotBidding = this.getReasonForNotBidding();    
    this.newProject.projectAddTime = this.getCurrentPakistanTime();
    this.formData = new FormData();    
    this.loading = true;

    for(let key in this.newProject)
      this.formData.append(key, this.newProject[key]);

    if(this.rejectionFile)
      this.formData.append('rejectionFile', this.rejectionFile, this.rejectionFile.name);

    this.projectService.addNewProject(this.formData)
    .subscribe( (response) => {
      this.projectAdded.emit(true);
      this.loading = false;
      this.notify('success', 'Project Added');
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

  setNatureOfBid(bidNature: string){
    this.newProject.nature = bidNature; 
  }

}

