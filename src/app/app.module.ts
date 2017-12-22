import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import{ LinechartComponent } from './linechart/linechart.component';
import{LinechartService} from './linechart/linechart.service';

@NgModule({
  declarations: [
    AppComponent
    ,LinechartComponent
  ],
  imports: [
    BrowserModule
    , FormsModule
    , HttpClientModule
  ],
  providers: [LinechartService],
  bootstrap: [AppComponent]
})
export class AppModule { }
