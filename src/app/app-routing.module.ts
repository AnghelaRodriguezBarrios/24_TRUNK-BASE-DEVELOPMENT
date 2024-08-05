import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaginaCargaComponent } from './components/pagina-carga/pagina-carga.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';

import { LandingPageAdminSystemComponent } from './admin/pages/landing-page-admin-system/landing-page-admin-system.component';
import { LandingPageControlInventarioComponent } from './admin/pages/landing-page-control-inventario/landing-page-control-inventario.component';
import { LandingPageEscuelaPadresComponent } from './admin/pages/landing-page-escuela-padres/landing-page-escuela-padres.component';
import { LandingPageGestionNotasComponent } from './admin/pages/landing-page-gestion-notas/landing-page-gestion-notas.component';
import { LandingPageMatriculaPensionesComponent } from './admin/pages/landing-page-matricula-pensiones/landing-page-matricula-pensiones.component';

import { LoginAdminComponent } from './components/logins/login-admin/login-admin.component';
import { LoginNotasComponent } from './components/logins/login-notas/login-notas.component';
import { LoginInventarioComponent } from './components/logins/login-inventario/login-inventario.component';
import { LoginPadresComponent } from './components/logins/login-padres/login-padres.component';
import { LoginMatrpensComponent } from './components/logins/login-matrpens/login-matrpens.component';

import { DashboardInventarioComponent } from './products/control-inventario/dashboard/dashboard-inventario/dashboard-inventario.component';
import { DashboardDevelopComponent } from './products/develop/dashboard/dashboard-develop/dashboard-develop.component';
import { DashboardPadresComponent } from './products/escuela-padres/dashboard/dashboard-padres/dashboard-padres.component';
import { DashboardNotasComponent } from './products/gestion-notas/dashboard/dashboard-notas/dashboard-notas.component';
import { DashboardMatrpensComponent } from './products/matricula-pensiones/dashboard/dashboard-matrpens/dashboard-matrpens.component';

import { StudentComponent } from './users/Estudiantes/student/student.component';

import { ManagerListComponent } from './users/Encargado/manager-list/manager-list.component';
import { ManagerFormComponent } from './users/Encargado/manager-form/manager-form.component';
import { ManagerEditComponent } from './users/Encargado//manager-edit/manager-edit.component';

import { PaymentListComponent } from './users/Pago/payment-list/payment-list.component';
import { PaymentFormComponent } from './users/Pago/payment-form/payment-form.component';
import { PaymentEditComponent } from './users/Pago/payment-edit/payment-edit.component';

import { CourseComponent } from './users/Cursos/course/course.component';
import { CourseCompetencesComponent } from './users/Competencia/course-competences/course-competences.component';

import { ApoderadoComponent } from './users/Apoderado/attorney/Apoderados.component';

import { ProfesoresComponent } from './users/profesores/profesores.component';
import { ProfesoresInactiosComponent } from './users/profesores/profesores-inactios/profesores-inactios.component';

import { InventoryComponent } from './users/Inventario/inventory/inventory.component';
import { AddInventoryComponent } from './users/Inventario/inventory/add-inventory/add-inventory.component';
import { EditInventoryComponent } from './users/Inventario/inventory/edit-inventory/edit-inventory.component';


const routes: Routes = [
  {
    path: '',
    component: PaginaCargaComponent,
  },
  {
    path: 'landing-page',
    component: LandingPageComponent,
  },
  {
    path: 'landing-page-admin',
    component: LandingPageAdminSystemComponent,
  },
  {
    path: 'landing-page-notas',
    component: LandingPageGestionNotasComponent,
  },
  {
    path: 'landing-page-inventarios',
    component: LandingPageControlInventarioComponent,
  },
  {
    path: 'landing-page-padres',
    component: LandingPageEscuelaPadresComponent,
  },
  {
    path: 'landing-page-matricu-pensio',
    component: LandingPageMatriculaPensionesComponent,
  },

  {
    path: 'login-admin',
    component: LoginAdminComponent,
  },
  {
    path: 'login-notas',
    component: LoginNotasComponent,
  },
  {
    path: 'login-padres',
    component: LoginPadresComponent,
  },
  {
    path: 'login-inventario',
    component: LoginInventarioComponent,
  },
  {
    path: 'login-matricula-pensiones',
    component: LoginMatrpensComponent,
  },

  {
    path: 'dashboard-admin',
    component: DashboardDevelopComponent,
  },
  {
    path: 'dashboard-padres',
    component: DashboardPadresComponent,
  },
  {
    path: 'dashboard-notas',
    component: DashboardNotasComponent,
  },
  {
    path: 'dashboard-inventario',
    component: DashboardInventarioComponent,
  },
  {
    path: 'dashboard-matricula-pensiones',
    component: DashboardMatrpensComponent,
  },

  {
    path: 'estudiante',
    component: StudentComponent,
  },
  {
    path: 'manager',
    component: ManagerListComponent,
  },
  {
    path: 'manager/registro',
    component: ManagerFormComponent,
  },
  { path: 'manager/editar/:id',
    component: ManagerEditComponent
  },
  {
    path: 'payment',
    component: PaymentListComponent,
  },
  {
    path: 'payment/registro',
    component: PaymentFormComponent,
  },
  {
    path: 'payment/editar/:id',
    component: PaymentEditComponent,
  },
  {
    path: 'Curso',
    component: CourseComponent,
  },
  {
    path: 'Competencias',
    component: CourseCompetencesComponent,
  },
  {
    path: 'Apoderado',
    component: ApoderadoComponent,
  },
  {
    path: 'dashboard-padres',
    component: DashboardPadresComponent,
    children: [
      { path: 'profesores', component: ProfesoresComponent },
      { path: 'profesores/inactivos', component: ProfesoresInactiosComponent },
      { path: '', redirectTo: 'dashboard-padres', pathMatch: 'full'}
    ]

  },
  {
    path: 'agregar-producto',
    component: AddInventoryComponent,
  },
  {
    path: 'inventory/editar/:id',
    component: EditInventoryComponent
  },
  {
    path: 'Inventario',
    component: InventoryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
