import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {AuthService} from '../../services/authService/auth.service';
import {UserService} from '../../services/userService/user.service';
import {Router, Params} from '@angular/router';
import { ActivatedRoute} from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import {User} from '../../objects/user';
import * as firebase from 'firebase/app';
import 'firebase/storage';

import 'rxjs/add/operator/map';

@Component({
  selector: 'app-friendprofile',
  templateUrl: './friendprofile.component.html',
  styleUrls: ['./friendprofile.component.css']
})
export class FriendprofileComponent implements OnInit {
  user:  User;
  params: Params;
  username: string;
  posts: [any];
  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
//     this.authService.getProfile().subscribe(profile => {
//       this.user = profile.user;
//       this.userService.getFriendsList(this.user).subscribe(friends => {this.friends = friends.friendsList;
//         Array.from(new Set(this.friends)); }
//       ); },
// err => {
//   console.log(err);
//   return false;
// });
    this.route.params.subscribe(params => {
      this.username = params['username'];
      this.userService.getFriendsProfile(this.username).subscribe(user => {
        this.user = user.user;
        this.userService.getMyPosts(this.user).subscribe((res) => this.posts = res.posts);
    }
  );
}
);
  //   this.route.params.switchMap((params: Params) =>  this.userService.getFriendsProfile(params['username']))
  //   .subscribe((user) => this.user = user);
  // }
  }
checkUser() {
  console.log(this.user.username);
}
}
