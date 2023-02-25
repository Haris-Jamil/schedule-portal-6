import { Component, OnInit } from '@angular/core';
import { LoginService } from '../service/login.service';
import { TypeService } from '../service/type.service';

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
  newUserSelectedTypes: number[] = [];

  constructor(private loginService: LoginService, private typeService: TypeService) { }

  ngOnInit() {
    this.getUsers();
    this.getAllTypes();
  }

  getUsers() {
    this.loginService.getUsers().subscribe(
      (data: any) => {
        this.users = data;
      }
    );
  }

  addTypeToUser(id) {
    if (this.newUserSelectedTypes.includes(id)) {
      this.newUserSelectedTypes = this.newUserSelectedTypes.filter( item => item !== id )
    } else {
      this.newUserSelectedTypes.push(id);
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
    this.username = this.users[index].login;
    this.password = this.users[index].password;
    this.editId = this.users[index].id;
    this.showForm = true;
    this.mode = false;
  }

  resetForm() {
    this.showForm = true;
    this.mode = true;
    this.username = this.password = ''
  }

  performAction() {
    if (this.mode) {
      const types = this.newUserSelectedTypes.join(',');
      this.loginService.addUser(this.username, this.password, types).subscribe( (resp) => {
        if (resp == 1 ) this.getUsers();
      });
    } else {
      this.loginService.updateUser(this.editId, this.username, this.password).subscribe ( (resp) => {
        console.log(resp);
        if (resp == 1 ) this.getUsers();
      });
    }
  }

}
