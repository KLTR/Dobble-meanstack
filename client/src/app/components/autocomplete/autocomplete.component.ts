import { Component, OnInit , Pipe, PipeTransform} from '@angular/core';
import {AuthService} from '../../services/authService/auth.service';
import {UserService} from '../../services/userService/user.service';
import {Router} from '@angular/router';
import {User} from '../../objects/user';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject'
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css'],

})
export class AutocompleteComponent implements OnInit {
  users: any[];
  user: User;
  first_name: string;
  last_name: string;
  email: string;
  searchText: string;
    public userNames:Array<string> = [];
 
  private value:any = {};
  private _disabledV:string = '0';
  private disabled:boolean = false;
 
  private searchTerm = new Subject<string>();
  constructor(
  private userService: UserService,
  private authService: AuthService,
  private router: Router

 ) {
 }

  ngOnInit() {
          this.authService.getProfile().subscribe(profile => {
        this.user = profile.user;
        this.userService.getAllUsers(this.user).subscribe( res =>{ this.users = res.users, this.createUsernames(res.users) });
    },
  err => {
    console.log(err);
    return false;
  });
  }
clearSearch(){
 this.searchText = ' '
}
onKeyUp(term){
  this.searchTerm.next(term);
}

 createUsernames(users){
  for(var i = 0 ; i < users.length ; i++){
    this.userNames.push(users[i].username);
  }
 }

  public selected(value:any):void {
      //  <a [routerLink]="['/friend', friend.username]" class="thumbnail"><img class="img-circle" style="height:143px; width: 145px;" src={{friend.avatar}} alt=""></a>
        this.router.navigate(['/friend', value.text]);

    console.log('Selected value is: ', value);
  }
 
  public removed(value:any):void {
    console.log('Removed value is: ', value);
  }
 
  public typed(value:any):void {
    console.log('New search input: ', value);
  }
 
  public refreshValue(value:any):void {
    this.value = value;
  }
 
  }
