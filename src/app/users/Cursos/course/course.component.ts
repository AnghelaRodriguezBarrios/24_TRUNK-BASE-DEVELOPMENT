import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseService } from 'src/app/service/course.service';
import { CourseModel } from 'src/app/model/course-model';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  courses: CourseModel[] = [];
  paginatedList: CourseModel[] = [];
  filteredList: CourseModel[] = [];
  courseForm: FormGroup;
  searchTerm: string = '';
  isUpdate: boolean = false;
  selectedCourse: CourseModel | null = null;
  modalAdd: boolean = false;
  modalUpdate: boolean = false;
  modalViewCourse: boolean = false;

  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 8; // Cambiado a 7 registros por página
  totalPages: number = 1;

  constructor(
    private courseService: CourseService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private exportAsService: ExportAsService
  ) {
    this.courseForm = this.fb.group({
      nameCourse: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/)]],
      description: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]*$/)]]
    });    
  }

  ngOnInit(): void {
    this.listCourses();
  }

  listCourses(): void {
    this.courseService.getAllCourses().subscribe(
      (data: CourseModel[]) => {
        this.courses = data;
        this.filterCourses();
      },
      error => {
        console.error('Error fetching courses', error);
      }
    );
  }

  filterCourses(): void {
    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredList = this.courses.filter(course =>
      course.nameCourse.toLowerCase().includes(searchTermLower) ||
      course.description.toLowerCase().includes(searchTermLower)
    );
    this.updatePaginatedList();
  }  

  updatePaginatedList(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedList = this.filteredList.slice(startIndex, endIndex);
    this.totalPages = Math.ceil(this.filteredList.length / this.itemsPerPage);
  }  

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedList();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedList();
    }
  }

  newCourse(): void {
    this.isUpdate = false;
    this.selectedCourse = null;
    this.courseForm.reset();
    this.modalAdd = true;
  }

  selectCourse(course: CourseModel): void {
    this.isUpdate = true;
    this.selectedCourse = course;
    this.courseForm.patchValue(course);
    this.modalUpdate = true;
  }

  insertCourse(): void {
    if (this.courseForm.invalid) {
      this.toastr.error('Por favor, rellene todos los campos requeridos correctamente.', 'Error');
      return;
    }

    const courseData: CourseModel = this.courseForm.value;
    this.courseService.createCourse(courseData).subscribe(
      res => {
        this.listCourses();
        this.toastr.success('Curso agregado con éxito', 'Éxito');
        this.courseForm.reset();
        this.closeModal();
      },
      error => {
        console.error('Error adding course', error);
        this.toastr.error('Error al agregar el curso', 'Error');
      }
    );
  }

  updateCourse(): void {
    if (this.courseForm.invalid || !this.selectedCourse) {
      this.toastr.error('Por favor, rellene todos los campos requeridos correctamente.', 'Error');
      return;
    }

    const courseData: CourseModel = this.courseForm.value;
    this.courseService.updateCourse(this.selectedCourse.idCourse, courseData).subscribe(
      res => {
        this.listCourses();
        this.toastr.success('Curso actualizado con éxito', 'Éxito');
        this.courseForm.reset();
        this.closeModal();
      },
      error => {
        console.error('Error updating course', error);
        this.toastr.error('Error al actualizar el curso', 'Error');
      }
    );
  }

  closeModal(): void {
    this.modalAdd = false;
    this.modalUpdate = false;
  }

  viewCourse(course: CourseModel): void {
    this.selectedCourse = course;
    this.modalViewCourse = true;
  }

  closeModalView(): void {
    this.modalViewCourse = false;
  }

  exportToPdf(): void {
    Swal.fire({
      title: 'Exportar informe',
      text: '¿Deseas exportar este informe de Cursos?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Exportar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        if (!this.filteredList || this.filteredList.length === 0) {
          console.error('No hay datos de cursos disponibles.');
          return;
        }

        const doc = new jsPDF('landscape');

        doc.setFillColor(255, 165, 0);
        doc.rect(0, 0, doc.internal.pageSize.width, 60, 'F');

        const logoLeft = 'assets/logo.png';
        doc.addImage(logoLeft, 'PNG', 20, 10, 40, 40);

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        const title = 'Listado de Cursos';
        const titleWidth = doc.getStringUnitWidth(title) * 20;
        const middleOfPage = doc.internal.pageSize.width / 2;
        const titleX = middleOfPage - titleWidth / 2 + 70;
        const titleY = 30;
        doc.text(title, titleX, titleY);

        const logoRight = 'assets/logo.png';
        const logoRightWidth = 40;
        const logoRightHeight = 40;
        const logoRightX = doc.internal.pageSize.width - logoRightWidth - 20;
        const logoRightY = 10;
        doc.addImage(logoRight, 'PNG', logoRightX, logoRightY, logoRightWidth, logoRightHeight);

        const columns = [
          'NOMBRE DEL CURSO',
          'DESCRIPCIÓN'
        ];

        const separationSpace = 40;
        const startY = titleY + separationSpace;

        autoTable(doc, {
          head: [columns],
          body: this.filteredList.map(item => [
            item.nameCourse,
            item.description
          ]),
          startY: startY,
          tableWidth: 'auto',
          styles: {
            textColor: [0, 0, 0],
            fontSize: 10,
          },
          headStyles: {
            fillColor: [255, 165, 0],
            textColor: [255, 255, 255],
          },
        });

        doc.save('Cursos.pdf');

        Swal.fire({
          icon: 'success',
          title: '¡Informe exportado!',
          text: 'El informe de Cursos se ha exportado exitosamente.',
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.toastr.info('Exportación a PDF cancelada', 'Cancelado', {
          timeOut: 1500,
          positionClass: 'toast-top-right',
        });
      }
    });
  }

  exportToExcel(): void {
    Swal.fire({
      title: 'Exportar a Excel',
      text: '¿Deseas exportar la lista de cursos a un archivo Excel?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Exportar'
    }).then(result => {
      if (result.isConfirmed) {
        const exportConfig: ExportAsConfig = {
          type: 'xlsx',
          elementIdOrContent: 'course',
          options: {
            orientation: 'landscape',
          }
        };

        const fileName = 'course';

        this.exportAsService.save(exportConfig, fileName).subscribe(response => {
          console.log(response);
          this.toastr.success('Archivo Excel generado exitosamente', 'Éxito', {
            timeOut: 1500,
            positionClass: 'toast-top-right',
          });
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.toastr.info('Exportación a Excel cancelada', 'Cancelado', {
          timeOut: 1500,
          positionClass: 'toast-top-right',
        });
      }
    });
  }

  exportToCSV(): void {
    Swal.fire({
      title: 'Exportar a CSV',
      text: '¿Deseas exportar la lista de cursos a un archivo CSV?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Exportar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        const exportConfig: ExportAsConfig = {
          type: 'csv',
          elementIdOrContent: 'course',
          options: {
            orientation: 'landscape',
          }
        };

        const fileName = 'course';

        this.exportAsService.save(exportConfig, fileName).subscribe(response => {
          console.log(response);
          this.toastr.success('Archivo CSV generado exitosamente', 'Éxito', {
            timeOut: 1500,
            positionClass: 'toast-top-right',
          });
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.toastr.info('Exportación a CSV cancelada', 'Cancelado', {
          timeOut: 1500,
          positionClass: 'toast-top-right',
        });
      }
    });
  }
}
