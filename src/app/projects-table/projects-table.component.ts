import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ProjectService } from '../service/project.service';
import { Project } from '../add-new-modal/project';
import { LoginService } from '../service/login.service';
import { Rejection } from '../add-rejection-modal/rejection';
import { RejectionService } from '../service/rejection.service';

@Component({
  selector: 'app-projects-table',
  templateUrl: './projects-table.component.html',
  styleUrls: ['./projects-table.component.css']
})
export class ProjectsTableComponent implements OnInit, OnChanges {
  show: boolean;
  @Input() projectsData: any[] = [];
  updateData: any;
  @Output() rejectionMarked: EventEmitter<number> = new EventEmitter<number>();

  private uploadUrl: string = 'http://tii-usa.com/scheduletii/';
  file: File = null;
  dateSort = 'asc';
  rejectionMode: boolean = false;
  refreshSignal: number;

  constructor(private projectService: ProjectService, private loginService: LoginService, private rejectionService: RejectionService) {}

  ngOnInit() {
    if (window['rejectionMode']) {
      this.rejectionMode = true;
      this.updateData = new Rejection();
    } else {
      this.updateData = new Project();
    }
    this.show = !this.loginService.isVisitor();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.projectsData = changes.projectsData.currentValue;    
  }

  toggleStatus(id: number, status: string, index: number): void {        
    const newStatus = status == 'yes' ? 'no' : 'yes';
    this.projectService.toggleStatus(id, newStatus )
      .subscribe( (response) => {
        this.projectsData[index].status = newStatus;    
      }, (error) => {
        console.error(error);
      });
  }

  toggleSort(){
    const sortedData = this.projectsData.sort( (a, b) => {
      let d1 = a.submit_by_year + this.appendZero(a.submit_by_month) + this.appendZero(a.submit_by_day);
      let d2 = b.submit_by_year + this.appendZero(b.submit_by_month) + this.appendZero(b.submit_by_day);      
      return d1.localeCompare(d2);
    })
    if(this.dateSort === 'asc'){
      this.projectsData = sortedData.reverse();
      this.dateSort = 'des';
    } else {
      this.projectsData = sortedData;
      this.dateSort = 'asc';
    }
  }
  
  appendZero(number: string){
    return number.length == 1 ? '0' + number : number;
  }

  deleteProject(id: number, index: number): void{
    if( confirm('Are you sure you want to delete this project?') ) {
      this.projectService.deleteProject(id)
      .subscribe( () => {
        console.log(this.projectsData);
        console.log(index);
        this.projectsData.splice(index, 1);
      }, (error) => {
        console.log(error);
      });
    }    
  }

  deleteRejection(id: number, index: number): void{
    if( confirm('Are you sure you want to delete this rejction?') ) {
      this.rejectionService.deleteRejection(id)
      .subscribe( () => {
        this.projectsData.splice(index, 1);
      }, (error) => {
        console.log(error);
      });
    }    
  }

  getColor(status: string): string {
    switch(status) {
      case 'error':
        return 'table-danger'
      case 'done':
        return 'table-success'       
      case 'verified':
        return 'table-warning' 
    }
  }

  markRejection(id: number, status: string, index: number): void {
    this.rejectionService.changeStatus(id, status )
      .subscribe( (response) => {
        this.projectsData[index].status = status;            
        this.refreshSignal = this.refreshSignal == 0 ? 1 : 0;
        this.rejectionMarked.emit(this.refreshSignal);        
      }, (error) => {
        console.error(error);
      });
  }
  
  openEditModal(id: number, index: number, eve): void{
    this.updateData = {...this.projectsData[index]};
  }

  handleFileInput(files: FileList, type: string, id: any){
    let formData = new FormData(); 
    this.file = files.item(0);          
    formData.append('uploadedfile', this.file, this.file.name);   
    formData.append('id', id);
    formData.append('file_type', type);
    this.projectService.updateFile(formData)
    .subscribe( (response) => {
      console.log(response);
    }, (err) => {
      console.error(err);
    });
  }  

}
