import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProfileComponent } from '../chat/profile/profile.component';
import { ContactsComponent } from '../chat/contacts/contacts.component';
import { HeadComponent } from '../chat/head/head.component';


@NgModule({
    declarations: [HomeComponent, ProfileComponent, ContactsComponent, HeadComponent],
    imports: [
        CommonModule,
        HomeRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule
    ]
})
export class HomeModule {
}
