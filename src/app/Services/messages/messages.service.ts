import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  constructor() {}

  messages = [
    {
      id: 0,
      user: 'Alex',
      message: 'Hello World !',
      date: new Date(),
    },
    {
      id: 1,
      user: 'Tobby',
      message: 'Coucouuuu !',
      date: new Date(),
    },
    {
      id: 2,
      user: 'Bob',
      message: 'Test',
      date: new Date(),
    },
    {
      id: 3,
      user: 'Bob',
      message: 'Ca maaaaarche',
      date: new Date(),
    },
    {
      id: 4,
      user: 'Alex',
      message: 'Ouaiiiis',
      date: new Date(),
    },
  ];
}
