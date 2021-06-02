import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { MessagesService } from './Services/messages/messages.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  messages: any;
  // user: String;

  constructor(private messagesService: MessagesService) {}

  ngOnInit() {
    this.messages = this.messagesService.messages;

    // this.user = 'Alex';
  }

  formatDate = (message: Date): string => {
    let day = message.getDate();
    let month = message.getMonth();
    let hours = message.getHours();
    let minutes = message.getMinutes();

    return day + ' / ' + month + ' at ' + hours + ' : ' + minutes;
  };
}
