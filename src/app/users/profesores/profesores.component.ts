import { Component, OnInit } from '@angular/core';
import { Teacher } from 'src/app/models/clases/teacher';
import { TeacherService } from 'src/app/service/teacher.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profesores',
  templateUrl: './profesores.component.html',
  styleUrls: ['./profesores.component.css']
})
export class ProfesoresComponent implements OnInit{

  teachers: Teacher[] = [];
  __teachers: Teacher[] = [];
  modalSwitch: boolean = false;
  modalSwitch2: boolean = false;
  selectedTeacher: Teacher | null = null;
  searchTerm: string = '';

  constructor(
    private teacherService: TeacherService
  ) { }

  ngOnInit(): void {
    this.getTeachers();
    this.teacherService.$modal.subscribe((valor) => { 
      this.modalSwitch = valor;
    })
    this.teacherService.$modal2.subscribe((valor) => { 
      this.modalSwitch2 = valor;
    })
  }

  getTeachers() { 
    this.teacherService.teachers$.subscribe(data => { 
      this.teachers = data;
      console.log(data)
    })
  }

  openModal() { 
    this.modalSwitch = true
  }

  openModalUpdate(id: string) { 
    this.teacherService.getTeacherById(id).subscribe(
      teacher => {
          this.selectedTeacher = teacher;
          this.modalSwitch2 = true
      },
       error => {
       console.error('Error fetching teacher:', error)
     }
   )
    
  }

  onTeacherUpdated(updatedTeacher: Teacher) {
    const index = this.teachers.findIndex(t => t.id === updatedTeacher.id);
    if (index !== -1) {
      this.teachers[index] = updatedTeacher;
    }
    this.modalSwitch2 = false;
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
}
