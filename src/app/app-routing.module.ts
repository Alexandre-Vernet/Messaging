import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./Components/chat/chat.module').then(m => m.ChatModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'home',
        loadChildren: () => import('./Components/chat/chat.module').then(m => m.ChatModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'sign-in',
        loadChildren: () => import('./Components/login/sign-in/sign-in.module').then(m => m.SignInModule)
    },
    {
        path: 'sign-up',
        loadChildren: () => import('./Components/login/sign-up/sign-up.module').then(m => m.SignUpModule)
    },
    {
        path: 'view-profile',
        loadChildren: () => import('./Components/user-profile/user-profile.module').then(m => m.UserProfileModule),
        canActivate: [AuthGuard]
    },
    {
        path: '**',
        loadChildren: () => import('./Components/error/error.module').then(m => m.ErrorModule)
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
