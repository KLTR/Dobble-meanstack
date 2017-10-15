import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {User} from '../../objects/user';
import {AuthService} from '../../services/authService/auth.service';
// import * as firebase from 'firebase';
import * as firebase from 'firebase/app';
import 'firebase/storage';
@Injectable()
export class UserService {
  user: User;
  filesToUpload: Array<File> = [];
  image: any;
  constructor(
    private http: Http,
)
{ }


getAllUsers(user){
  const username = user.username;
   const headers = new Headers();
  headers.append('Content-Type', 'application/json');
   return this.http.get(`http://localhost:3000/api/allUsers/${username}`, {headers: headers})
       .map(function(res) {
         return res.json();
      });
}

search(text:string){
  let query  = {
    
  }
   const headers = new Headers();
  headers.append('Content-Type', 'application/json');
   return this.http.get(`http://localhost:3000/api/allUsers/`, {headers: headers})
       .map(function(res) {
         return res.json();
      });
}

uploadToFirebase(event, user): firebase.Promise<any> {
   const fileList: FileList = event.target.files;
    const storageRef = firebase.storage().ref().child('userImgs/' + user.username + '-avatar.jpg');
     if (fileList.length > 0) {
        const file: File = fileList[0];
        storageRef.getDownloadURL().then(url => {this.updateAvatarInDb(user, url).subscribe(res => {}); });
        return storageRef.put(file);
     }

}

getFriendsProfile(username) {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
   return this.http.get(`http://localhost:3000/api/friend/${username}`, {headers: headers})
       .map(function(res) {
         return res.json();
      });
}

updateAvatarInDb(user, url) {
user.avatar = url;
 const headers = new Headers();
 headers.append('Content-Type', 'application/json');
 return this.http.post('http://localhost:3000/api/updateAvatar', user, {headers: headers})
 .map(function(res){
      return res.json();
    });
}

getMembers(user) {
     const headers = new Headers();
 headers.append('Content-Type', 'application/json');
  return this.http.get(`http://localhost:3000/api/members/${user.username}`, {headers: headers})
      .map(function(res) {
        return res.json();
      });
}
    getFriendsList(user) {
     const headers = new Headers();
 headers.append('Content-Type', 'application/json');
  return this.http.get(`http://localhost:3000/api/friendsList/${user.username}`, {headers: headers})
      .map(function(res) {
        return res.json();
      });
}
getMyPosts(user) {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  return this.http.get(`http://localhost:3000/api/myPosts/${user.username}`, {headers: headers})
   .map(function(res) {
     return res.json();
   });
}
getFriendsPosts(user) {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  return this.http.get(`http://localhost:3000/api/friendsPosts/${user.username}`, {headers: headers})
   .map(function(res) {
     return res.json();
   });
}
addFriend(user ,friendUsername) {
   const headers = new Headers();
 headers.append('Content-Type', 'application/json');
  return this.http.post(`http://localhost:3000/api/addFriend/${friendUsername}`, user, {headers: headers})
  .map(function(res){
    return res.json();
  });
}
    uploadPostImgToFirebase(event, uuid): firebase.Promise<any> {
   const fileList: FileList = event.target.files;
    const storageRef = firebase.storage().ref().child('postImgs/' + uuid + '.jpg');
     if (fileList.length > 0) {
        const file: File = fileList[0];
        // storageRef.getDownloadURL().then(url => {this.updateAvatarInDb(user, url).subscribe(res => {}); });
        return storageRef.put(file);
     }
}

addPost(post) {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  return this.http.post('http://localhost:3000/api/addPost/', post , {headers: headers})
  .map(function(res) {
    return res.json();
  });
}
likePost(id, user) {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  return this.http.post(`http://localhost:3000/api/likePost/${id}`, user , {headers: headers})
  .map(function (res) {
    return res.json();
  });
}
showLikes(id) {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  return this.http.get(`http://localhost:3000/api/getLikes/${id}`, {headers: headers})
   .map(function(res) {
     return res.json();
   });
}
deletePost(id) {
  return this.http.delete(`http://localhost:3000/api/myPosts/${id}`).map(function (res) {
    res.json();
  });
}
addComment(comment, id) {
   const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  return this.http.post(`http://localhost:3000/api/addComment/${id}`, comment , {headers: headers})
  .map(function (res) {
    return res.json();
  });
}
addThought(thought){
     const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  return this.http.post(`http://localhost:3000/api/addThought/`, thought , {headers: headers})
  .map(function (res) {
    return res.json();
  });
}
}
