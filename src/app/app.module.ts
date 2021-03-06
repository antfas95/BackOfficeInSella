import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { environment } from 'src/environments/environment';
import { AuthenticationService } from './services/authentication.service';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { UtenteService } from './services/utente.service';
import { ReferenteService } from './services/referente.service';
import { IncontroService } from './services/incontro.service';
import { IndirizziService } from './services/indirizzi.service';
import { SelectuserService } from './services/selectuser.service';

import * as firebase from 'firebase';
import { ReactiveFormsModule } from '@angular/forms';

import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

import { SMS } from '@ionic-native/sms/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

firebase.initializeApp(environment.firebase);

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule, AngularFirestoreModule, AngularFireAuthModule, ReactiveFormsModule],
  providers: [
    StatusBar,
    SplashScreen,
    AuthenticationService,
    AngularFireDatabase,
    UtenteService,
    ReferenteService,
    IncontroService,
    SelectuserService,
    SMS,
    EmailComposer,
    IndirizziService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
