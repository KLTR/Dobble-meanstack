import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/authService/auth.service';
import {Router} from '@angular/router';
import {FlashMessagesService} from 'angular2-flash-messages';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  imgLogo = '../../assets/imgs/logo.png';
  logo = '../../../assets/imgs/AfekaStackLogo.PNG'

  signIn = function(username, password){
  };
  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService
  ) { }

  ngOnInit() {
  }

  onLogoutClick() {
    this.authService.logout();
    this.flashMessage.show('Bye bye ... you are now logged out', {
      cssClass: 'alert-success text-center',
      timeout: 3000
  });
    this.router.navigate(['/login']);
    return false;
  }
}
