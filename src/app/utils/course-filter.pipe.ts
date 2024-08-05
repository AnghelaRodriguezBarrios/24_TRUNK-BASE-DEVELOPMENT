import { Pipe, PipeTransform } from '@angular/core';
import { CourseModel } from '../model/course-model'; 

@Pipe({
  name: 'courseFilter'
})
export class CourseFilterPipe implements PipeTransform {

  transform(courses: CourseModel[], searchTerm: string): CourseModel[] {
    if (!courses || !searchTerm) {
      return courses;
    }

    searchTerm = searchTerm.toLowerCase();

    return courses.filter(course =>
      course.nameCourse.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

}
