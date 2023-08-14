import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Route, Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { FilterComponent } from './filter/filter.component';
import { AddNewModalComponent } from './add-new-modal/add-new-modal.component';
import { ProjectsTableComponent } from './projects-table/projects-table.component';
import { EditModalComponent } from './edit-modal/edit-modal.component';
import { LoginComponent } from './login/login.component';
import { ProjectCountModalComponent } from './project-count-modal/project-count-modal.component';
import { UserManagerModalComponent } from './user-manager-modal/user-manager-modal.component';
import { AddRejectionModalComponent } from './add-rejection-modal/add-rejection-modal.component';
import { RejectionEditModalComponent } from './rejection-edit-modal/rejection-edit-modal.component';
import { TypeManagerModalComponent } from './type-manager-modal/type-manager-modal.component';
import { MissingProjectsModalComponent } from './missing-projects-modal/missing-projects-modal/missing-projects-modal.component';
import { HomeComponent } from './home/home.component';
import { InteractiveChartsComponent } from './interactive-charts/interactive-charts.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

const appRoutes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'interactive-charts', component: InteractiveChartsComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    FilterComponent,
    AddNewModalComponent,
    ProjectsTableComponent,
    EditModalComponent,
    LoginComponent,
    ProjectCountModalComponent,
    UserManagerModalComponent,
    AddRejectionModalComponent,
    RejectionEditModalComponent,
    TypeManagerModalComponent,
    MissingProjectsModalComponent,
    HomeComponent,
    InteractiveChartsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
