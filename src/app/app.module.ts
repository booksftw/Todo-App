import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth'

import { environment } from '../environments/environment';

// import { TodoComponent } from './todo/todo.component';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { UserLoginComponent } from './users/user-login/user-login.component';
import { UserProfileComponent } from './users/user-profile/user-profile.component';
import { TodoContainerComponent } from './todo-container/todo-container.component';
import { TodoPresentationComponent } from './todo-container/todo-presentation/todo-presentation.component';
import { TodoHostDirective } from './shared/todo-host.directive';

@NgModule({
  declarations: [
    AppComponent,
    // TodoComponent,
    UserLoginComponent,
    UserProfileComponent,
    TodoContainerComponent,
    TodoPresentationComponent,
    TodoHostDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTableModule,
    MatInputModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  providers: [],
  entryComponents: [TodoPresentationComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
