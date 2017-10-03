import { Component, OnInit } from '@angular/core';
import {ValidateService} from '../../services/validate-service/validate.service';
import {AuthService} from '../../services/authService/auth.service'
import {FlashMessagesService} from 'angular2-flash-messages';
import {Router} from '@angular/router';
import 'rxjs/Rx'; 
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
 first_name:String;
 last_name:String;
 username:String;
 email:String;
 password:String;

 // everytime we use a service in a component we inject it in the constructor
  constructor(
  private validateService: ValidateService, 
  private flashMessage: FlashMessagesService,
  private authService: AuthService,
  private router: Router
  ) { }

  ngOnInit() {
  }

  onRegisterSubmit(){
  
    const user = {
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      username: this.username,
      password: this.password
    }
    
    // Require Fields
    if(!this.validateService.validateRegister(user)){
      this.flashMessage.show('Ooops ... you forgot to fill all the fields', {cssClass: 'alert-warning text-center', timeout: 3000});
      return false;
    }
    // Validate Email
       if(!this.validateService.validateEmail(user.email)){
     this.flashMessage.show('Seems like the email you entered is wrong .. please provide a valid email address', {cssClass: 'alert-warning text-center', timeout: 3000})
      return false;
    }
    // Register User
    this.authService.registerUser(user).subscribe(data =>{
      if(data.success){
         this.flashMessage.show('you made it ! you are now registered with Dobble Social Network', {cssClass: 'alert-success text-center', timeout: 3000})
         this.router.navigate(['/login']);
      } else{
        this.flashMessage.show('Ooops .. something went wrong', {cssClass: 'alert-warning text-center', timeout: 3000})
         this.router.navigate(['/register']);
      }
    });
      

  }

}
