import { Component, OnInit } from '@angular/core';
import { LoginService } from '../service/login.service';
import { TypeService } from '../service/type.service';
import { ChangeDetectorRef } from '@angular/core';
import { ProjectService } from '../service/project.service';

@Component({
  selector: 'app-user-manager-modal',
  templateUrl: './user-manager-modal.component.html',
  styleUrls: ['./user-manager-modal.component.css']
})
export class UserManagerModalComponent implements OnInit {

  users: any[] = [];
  allTypes: any[] = [];
  showPassword: boolean = false;
  showForm: boolean = false;
  mode: boolean;
  editId: any;
  username: string;
  password: string;
  submissionTarget: number = null;
  newUserSelectedTypes: number[] = [];
  userTypes: number[] = [];
  awardYear = new Date().getFullYear();
  newAwardMonth: number = 1;
  newAwardCount: number = 0;

  awardData: any[] = []

   months = [
    { id: 1, name: 'Jan' },
    { id: 2, name: 'Feb' },
    { id: 3, name: 'Mar' },
    { id: 4, name: 'Apr' },
    { id: 5, name: 'May' },
    { id: 6, name: 'Jun' },
    { id: 7, name: 'Jul' },
    { id: 8, name: 'Aug' },
    { id: 9, name: 'Sep' },
    { id: 10, name: 'Oct' },
    { id: 11, name: 'Nov' },
    { id: 12, name: 'Dec' }
  ]

  constructor(private loginService: LoginService, private typeService: TypeService, private cd: ChangeDetectorRef, private service: ProjectService) { }

  ngOnInit() {
    this.getUsers();
    this.getAllTypes();
  }

  
  getMonthName(id: number) {
    return this.months.find( month => month.id == id ).name;
  }

  yearSelectionChange(event){    
    this.service.getAwardCounts(this.username, this.awardYear).subscribe( (resp: any[]) => {
      this.awardData = resp
    });
  }

  getUsers() {
    this.loginService.getUsers().subscribe(
      (data: any) => {
        this.users = data;
      }
    );
  }

  addAwardCount() {
    this.service.addAwardCount(this.username, this.awardYear, this.newAwardMonth, this.newAwardCount).subscribe( (resp) => {
      console.log(resp);
      this.yearSelectionChange(null);
    });
  }

  addTypeToUser(id) {
    if (this.newUserSelectedTypes.includes(id)) {
      this.newUserSelectedTypes = this.newUserSelectedTypes.filter( item => item !== id )
    } else {
      this.newUserSelectedTypes.push(id);
    }
  }

  addTypeToOldUser(id) {
    if (this.userTypes.includes(id)) {
      this.userTypes = this.userTypes.filter( item => item !== id )
    } else {
      this.userTypes.push(id);
    }
  }

  getAllTypes() {
    this.typeService.getAllTypes().subscribe(
      (data: any) => {
        this.allTypes = data;
      }
    );
  }

  getHiddenPassword(pass: string) {
    let hiddenPass: string = '';
    for (let i=0; i<pass.length; i++) {
      hiddenPass += '*'
    }
    return hiddenPass;
  }

  closeForm() {
    this.showForm = false;
  }

  delete(id: any) {
    if( confirm('Are you sure you want to delete this user?') ) {
      this.loginService.deleteUser(id).subscribe( (resp) => {
        if (resp === 1) {
          this.getUsers();
        }
      });
    }
  }

  updateForm(index: number) {
    this.typeService.getUserTypes(this.users[index].id).subscribe((resp: any) => {
      this.userTypes = resp.map( t => t.type_id );
      this.username = this.users[index].login;
      this.password = this.users[index].password;
      this.submissionTarget = this.users[index].submissionTarget;
      this.editId = this.users[index].id;
      this.showForm = true;
      this.mode = false;
      this.yearSelectionChange(null);
      this.cd.detectChanges();
    });    
  }

  isUserType(typeId) {
    return this.userTypes.includes(typeId);
  }

  resetForm() {
    this.showForm = true;
    this.mode = true;
    this.username = this.password = '';
    this.submissionTarget = null;
  }

  performAction() {
    if (this.mode) {
      const types = this.newUserSelectedTypes.join(',');
      this.loginService.addUser(this.username, this.password, types, this.submissionTarget).subscribe( (resp) => {
        if (resp == 1 ) this.getUsers();
      });
    } else {
      const types = this.userTypes.join(',');
      this.loginService.updateUser(this.editId, this.username, this.password, types, this.submissionTarget).subscribe ( (resp) => {
        console.log(resp);
        if (resp == 1 ) this.getUsers();
      });
    }
  }

}
