import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AutoCompleteModule } from 'primeng/autocomplete';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainFormComponent } from './components/main-form/main-form.component';
import { BookOrderComponentComponent } from './components/book-order-component/book-order-component.component';
import { DatePipe } from '@angular/common';

import { FlightsService } from './services/flights.service';
import { DetailedFlightCardComponent } from './components/detailed-flight-card/detailed-flight-card.component';

@NgModule({
  declarations: [
    AppComponent,
    MainFormComponent,
    BookOrderComponentComponent,
    DetailedFlightCardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    AutoCompleteModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [FlightsService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
