import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { SearchTerm } from 'src/app/models/search.model';
import { SearchService } from 'src/app/services/search.service';
import { bounceInOnEnterAnimation, bounceOutOnLeaveAnimation } from 'angular-animations';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  animations: [bounceInOnEnterAnimation(), bounceOutOnLeaveAnimation()
  ]
})
export class HomePageComponent implements OnInit {
  isLoading: boolean = false;
  bottomMessage: string = 'Ingresa tu búsqueda...';
  resultFound: any = null;
  searchForm: FormGroup = this.formBuild();
  @ViewChild('notifierTemplate') notifierTemplate: any;

  constructor(
    private spinnerService: NgxSpinnerService,
    private fmBuilder: FormBuilder,
    private notifierService: NotifierService,
    private searchService: SearchService
  ) { }

  ngOnInit() { }

  formBuild() {
    return this.fmBuilder.group({
      tienda     : ['', Validators.required],
      referencia : ['', Validators.required]
    });
  }

  search() {
    if (this.searchForm.invalid) {
      this.notifierService.show({type: 'warning', message: 'Ingrese todos los datos', template: this.notifierTemplate});
      return;
    }

    const searchTerm: SearchTerm = this.searchForm.value;
    this.spinnerService.show('resultsSpinner');
    this.isLoading = true

    this.searchService.search(searchTerm).subscribe(
      data => {
        this.isLoading = false;
        this.spinnerService.hide('resultsSpinner');

        if(!data || !data.tienda || !data.referencia) {
          this.notifierService.show({type: 'warning', message: 'No se encontraron resultados', template: this.notifierTemplate});
          this.resultFound = null;
          this.bottomMessage = 'Intenta otra vez...';
          return;
        }

        if (!this.validPdfUrl(data.url)) {
          this.notifierService.show({type: 'warning', message: 'Url de pdf inválida', template: this.notifierTemplate});
          this.resultFound = null;
          this.bottomMessage = 'Intenta otra vez...';
          return;
        };

        this.bottomMessage = 'Resultado...'
        this.notifierService.show({type: 'success', message: 'Se encontraron resultados', template: this.notifierTemplate});
        this.resultFound = data;
      },
      error => {
        this.bottomMessage = 'Intenta otra vez...';
        this.isLoading = false;
        this.spinnerService.hide('resultsSpinner');
        this.notifierService.show({type: 'warning', message: 'Error inesperado', template: this.notifierTemplate});
      }
    )
  }

  validPdfUrl(pdfUrl: string): boolean {
    const regex = new RegExp(/^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/g);
    if (!pdfUrl || pdfUrl?.length === 0 || !pdfUrl.includes('.pdf') || !pdfUrl.match(regex)) return false;

    return true;
  }

}
