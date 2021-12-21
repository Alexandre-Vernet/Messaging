import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { ContactsComponent } from './contacts/contacts.component';
import { HeadComponent } from './head/head.component';
import { EditorComponent } from './editor/editor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ChatComponent } from './chat.component';


@NgModule({
    declarations: [ProfileComponent, ContactsComponent, HeadComponent, EditorComponent, ChatComponent],
    imports: [
        CommonModule,
        ChatRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        ChatRoutingModule
    ]
})
export class ChatModule {
}
