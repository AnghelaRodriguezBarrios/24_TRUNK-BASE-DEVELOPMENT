import { IEnrollment } from './../../../model/clases/enrollment';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Enrollment, EnrollmentUpdate } from 'src/app/model/clases/enrollment';
import { IApoderado } from 'src/app/model/IApoderado';
import { StudentRecord } from 'src/app/model/interfaces/parent.interface';
import { StudentModel } from 'src/app/model/student-model';
import { ApoderadoService } from 'src/app/service/Apoderado.service';
import { EnrollmentsService } from 'src/app/service/enrollments.service';
import { StudentService } from 'src/app/service/student.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-enrollment',
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.css']
})
export class EnrollmentComponent implements OnInit {

  form: FormGroup;
  toggleDropdwonFilter: boolean = false;

  enrollments: StudentRecord[] = []
  students: StudentModel[] = []
  attorneys: IApoderado[] = []

  openModalAdd: boolean = false;
  openModalUpdate: boolean = false;
  isModalOpen: boolean = false;
  selectedEnrollment?: IEnrollment;

  constructor(
    private _enrollmentService: EnrollmentsService,
    private _studentService: StudentService,
    private _attorneyService: ApoderadoService,
    private fb: FormBuilder,
  ) { 
    this.form = this.fb.group({
      studentId: ['', Validators.required],
      fatherId: ['', Validators.required],
      motherId: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.filterEnrollments('active');
    this.getStudents();
    this.getAttorney();
  }

  // Trae las matriculas
  getEnrollments() { 
    this._enrollmentService.getEnrollmentsActives().subscribe(data => { 
      this.enrollments = data
      console.log(data)
    })
  }

  // Trae a los estudiantes
  getStudents() { 
    this._studentService.fetchActiveStudents().subscribe(data => { 
      this.students = data
    })
  }

  // Trae a los apoderados
  getAttorney() { 
    this._attorneyService.listar().subscribe(data => { 
      this.attorneys = data
      console.log(data)
    })
  }

  // Submit para agregar una matricula
  addEnrollment() { 
    if (this.form?.valid) {
      console.log(this.form.value)
      const enrollment: Enrollment = this.form.value
      this._enrollmentService.postEnrollment(enrollment).subscribe(
        response => {
          console.log("Matricula creada exitosamente", response);
          this.form.reset();
          this.closeModal()
          Swal.fire('Exito', 'Se creo la matricula exitosamente', 'success')
          this.filterEnrollments('pending');
        },
        error => {
          console.error("Error al crear la matricula", error);
          Swal.fire('Error', 'Ha sucedido un problema', 'error')
          console.log(enrollment)
        }
      )
    } else { 
      this.form.markAllAsTouched();
      Swal.fire('Error', 'Por favor verifique los campos', 'error');
    }
  }

  updateEnrollment() { }

  // Filtrar por estados (Activo, Inactivo y Pendiente)
  filterEnrollments(status: string): void {
    if (status === 'active') {
      this._enrollmentService.getEnrollmentsActives().subscribe(data => {
        this.enrollments = data;
        console.log(data)
      });
    } else if (status === 'inactive') {
      this._enrollmentService.getEnrollmentsInactives().subscribe(data => {
        this.enrollments = data;
        console.log(data)
      });
    } else if (status === 'pending') {
      this._enrollmentService.getEnrollmentsPending().subscribe(data => {
        this.enrollments = data;
        console.log(data)
      });
    }
  }

  toggleFilter() { 
    this.toggleDropdwonFilter = !this.toggleDropdwonFilter
  }

  // Eliminar una matricula permanentemente
  deleteEnrollment(id: string) {  
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!'
     }).then((result) => {
       if (result.isConfirmed) {
       this._enrollmentService.deleteEnrollment(id).subscribe(
         data => {
              this.filterEnrollments('active');
            Swal.fire(
              '¡Eliminado!',
              'La matricula ha sido eliminado.',
              'success'
            );
           },
           error => {
             console.error('Error al eliminar la matricula:', error);
             Swal.fire(
              '¡Error!',
               'Hubo un problema al intentar eliminar la matricula.',
               'error'
             );
          }
        );
     }
     });
  }

  // Cambiar el estado de una matricula (Activo, Inactivo o Pendiente)
  changeStatus(id: string, status: string) { 
    this._enrollmentService.updateStatus(id, status).subscribe(() => { 
      Swal.fire('Exito', 'El estado se actualizo correctamente', 'success')
      console.log("Estado actualizado exitosamente")
    },
      error => { 
        Swal.fire('Error', 'Ha ocurrido un problema al actualizar el estado', 'error')
        console.error('Error al actualizar el estado', error);
      })
  } 

  // Abrir modal
  openModal(id: string) {
    this._enrollmentService.getEnrollmentById(id).subscribe(enrollment => { 
      console.log(enrollment.studentId?.name)
      this.isModalOpen = true;
    })
  }

  openModalEdit(id: string) { 
  this._enrollmentService.getEnrollmentById(id).subscribe(
    data => { 
      console.log('Enrollment recibido:', data);
      this.selectedEnrollment = data
      console.log(this.form.patchValue(data))
      this.openModalUpdate = true;
      
    },
    error => {
      console.error('Error al obtener la matrícula:', error);
      Swal.fire('Error', 'No se pudo cargar la información de la matrícula', 'error');
    }
  );
  }

  openModalAddEnrollment() { 
    this.openModalAdd = true;
  }

  compareFn(item1: any, item2: any): boolean {
    return item1 && item2 ? item1.id === item2.id : item1 === item2;
}

  // Cerrar modal
  closeModal(): void {
    this.openModalUpdate = false;
    this.openModalAdd = false;
  }
  
}
