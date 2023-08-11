import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  checkbox: string;
  sender: string;
  subject:string;
  message: string;
  datetime: string;
  action:string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {checkbox: '', sender: 'Leslie Alexander', subject: 'We want your feedback', message: 'Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.', datetime: '10:41 PM', action:''},
  {checkbox: '', sender: 'Leslie Alexander', subject: 'We want your feedback', message: 'Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.', datetime: '10:41 PM', action:''},
  {checkbox: '', sender: 'Leslie Alexander', subject: 'We want your feedback', message: 'Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.', datetime: '10:41 PM', action:''},
  {checkbox: '', sender: 'Leslie Alexander', subject: 'We want your feedback', message: 'Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.', datetime: '10:41 PM', action:''},
];
@Component({
  selector: 'app-important-message',
  templateUrl: './important-message.component.html',
  styleUrls: ['./important-message.component.css']
})
export class ImportantMessageComponent implements OnInit {

  filterCard: boolean = false;
  displayedColumns: string[] = ["checkbox","sender", "subject", "message","datetime","action"];  
  dataSource = ELEMENT_DATA;
  constructor() { }

  ngOnInit(): void {
  }

  filterCardToggle(){
    this.filterCard = !this.filterCard;
  }

}
