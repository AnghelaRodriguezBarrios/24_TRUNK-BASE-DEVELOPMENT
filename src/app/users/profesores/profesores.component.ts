import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Teacher } from 'src/app/model/clases/teacher';
import { TeacherI } from 'src/app/model/interfaces/teacher-i';
import { TeacherService } from 'src/app/service/teacher.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profesores',
  templateUrl: './profesores.component.html',
  styleUrls: ['./profesores.component.css']
})
export class ProfesoresComponent implements OnInit {

  teachers: TeacherI[] = [];
  modalAdd: boolean = false;
  modalUpdate: boolean = false;
  selectedTeacher: Teacher | null = null;
  searchTerm: string = '';
  teacherForm: FormGroup;
  modalViewTeacher: boolean = false;

  filterDocument: boolean = false;

  constructor(
    private teacherService: TeacherService,
    private fb: FormBuilder
  ) { 
    this.teacherForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      documentType: ['', Validators.required],
      documentNumber: ['', [Validators.required, this.documentNumberValidator.bind(this)]],
      dateBirth: ['', [Validators.required]],
      email: ['', [Validators.email]],
      cellPhone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      gender: ['', Validators.required],
      dateHire: ['', [Validators.required]]
    });
  }

  // Custom Validator for Document Number based on Document Type
  documentNumberValidator(control: any) {
    const documentType = this.teacherForm?.get('documentType')?.value;
    const value = control.value;
    if (documentType === 'DNI' && !/^\d{8}$/.test(value)) {
      return { pattern: true };
    }
    if (documentType === 'CNE' && !/^\d{12}$/.test(value)) {
      return { pattern: true };
    }
    return null;
  }

  ngOnInit(): void {
    // Obtiene la lista de profesores al iniciar el componente
    this.getTeachers();
  }

  // Obtiene la lista de profesores desde el servicio
  getTeachers() { 
    this.teacherService.getTeachers().subscribe(data => { 
      this.teachers = data;
      console.log(data)
    })
  }

  // Abre el modal para agregar un nuevo profesor
  openModal() { 
    this.modalAdd = true
    this.selectedTeacher = null;
    this.teacherForm.reset();
  }

  // Abre el modal para actualizar un profesor existente
  openModalUpdate(id: string) { 
    this.teacherService.getTeacherById(id).subscribe(
      teacher => {
        this.selectedTeacher = teacher;
        console.log(teacher)
        this.teacherForm.patchValue(teacher);
        this.modalUpdate = true
      },
       error => {
       console.error('Error fetching teacher:', error)
     }
   )
    
  }


  deleteTeacher(id: string) {
    // Mostrar SweetAlert para confirmar la eliminación
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
       this.teacherService.deleteTeacher(id).subscribe(
         data => {
              this.getTeachers();
            console.log('Profesor eliminado:', data);
            Swal.fire(
              '¡Eliminado!',
              'El profesor ha sido eliminado.',
              'success'
            );
           },
           error => {
             console.error('Error al eliminar profesor:', error);
             Swal.fire(
              '¡Error!',
               'Hubo un problema al intentar eliminar el profesor.',
               'error'
             );
          }
        );
     }
     });
  }



  // FUNCIONES DEL FORMULARIO AGREGAR

  addTeacher() { 
    if (this.teacherForm?.valid) {
      const teacher: Teacher = this.teacherForm.value;
      this.teacherService.addTeacher(teacher).subscribe(
        response => {
          console.log('Profesor agregado', response);
          this.closeModal();
          console.log(teacher);
          Swal.fire('Éxito', 'El profesor se agregó correctamente', 'success');
          this.getTeachers();
        },
        error => {
          console.error('Error al agregar profesor', error);
        }
      );
    } else { 
      this.teacherForm.markAllAsTouched();
      Swal.fire('Error', 'Por favor verifique los campos', 'error');
    }
  }

  updateTeacher() { 
    if (this.teacherForm?.valid && this.selectedTeacher) {
      const updatedTeacher: Teacher = { ...this.selectedTeacher, ...this.teacherForm.value };
      this.teacherService.updateTeacher(this.selectedTeacher.id!, updatedTeacher).subscribe(
        response => {
          console.log('Profesor actualizado', response);
          this.closeModal();
          Swal.fire('Éxito', 'El profesor se actualizó correctamente', 'success');
          this.getTeachers();
        },
        error => {
          console.error('Error al actualizar profesor', error);
        }
      );
    } else { 
      Swal.fire('Error', 'Por favor verifique los campos', 'error');
    }
  }

  closeModal() { 
    this.modalAdd = false;
    this.modalUpdate = false;
  } 

  viewTeacher(teacher: Teacher): void {
    this.modalViewTeacher = true
    this.selectedTeacher = teacher;
  }

  closeModalView() { 
    this.modalViewTeacher = false
  }

  openFilter() { 
    this.filterDocument = !this.filterDocument;
  }

}
