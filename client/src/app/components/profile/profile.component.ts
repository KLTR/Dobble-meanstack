import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {AuthService} from '../../services/authService/auth.service';
import {UserService} from '../../services/userService/user.service';
import {Router} from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import {User} from '../../objects/user';
import {FlashMessagesService} from 'angular2-flash-messages';

import { trigger,state,style,transition,animate,keyframes } from '@angular/animations';
import * as firebase from 'firebase/app';
import 'firebase/storage';

import 'rxjs/add/operator/map';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  animations : [
    trigger('myAnimation', [
      state('small', style({
        transform: 'scale(1)',
      })),
       state('large', style({
        transform: 'scale(1.2)',
      })),

      transition('small => large', animate('300ms ease-in')),
    ]),
     trigger('flyInOut', [
    state('in', style({transform: 'translateX(0)'})),
    transition('void => *', [
      style({transform: 'translateX(-100%)'}),
      animate(100)
    ]),
    transition('* => void', [
      animate(100, style({transform: 'translateX(100%)'}))
    ])
  ])
  ]
})
export class ProfileComponent implements OnInit {
  user:  User;
  userImg: any;
  thoughtContent:any;
  thoughtImage:any;
  defaultCoverImg:string;
  defaultImg: '../../../assets/imgs/user.png';
  imgFromDb: String;
  isAvatar: boolean;
  trustedUrl: any;
  storageRef: any;
  imgArr: Array<any>;
  content: String;
  commentContent: String;
  posts: [any];
  state: string = 'small';
  constructor(
    private authService: AuthService,
    // private router: Router,
    private userService: UserService,
    private sanitizer: DomSanitizer,
        private flashMessage: FlashMessagesService

  ) { }
  ngOnInit() {
    this.defaultCoverImg =  'http://staging.snopes.com/app/uploads/2016/04/the-farm-below-the-mountain.jpg';
    this.authService.getProfile().subscribe(profile => {
    this.user = profile.user;
    if (this.user.avatar === '') {
      this.userImg = undefined;
    }else {
      this.userImg = this.sanitize(this.user.avatar);
    }

    this.userService.getMyPosts(this.user).subscribe((res) => this.posts = res.posts);
    this.thoughtContent = this.user.thought.content;
    this.thoughtImage = this.user.thought.img;
    },
  
  err => {
    console.log(err);
    return false;
  });

  }

  fileChangeEvent(event) {
    this.userImg = undefined;
    this.userService.uploadToFirebase(event, this.user).then(() => this.getUrlFromFirebase(this.user.username));
  }
  getUrlFromFirebase(username) {
  const storageRef = firebase.storage().ref().child('userImgs/' + username + '-avatar.jpg');
     storageRef.getDownloadURL().then(url => {this.userImg = url; });
    
  }
    sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
}
  addThought(){
    const thought = {
      author:this.user.username,
      content: this.thoughtContent,
      img:this.thoughtImage
    }
    console.log('add thought ..')
    this.userService.addThought(thought).subscribe();
       this.flashMessage.show('Sharing is Caring', {
      cssClass: 'alert alert-dismissible alert-success text-center',
      timeout: 3000
  });

  }
addPost() {
  const post = {
    author: this.user.username,
    content: this.content,
    avatar: this.user.avatar
  };
  this.content = ' ';
  this.userService.addPost(post).subscribe(res => { this.userService.getMyPosts(this.user).subscribe((res) => this.posts = res.posts);});
 
}
deletePost(id) {
  this.userService.deletePost(id).subscribe(res => {this.userService.getMyPosts(this.user).subscribe((res) => this.posts = res.posts);});
}
likePost(id) {
  this.userService.likePost(id, this.user).subscribe(res => {this.userService.getMyPosts(this.user).subscribe((res) => this.posts = res.posts);});
}
showLikes(id) {

}
addComment(postID, content) {
  console.log(postID);
    const comment = {
      author: this.user.username,
      commentContent: content,
      avatar: this.user.avatar
    };
    this.commentContent = ' ';
    this.userService.addComment(comment, postID).subscribe(res =>  {this.userService.getMyPosts(this.user).subscribe((res) => this.posts = res.posts);});
}
animateMe() {
        this.state = (this.state === 'small' ? 'large' : 'small');
  }
}
