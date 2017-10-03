import { Injectable } from '@angular/core';

import {Http, Headers} from '@angular/http';
import {Contact} from '../../objects/contact';
import 'rxjs/add/operator/map';
@Injectable()
export class ContactService {

  constructor(private http: Http) { }

//  retrieving contacts

  getContacts()
  {
    return this.http.get('http://localhost:3000/api/contacts')
      .map(function (res) {
        res.json();

      });

  }

//  add contact

  addContact(newContact)
  {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://locathost:3000/api/contacts', newContact, {headers:headers}).map(function (res) {
      res.json();
    });
  }
//delete contact
  deleteContact(id)
  {
    return this.http.delete('http://localhost:3000/api/contacts/'+id).map(function (res) {
      res.json();
    });
  }
}
