import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FullCalendarModule } from '@fullcalendar/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';
import { MatIconModule } from '@angular/material/icon';

//Import all material modules
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';

//Import Layouts
import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';

// Vertical Layout
import { SidebarComponent } from './layouts/full/sidebar/sidebar.component';
import { HeaderComponent } from './layouts/full/header/header.component';
import { BrandingComponent } from './layouts/full/sidebar/branding.component';
import { AppNavItemComponent } from './layouts/full/sidebar/nav-item/nav-item.component';

//Import Composant Dialog
import { AddUserDialogComponent } from './pages/ui-components/lists/add-user-dialog/add-user-dialog.component';
import { EditUserDialogComponent } from './pages/ui-components/lists/edit-user-dialog/edit-user-dialog.component';
import { PosEditComponent } from './pages/ui-components/menu/pos-edit/pos-edit.component';
import { PosAddComponent } from './pages/ui-components/menu/pos-add/pos-add.component';

//Import Service
import { UserService } from './pages/ui-components/lists/userService';

//Import Components
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { ResetPasswordComponent } from './pages/authentication/resetPassword/resetPassword';
import { ForgotPasswordComponent } from './pages/authentication/forgot-password/forgot-password.component';
import { AddServiceComponent } from './pages/ui-components/add-service/add-service.component';

@NgModule({
  declarations: [
    AppComponent,
    FullComponent,
    BlankComponent,
    SidebarComponent,
    HeaderComponent,
    BrandingComponent,
    AppNavItemComponent,
    AddUserDialogComponent,
    EditUserDialogComponent,
    PosEditComponent,
    PosAddComponent,
    UserProfileComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    AddServiceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    FullCalendarModule,
    TablerIconsModule.pick(TablerIcons),
  ],
  providers: [UserService],
  exports: [TablerIconsModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
