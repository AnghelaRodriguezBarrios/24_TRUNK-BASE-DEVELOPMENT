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
export class CourseCompetencesComponent implements OnInit {
  competenceList: CourseCompetencesModel[] = [];
  courseList: CourseModel[] = [];
  paginatedList: CourseCompetencesModel[] = [];
  filteredList: CourseCompetencesModel[] = [];
  formulario: FormGroup;
  searchTerm: string = '';
  isUpdate: boolean = false;
  selectedCompetence: CourseCompetencesModel | null = null;
  modalViewCompetence: boolean = false;
  modalAdd: boolean = false;
  modalUpdate: boolean = false;
  filteredCourses: CourseModel[] = [];
  selectedCourse: string = '';
  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 7;
  totalPages: number = 1;

  constructor(
    private competenceService: CourseCompetencesService,
    private courseService: CourseService,
    private toastr: ToastrService,
    private exportAsService: ExportAsService,
    private fb: FormBuilder
  ) {
    this.formulario = this.fb.group({
      nameCompetency: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 ]+$/), // Unificado a objeto de expresión regular
        this.noSymbolsValidator
      ]],
      description: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]*$/) // Consistencia con objetos de expresión regular
      ]],
      idCourse: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.listCourses();
    this.listCompetences();
  }

  listCourses(): void {
    this.courseService.getAllCourses().subscribe(
      (data: CourseModel[]) => {
        this.courseList = data;
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

  listCompetences(): void {
    this.competenceService.getAllCompetences().subscribe(
      (data: CourseCompetencesModel[]) => {
        this.competenceList = data;
        this.filterCompetences();
      },
      error => {
        console.error('Error fetching competences', error);
      }
    );
  }

  filterCompetences(): void {
    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredList = this.competenceList.filter(competence =>
      competence.nameCompetency.toLowerCase().includes(searchTermLower) ||
      competence.description.toLowerCase().includes(searchTermLower)
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

  newCompetence(): void {
    this.isUpdate = false;
    this.selectedCompetence = null;
    this.formulario.reset();
    this.modalAdd = true;
  }

  selectCompetence(competence: CourseCompetencesModel): void {
    this.isUpdate = true;
    this.selectedCompetence = competence;
    this.formulario.patchValue(competence);
    this.modalUpdate = true;
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
        this.formulario.reset();
        this.closeModal();
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
        this.formulario.reset();
        this.closeModal();
      },
      error => {
        console.error('Error updating competence', error);
        this.toastr.error('Error al actualizar la competencia', 'Error');
      }
    );
  }

  closeModal(): void {
    this.modalAdd = false;
    this.modalUpdate = false;
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
    this.selectedCompetence = competence ?? null;
    this.modalViewCompetence = true; // Maneja posibles valores undefined o null
  }
  closeModalView(): void {
    this.modalViewCompetence = false;
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


  filterCompetencesByCourse(): void {
    if (this.selectedCourse) {
      this.filteredList = this.competenceList.filter(competence => competence.idCourse === this.selectedCourse);
    } else {
      this.filteredList = this.competenceList;
    }
    this.updatePaginatedList();
  }
}