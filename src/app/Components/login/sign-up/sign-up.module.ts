import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpRoutingModule } from './sign-up-routing.module';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignUpComponent } from './sign-up.component';


@NgModule({
    declarations: [SignUpComponent],
    imports: [
        CommonModule,
        SignUpRoutingModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
    ]
})
export class SignUpModule { }
