// src/app/components/course/course.component.ts
import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CourseService } from 'src/app/service/course.service';
import { CourseModel } from 'src/app/model/course-model';
import Swal from 'sweetalert2';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
declare var bootstrap: any;

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {
  courseList: CourseModel[] = [];
  paginatedList: CourseModel[] = [];
  filteredList: CourseModel[] = [];
  formulario: FormGroup;
  formularioFiltrado: FormGroup;
  isUpdate: boolean = false;
  selectedCourse: CourseModel | null = null;

  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  constructor(
    private courseService: CourseService,
    private toastr: ToastrService,
    private exportAsService: ExportAsService,
    private fb: FormBuilder,
    private renderer: Renderer2
  ) {
    this.formulario = this.fb.group({
      idCourse: [''],
      nameCourse: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚ0-9 ]+$'), // Permite letras y números, pero no símbolos
      this.noSymbolsValidator
      ]],
      description: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚ0-9 ]+$'), // Permite letras y números, pero no símbolos
        this.noSymbolsValidator
      ]],
    });

    this.formularioFiltrado = this.fb.group({
      nameCourseFilter: [''],
      descriptionFilter: ['']
    });
  }

  ngOnInit(): void {
    this.listCourses();
    this.formularioFiltrado.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.filterCourses();
      });
  }

  ngAfterViewInit(): void {
    this.initializeSidebar();
    this.initializeMenu();
    this.initializeProgressBar();
  }

  private initializeSidebar(): void {
    const allDropdown = document.querySelectorAll<HTMLElement>('#sidebar .side-dropdown');
    const sidebar = document.getElementById('sidebar');
    const toggleSidebar = document.querySelector<HTMLElement>('nav .toggle-sidebar');
    const allSideDivider = document.querySelectorAll<HTMLElement>('#sidebar .divider');

    if (!allDropdown || !sidebar || !toggleSidebar || !allSideDivider) {
      console.error('Elementos no encontrados');
      return;
    }

    allDropdown.forEach(item => {
      const a = item.parentElement?.querySelector<HTMLElement>('a:first-child');
      if (!a) return;
      this.renderer.listen(a, 'click', (e) => {
        e.preventDefault();

        if (!a.classList.contains('active')) {
          allDropdown.forEach(i => {
            const aLink = i.parentElement?.querySelector<HTMLElement>('a:first-child');
            if (aLink) {
              aLink.classList.remove('active');
              i.classList.remove('show');
            }
          });
        }

        a.classList.toggle('active');
        item.classList.toggle('show');
      });
    });

    if (sidebar.classList.contains('hide')) {
      allSideDivider.forEach(item => {
        item.textContent = '-';
      });
      allDropdown.forEach(item => {
        const a = item.parentElement?.querySelector<HTMLElement>('a:first-child');
        if (a) {
          a.classList.remove('active');
          item.classList.remove('show');
        }
      });
    } else {
      allSideDivider.forEach(item => {
        item.textContent = item.getAttribute('data-text');
      });
    }

    this.renderer.listen(toggleSidebar, 'click', () => {
      sidebar.classList.toggle('hide');

      if (sidebar.classList.contains('hide')) {
        allSideDivider.forEach(item => {
          item.textContent = '-';
        });

        allDropdown.forEach(item => {
          const a = item.parentElement?.querySelector<HTMLElement>('a:first-child');
          if (a) {
            a.classList.remove('active');
            item.classList.remove('show');
          }
        });
      } else {
        allSideDivider.forEach(item => {
          item.textContent = item.getAttribute('data-text');
        });
      }
    });

    this.renderer.listen(sidebar, 'mouseleave', () => {
      if (sidebar.classList.contains('hide')) {
        allDropdown.forEach(item => {
          const a = item.parentElement?.querySelector<HTMLElement>('a:first-child');
          if (a) {
            a.classList.remove('active');
            item.classList.remove('show');
          }
        });
        allSideDivider.forEach(item => {
          item.textContent = '-';
        });
      }
    });

    this.renderer.listen(sidebar, 'mouseenter', () => {
      if (sidebar.classList.contains('hide')) {
        allDropdown.forEach(item => {
          const a = item.parentElement?.querySelector<HTMLElement>('a:first-child');
          if (a) {
            a.classList.remove('active');
            item.classList.remove('show');
          }
        });
        allSideDivider.forEach(item => {
          item.textContent = item.getAttribute('data-text');
        });
      }
    });
  }

  private initializeMenu(): void {
    const allMenu = document.querySelectorAll<HTMLElement>('main .content-data .head .menu');

    allMenu.forEach(item => {
      const icon = item.querySelector<HTMLElement>('.icon');
      const menuLink = item.querySelector<HTMLElement>('.menu-link');
      if (!icon || !menuLink) return;

      this.renderer.listen(icon, 'click', () => {
        menuLink.classList.toggle('show');
      });

      this.renderer.listen(window, 'click', (e: Event) => {
        if (e.target !== icon && e.target !== menuLink && menuLink.classList.contains('show')) {
          menuLink.classList.remove('show');
        }
      });
    });
  }

  private initializeProgressBar(): void {
    const allProgress = document.querySelectorAll<HTMLElement>('main .card .progress');

    allProgress.forEach(item => {
      const value = item.getAttribute('data-value');
      if (value) {
        (item as HTMLElement).style.setProperty('--value', value);
      }
    });
  }

  listCourses(): void {
    this.courseService.getAllCourses().subscribe(
      (data: CourseModel[]) => {
        this.courseList = data;
        this.filterCourses();
      },
      error => {
        console.error('Error fetching courses', error);
      }
    );
  }

  filterCourses(): void {
    const { nameCourseFilter, descriptionFilter } = this.formularioFiltrado.value;

    const nameKeywords: string[] = nameCourseFilter ? nameCourseFilter.toLowerCase().split(' ') : [];
    const descriptionKeywords: string[] = descriptionFilter ? descriptionFilter.toLowerCase().split(' ') : [];

    this.filteredList = this.courseList.filter(course => {
      const courseName = course.nameCourse ? course.nameCourse.toLowerCase() : '';
      const courseDescription = course.description ? course.description.toLowerCase() : '';

      const nameMatches = nameKeywords.every((keyword: string) => courseName.includes(keyword));
      const descriptionMatches = descriptionKeywords.every((keyword: string) => courseDescription.includes(keyword));

      return ((!nameCourseFilter || nameMatches) &&
        (!descriptionFilter || descriptionMatches)
      );
    });

    this.currentPage = 1;
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
    this.formulario.reset(); // Reset form to default values
  }

  selectCourse(course: CourseModel): void {
    this.isUpdate = true;
    this.selectedCourse = course;
    this.formulario.patchValue(course);
  }

  insertCourse(): void {
    if (this.formulario.invalid) {
      this.toastr.error('Por favor, rellene todos los campos requeridos correctamente.', 'Error');
      return;
    }

    const courseData: CourseModel = this.formulario.value;
    this.courseService.createCourse(courseData).subscribe(
      res => {
        this.listCourses();
        this.toastr.success('Curso agregado con éxito', 'Éxito');
        this.formulario.reset(); // Reset the form after successful insertion
        this.closeModal(); // Close the modal programmatically
      },
      error => {
        console.error('Error adding course', error);
        this.toastr.error('Error al agregar el curso', 'Error');
      }
    );
  }

  updateCourse(): void {
    if (this.formulario.invalid || !this.selectedCourse) {
      this.toastr.error('Por favor, rellene todos los campos requeridos correctamente.', 'Error');
      return;
    }

    const courseData: CourseModel = this.formulario.value;
    this.courseService.updateCourse(this.selectedCourse.idCourse, courseData).subscribe(
      res => {
        this.listCourses();
        this.toastr.success('Curso actualizado con éxito', 'Éxito');
        this.formulario.reset(); // Reset the form after successful update
        this.closeModal(); // Close the modal programmatically
      },
      error => {
        console.error('Error updating course', error);
        this.toastr.error('Error al actualizar el curso', 'Error');
      }
    );
  }

  closeModal(): void {
    const modalElement = document.getElementById('ModalCourse');
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
  }

  viewCourse(course: CourseModel): void {
    this.selectedCourse = course;
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

  checkFormControlCss(controlName: string): { [key: string]: boolean } {
    const control = this.formulario.get(controlName);
    return {
      'is-invalid': !!control?.invalid && (control?.dirty || control?.touched),
      'is-valid': !!control?.valid
    };
  }
  noSymbolsValidator(control: AbstractControl) {
    return /[^a-zA-ZáéíóúÁÉÍÓÚ0-9 ]/.test(control.value) ? { 'noSymbols': true } : null;
  }
}
