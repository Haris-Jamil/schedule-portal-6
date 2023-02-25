import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  baseURL: string = 'https://tii-usa.com/tii-server-6/api/';  
  loginChange = new Subject<any>();
  admins: string[] = ['admin'];
  
  constructor(private http: HttpClient) { }  

  isLogin(){
    if(localStorage.getItem('token'))
      return true;
    return false;
  }

  getLoginChangeEmitter(){
    return this.loginChange.asObservable();
  }

  login(username: string, password: string, datetime: string){
    
    let loginData = new FormData();
    loginData.append('username', username);
    loginData.append('password', password);
    loginData.append('loginTime', datetime);

    if(!this.isLogin()){
      return this.http.post(`${this.baseURL}login.php`, loginData);
    }
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.loginChange.next();
  }

  isVisitor() {
    const user = this.getLoggedInUser();
    return this.admins.indexOf(user) === -1;
  }

  getLoggedInUser() {
    return localStorage.getItem('user');
  }

  getUsers() {
    return this.http.get(`${this.baseURL}getUsers.php`);
  }

  addUser(username: string, password: string, types: string) {

    let userData = new FormData();
    userData.append('username', username);
    userData.append('password', password);
    userData.append('types', types);

    return this.http.post(`${this.baseURL}addUser.php`, userData);
  }

  deleteUser(id: any) {
    return this.http.get(`${this.baseURL}deleteUser.php?id=${id}`);
  }

  updateUser(id: any, username: string, password: string) {

    let userData = new FormData();
    userData.append('id', id);
    userData.append('username', username);
    userData.append('password', password);

    return this.http.post(`${this.baseURL}updateUser.php`, userData);
  }

}

