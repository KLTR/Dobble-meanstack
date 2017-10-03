import { Component, OnInit } from '@angular/core';
import {ContactService} from '../../services/contactService/contact.service';
import {Contact} from '../../objects/contact';

 @Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css'],
   providers:[ContactService]
})
export class ContactsComponent implements OnInit {
   contacts: Contact[];
   contact: Contact;
   first_name: string;
   last_name: string;
   phone: string;
  constructor(private contactService: ContactService) { }
  

  ngOnInit() {
     console.log(this.contactService.getContacts());
    this.contactService.getContacts().subscribe(function (contacts) {
      console.log(this.contacts);
      this.contacts = contacts;

    })
  }

}
