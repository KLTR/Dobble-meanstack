import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/userService/user.service';
import {AuthService} from '../../services/authService/auth.service';
import {User} from '../../objects/user';
import {Post} from '../../objects/post';
import { DomSanitizer } from '@angular/platform-browser';


import 'rxjs/add/operator/map';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: User;
  posts: [String];
  content: String;
  commentContent : String;
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
     // getProfile
     this.content = '';
     this.commentContent = '';
     this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
      this.userService.getFriendsPosts(this.user).subscribe((posts) => this.posts = posts.posts);
  },
err => {
  console.log(err);
  return false;
});

  // this.userService.getFriends();

  }
  likePost(id) {
    this.userService.likePost(id, this.user).subscribe(res => {    this.userService.getFriendsPosts(this.user).subscribe((posts) => this.posts = posts.posts);
});
    // (users) => this.users = users.members);
  }
  addPost() {
    const post = {
      author: this.user.username,
      content: this.content,
      avatar: this.user.avatar
    };
    this.content = ' ';
    this.userService.addPost(post).subscribe(res => {    this.userService.getFriendsPosts(this.user).subscribe(posts => this.posts = posts.posts);
});
  }
addComment(postID) {
  console.log(postID);
    const comment = {
      author: this.user.username,
      commentContent: this.commentContent,
      avatar: this.user.avatar
    };
    this.commentContent = ' ';
    this.userService.addComment(comment, postID).subscribe(res => {    this.userService.getFriendsPosts(this.user).subscribe(posts => this.posts = posts.posts);
});
  }
  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

}
