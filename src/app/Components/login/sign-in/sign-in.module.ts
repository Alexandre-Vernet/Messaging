import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInRoutingModule } from './sign-in-routing.module';
import { SignInComponent } from './sign-in.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';

@NgModule({
    declarations: [SignInComponent, ForgotPasswordComponent],
    imports: [
        CommonModule,
        SignInRoutingModule,
        FormsModule,
        ReactiveFormsModule,
    ]
})
export class SignInModule {
}
