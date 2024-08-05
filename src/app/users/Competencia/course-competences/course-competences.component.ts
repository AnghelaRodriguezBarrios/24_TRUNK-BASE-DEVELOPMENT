import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CourseCompetencesService } from 'src/app/service/course-competences.service';
import { CourseCompetencesModel } from 'src/app/model/courseCompetences-model';
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
  selector: 'app-course-competences',
  templateUrl: './course-competences.component.html',
  styleUrls: ['./course-competences.component.css']
})
export class CourseCompetencesComponent implements OnInit, AfterViewInit {
  competenceList: CourseCompetencesModel[] = [];
  courseList: CourseModel[] = [];
  paginatedList: CourseCompetencesModel[] = [];
  filteredList: CourseCompetencesModel[] = [];
  formulario: FormGroup;
  formularioFiltrado: FormGroup;
  isUpdate: boolean = false;
  selectedCompetence: CourseCompetencesModel | null = null;
  course: CourseModel[] = [];
  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  constructor(
    private competenceService: CourseCompetencesService,
    private courseService: CourseService,
    private toastr: ToastrService,
    private exportAsService: ExportAsService,
    private fb: FormBuilder,
    private renderer: Renderer2
  ) {
    this.formulario = this.fb.group({
      idCompetency: [''],
      nameCompetency: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚ0-9 ]+$'), // Permite letras y números, pero no símbolos
        this.noSymbolsValidator
      ]],
      description: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚ0-9 ]+$'), // Permite letras y números, pero no símbolos
        this.noSymbolsValidator
      ]],
      idCourse: ['', Validators.required]
    });

    this.formularioFiltrado = this.fb.group({
      nameCompetencyFilter: [''],
      descriptionFilter: ['']
    });
  }

  ngOnInit(): void {
    this.listCoursesAndCompetences();
    this.listCourses();
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
        // Imprime los cursos obtenidos
        this.courseList.forEach(course => {
          console.log(`Course fetched: ID - ${course.idCourse}, Name - ${course.nameCourse}, Description - ${course.description}`);
        });
        this.listCompetences();
      },
      error => {
        console.error('Error fetching courses', error);
      }
    );
  }


  getCourseName(idCourse: string | undefined): string {
    if (!idCourse) {
      return 'Unknown';
    }
    const course = this.courseList.find(c => c.idCourse === idCourse);
    return course ? course.nameCourse : 'Unknown';
  }
  

  
  listCoursesAndCompetences(): void {
    this.courseService.getAllCourses().subscribe(
      (courses: CourseModel[]) => {
        this.courseList = courses;
        this.competenceService.getAllCompetences().subscribe(
          (competences: CourseCompetencesModel[]) => {
            this.competenceList = competences;
            console.log('Competences with course IDs:', this.competenceList);
          },
          error => {
            console.error('Error fetching competences', error);
          }
        );
      },
      error => {
        console.error('Error fetching courses', error);
      }
    );
  }
  
  
  

  
  listCompetences(): void {
    this.competenceService.getAllCompetences().subscribe(
      (data: CourseCompetencesModel[]) => {
        this.competenceList = data.map(competence => {
          const course = this.courseList.find(course => course.idCourse === competence.idCourse);
          return {
            ...competence,
            idCourse: course ? course.idCourse : 'No Course Assigned'
          };
        });
        this.filterCompetences();
      },
      error => {
        console.error('Error fetching competences', error);
      }
    );
  }

  filterCompetences(): void {
    const { nameCompetencyFilter, descriptionFilter } = this.formularioFiltrado.value;

    const nameKeywords: string[] = nameCompetencyFilter ? nameCompetencyFilter.toLowerCase().split(' ') : [];
    const descriptionKeywords: string[] = descriptionFilter ? descriptionFilter.toLowerCase().split(' ') : [];

    this.filteredList = this.competenceList.filter(competence => {
      const competenceName = competence.nameCompetency ? competence.nameCompetency.toLowerCase() : '';
      const competenceDescription = competence.description ? competence.description.toLowerCase() : '';

      const nameMatches = nameKeywords.every((keyword: string) => competenceName.includes(keyword));
      const descriptionMatches = descriptionKeywords.every((keyword: string) => competenceDescription.includes(keyword));

      return ((!nameCompetencyFilter || nameMatches) &&
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

  newCompetence(): void {
    this.isUpdate = false;
    this.selectedCompetence = null;
    this.formulario.reset(); // Reset form to default values
  }

  selectCompetence(competence: CourseCompetencesModel): void {
    this.isUpdate = true;
    this.selectedCompetence = competence;
    this.formulario.patchValue(competence);
  }

  insertCompetence(): void {
    if (this.formulario.invalid) {
      this.toastr.error('Por favor, rellene todos los campos requeridos correctamente.', 'Error');
      return;
    }

    const competenceData: CourseCompetencesModel = this.formulario.value;

    this.competenceService.createCompetence(competenceData).subscribe(
      res => {
        this.listCompetences();
        this.toastr.success('Competencia agregada con éxito', 'Éxito');
        this.formulario.reset(); // Reset the form after successful insertion
        this.closeModal(); // Close the modal programmatically
      },
      error => {
        console.error('Error adding competence', error);
        this.toastr.error('Error al agregar la competencia', 'Error');
      }
    );
  }

  updateCompetence(): void {
    if (this.formulario.invalid || !this.selectedCompetence) {
      this.toastr.error('Por favor, rellene todos los campos requeridos correctamente.', 'Error');
      return;
    }

    const competenceData: CourseCompetencesModel = this.formulario.value;

    this.competenceService.updateCompetence(this.selectedCompetence.idCompetency, competenceData).subscribe(
      res => {
        this.listCompetences();
        this.toastr.success('Competencia actualizada con éxito', 'Éxito');
        this.formulario.reset(); // Reset the form after successful update
        this.closeModal(); // Close the modal programmatically
      },
      error => {
        console.error('Error updating competence', error);
        this.toastr.error('Error al actualizar la competencia', 'Error');
      }
    );
  }

  closeModal(): void {
    const modalElement = document.getElementById('ModalCompetency');
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
  }

  exportToPdf(): void {
    Swal.fire({
      title: 'Exportar informe',
      text: '¿Deseas exportar este informe de Competencias?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Exportar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        if (!this.filteredList || this.filteredList.length === 0) {
          console.error('No hay datos de competencias disponibles.');
          return;
        }
  
        const doc = new jsPDF('landscape');
  
        doc.setFillColor(255, 165, 0);
        doc.rect(0, 0, doc.internal.pageSize.width, 60, 'F');
  
        const logoLeft = 'assets/logo.png';
        doc.addImage(logoLeft, 'PNG', 20, 10, 40, 40);
  
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        const title = 'Listado de Competencias';
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
          'NOMBRE DE LA COMPETENCIA',
          'DESCRIPCIÓN'
        ];
  
        const separationSpace = 40;
        const startY = titleY + separationSpace;
  
        autoTable(doc, {
          head: [columns],
          body: this.filteredList.map(item => [
            this.getCourseName(item.idCourse),
            item.nameCompetency,
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
  
        doc.save('Competencias.pdf');
  
        Swal.fire({
          icon: 'success',
          title: '¡Informe exportado!',
          text: 'El informe de Competencias se ha exportado exitosamente.',
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
      text: '¿Deseas exportar la lista de competencias a un archivo Excel?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Exportar'
    }).then(result => {
      if (result.isConfirmed) {
        const exportConfig: ExportAsConfig = {
          type: 'xlsx',
          elementIdOrContent: 'competency',
          options: {
            orientation: 'landscape',
          }
        };

        const fileName = 'competency';

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
      text: '¿Deseas exportar la lista de competencias a un archivo CSV?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Exportar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        const exportData = this.filteredList.map(item => ({
          'Nombre del Curso': this.getCourseName(item.idCourse),
          'Nombre de la Competencia': item.nameCompetency,
          'Descripción': item.description
        }));
  
        const csv = this.convertToCSV(exportData);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Competencias.csv';
        a.click();
        window.URL.revokeObjectURL(url);
  
        this.toastr.success('Archivo CSV generado exitosamente', 'Éxito', {
          timeOut: 1500,
          positionClass: 'toast-top-right',
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.toastr.info('Exportación a CSV cancelada', 'Cancelado', {
          timeOut: 1500,
          positionClass: 'toast-top-right',
        });
      }
    });
  }
  
  private convertToCSV(objArray: any[]): string {
    const array = [Object.keys(objArray[0])].concat(objArray);
    return array.map(it => {
      return Object.values(it).toString();
    }).join('\n');
  }
  

  viewCompetence(competence: CourseCompetencesModel): void {
    this.selectedCompetence = competence ?? null; // Maneja posibles valores undefined o null
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
