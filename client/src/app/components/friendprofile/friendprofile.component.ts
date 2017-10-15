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
  thoughtImg: any;
  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {

    this.route.params.subscribe(params => {
      this.username = params['username'];
      this.userService.getFriendsProfile(this.username).subscribe(user => {
        this.user = user.user;
        this.userService.getMyPosts(this.user).subscribe((res) => {this.posts = res.posts;});
    }
  );
}
);

  }

}
