import { Component, OnInit } from '@angular/core';
import { Teacher } from 'src/app/models/clases/teacher';
import { TeacherService } from 'src/app/service/teacher.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profesores-inactios',
  templateUrl: './profesores-inactios.component.html',
  styleUrls: ['./profesores-inactios.component.css']
})
export class ProfesoresInactiosComponent implements OnInit{
  
  teachers: Teacher[] = [];

  constructor(private _teacherService: TeacherService) { }

  ngOnInit(): void {
    this.getTeachersInactives();
  }

  getTeachersInactives() { 
    this._teacherService.getTeachersInactives().subscribe(data => { 
      this.teachers = data
    })
  }

  restore(id: string) { 
    this._teacherService.restoreTeacher(id).subscribe(data => { 
      console.log(`Profesore restaurado con id: ${id}`)
      this.getTeachersInactives();
      Swal.fire("Exito", "Se restauro correctamente", "success");
    })
  }
}
