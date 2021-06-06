import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './Components/home/home.component';
import { SignInComponent } from './Components/login/sign-in/sign-in.component';
import { SignUpComponent } from './Components/login/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './Components/login/forgot-password/forgot-password.component';
import { ErrorComponent } from './Components/error/error.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    ErrorComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
