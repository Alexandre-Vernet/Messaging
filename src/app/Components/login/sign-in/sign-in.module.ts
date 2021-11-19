import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInRoutingModule } from './sign-in-routing.module';
import { SignInComponent } from './sign-in.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
    declarations: [SignInComponent],
    imports: [
        CommonModule,
        SignInRoutingModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
    ]
})
export class SignInModule { }
