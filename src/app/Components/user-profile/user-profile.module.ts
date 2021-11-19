import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileRoutingModule } from './user-profile-routing.module';
import { UserProfileComponent } from './user-profile.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
    declarations: [UserProfileComponent],
    imports: [
        CommonModule,
        UserProfileRoutingModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule
    ]
})
export class UserProfileModule { }
