import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { HomeModule } from './Components/home/home.module';
import { SignInModule } from './Components/login/sign-in/sign-in.module';
import { SignUpModule } from './Components/login/sign-up/sign-up.module';
import { ForgotPasswordModule } from './Components/login/forgot-password/forgot-password.module';
import { UserProfileModule } from './Components/user-profile/user-profile.module';
import { ErrorModule } from './Components/error/error.module';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        // SharedModule,
        HomeModule,
        SignInModule,
        SignUpModule,
        ForgotPasswordModule,
        UserProfileModule,
        ErrorModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule { }
