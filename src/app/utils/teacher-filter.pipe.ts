import { Pipe, PipeTransform } from '@angular/core';
import { Teacher } from '../models/clases/teacher';

@Pipe({
  name: 'teacherFilter'
})
export class TeacherFilterPipe implements PipeTransform {

  transform(teachers: Teacher[], searchTerm: string): Teacher[] {
    if (!teachers || !searchTerm) {
      return teachers;
    }

    searchTerm = searchTerm.toLowerCase();

    return teachers.filter(teacher =>
      teacher.firstName!.toLowerCase().includes(searchTerm) ||
      teacher.lastName!.toLowerCase().includes(searchTerm) ||
      teacher.documentNumber!.includes(searchTerm) ||
      teacher.email!.toLowerCase().includes(searchTerm) ||
      teacher.cellPhone!.includes(searchTerm)
    );
  }

}
