import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInRoutingModule } from './sign-in-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { SignInComponent } from './sign-in.component';

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
