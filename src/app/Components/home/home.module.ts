import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { AsideComponent } from '../chat/aside/aside.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
    declarations: [HomeComponent, AsideComponent],
    imports: [
        CommonModule,
        HomeRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule
    ]
})
export class HomeModule { }
