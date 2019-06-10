import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { routing } from './home-routing.module';
import { HomeComponent } from './pages/home/home.component';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { SearchComponent } from './components/search/search.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [HomeComponent, SearchComponent, LoadingSpinnerComponent],
  imports: [
    CommonModule,
    routing,
    ScrollingModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
  ]
})
export class HomeModule { }
