import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxPaginationModule } from 'ngx-pagination';

import { ToastrModule } from 'ngx-toastr';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TableModule } from 'primeng/table';
import { MatSelectModule } from '@angular/material/select';
import { ExportAsModule } from 'ngx-export-as';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgSelectModule } from '@ng-select/ng-select';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PaginaCargaComponent } from './components/pagina-carga/pagina-carga.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LandingPageAdminSystemComponent } from './admin/pages/landing-page-admin-system/landing-page-admin-system.component';
import { LandingPageControlInventarioComponent } from './admin/pages/landing-page-control-inventario/landing-page-control-inventario.component';
import { LandingPageEscuelaPadresComponent } from './admin/pages/landing-page-escuela-padres/landing-page-escuela-padres.component';
import { LandingPageGestionNotasComponent } from './admin/pages/landing-page-gestion-notas/landing-page-gestion-notas.component';
import { LandingPageMatriculaPensionesComponent } from './admin/pages/landing-page-matricula-pensiones/landing-page-matricula-pensiones.component';
import { DashboardInventarioComponent } from './products/control-inventario/dashboard/dashboard-inventario/dashboard-inventario.component';
import { DashboardDevelopComponent } from './products/develop/dashboard/dashboard-develop/dashboard-develop.component';
import { DashboardPadresComponent } from './products/escuela-padres/dashboard/dashboard-padres/dashboard-padres.component';
import { DashboardNotasComponent } from './products/gestion-notas/dashboard/dashboard-notas/dashboard-notas.component';
import { DashboardMatrpensComponent } from './products/matricula-pensiones/dashboard/dashboard-matrpens/dashboard-matrpens.component';
import { LoginAdminComponent } from './components/logins/login-admin/login-admin.component';
import { LoginNotasComponent } from './components/logins/login-notas/login-notas.component';
import { LoginInventarioComponent } from './components/logins/login-inventario/login-inventario.component';
import { LoginPadresComponent } from './components/logins/login-padres/login-padres.component';
import { LoginMatrpensComponent } from './components/logins/login-matrpens/login-matrpens.component';
import { StudentComponent } from './users/Estudiantes/student/student.component';
import { ManagerListComponent } from './users/Encargado/manager-list/manager-list.component';
import { ManagerFormComponent } from './users/Encargado/manager-form/manager-form.component';
import { ManagerEditComponent } from './users/Encargado/manager-edit/manager-edit.component';
import { PaymentListComponent } from './users/Pago/payment-list/payment-list.component';
import { PaymentFormComponent } from './users/Pago/payment-form/payment-form.component';
import { PaymentEditComponent } from './users/Pago/payment-edit/payment-edit.component';
import { CourseComponent } from './users/Cursos/course/course.component';
import { CourseCompetencesComponent } from './users/Competencia/course-competences/course-competences.component';
import { ApoderadoComponent } from './users/Apoderado/attorney/Apoderados.component';
import { TeacherFilterPipe } from './utils/teacher-filter.pipe';
import { ProfesoresInactiosComponent } from './users/profesores/profesores-inactios/profesores-inactios.component';
import { ProfesoresComponent } from './users/profesores/profesores.component';
import { ModalFormComponent } from './users/profesores/components/modal-form/modal-form.component';
import { ModalFormUpdateComponent } from './users/profesores/components/modal-form-update/modal-form-update.component';
import { InventoryComponent } from './users/Inventario/inventory/inventory.component';
import { AddInventoryComponent } from './users/Inventario/inventory/add-inventory/add-inventory.component';
import { EditInventoryComponent } from './users/Inventario/inventory/edit-inventory/edit-inventory.component';

@NgModule({
  declarations: [
    AppComponent,
    PaginaCargaComponent,
    LandingPageComponent,
    LandingPageAdminSystemComponent,
    LandingPageControlInventarioComponent,
    LandingPageEscuelaPadresComponent,
    LandingPageGestionNotasComponent,
    LandingPageMatriculaPensionesComponent,
    DashboardInventarioComponent,
    DashboardDevelopComponent,
    DashboardPadresComponent,
    DashboardNotasComponent,
    DashboardMatrpensComponent,
    LoginAdminComponent,
    LoginNotasComponent,
    LoginInventarioComponent,
    LoginPadresComponent,
    LoginMatrpensComponent,
    StudentComponent,
    ManagerListComponent,
    ManagerFormComponent,
    ManagerEditComponent,
    PaymentListComponent,
    PaymentFormComponent,
    PaymentEditComponent,
    CourseComponent,
    CourseCompetencesComponent,
    ApoderadoComponent,
    ProfesoresComponent,
    ModalFormComponent,
    ModalFormUpdateComponent,
    TeacherFilterPipe,
    ProfesoresInactiosComponent,
    InventoryComponent,
    AddInventoryComponent,
    EditInventoryComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FormsModule,
    ToastrModule.forRoot({
      timeOut: 3000, // Duración del mensaje en milisegundos
      positionClass: 'toast-top-right', // Posición del toast
    }),
    ModalModule.forRoot(),
    TableModule,
    MatSelectModule,
    ExportAsModule,
    SweetAlert2Module.forRoot(),
    NgSelectModule,
    NgxPaginationModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
