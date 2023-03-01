import { Component } from '@angular/core';
import { LoginService } from '../service/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username: string;
  password: string;
  loginError: boolean;
  errorMsg: string;

  constructor(private loginService: LoginService) { }
  
  login(){  
    this.loginService.login(this.username, this.password, this.getCurrentDateTime()).subscribe( (resp: any) => {
      if(resp !== 0){
        console.log(resp);
        localStorage.setItem('token', ((new Date()).getTime()).toString() );
        localStorage.setItem('user', this.username);
        localStorage.setItem('userId', resp);
        this.loginError = false;
        this.loginService.loginChange.next();
      } else {
        this.errorMsg = 'wrong username or password';
        this.loginError = true;
      }
    }, (error) => {
      console.error(error);
      this.errorMsg = 'Some error occured';
      this.loginError = true;
    }); 

  }

  getCurrentDateTime(): string{
    var currentdate = new Date(); 
    return "time: " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
  }

}
