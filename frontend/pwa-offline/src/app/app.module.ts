import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { InstallButtonComponent } from './install-button/install-button.component';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';

@NgModule({
  declarations: [AppComponent, InstallButtonComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatBottomSheetModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
