import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    { path: '', loadChildren: () => import('./Components/home/home.module').then(m => m.HomeModule) },
    { path: 'home', loadChildren: () => import('./Components/home/home.module').then(m => m.HomeModule) },
    { path: 'sign-in', loadChildren: () => import('./Components/login/sign-in/sign-in.module').then(m => m.SignInModule) },
    { path: 'sign-up', loadChildren: () => import('./Components/login/sign-up/sign-up.module').then(m => m.SignUpModule) },
    { path: 'forgot-password', loadChildren: () => import('./Components/login/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule) },
    { path: 'view-profile', loadChildren: () => import('./Components/user-profile/user-profile.module').then(m => m.UserProfileModule) },
    { path: '**', loadChildren: () => import('./Components/error/error.module').then(m => m.ErrorModule) },
];

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
