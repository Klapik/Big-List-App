import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { DocumentService } from 'src/app/services/document.service';
import { SearchService } from 'src/app/services/search.service';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(LoadingSpinnerComponent, { static: false }) loadingSpinnerComponent: LoadingSpinnerComponent;
  @ViewChild(CdkVirtualScrollViewport, { static: false }) viewport: CdkVirtualScrollViewport;

  public data: any;
  public sortProperties = {
    field: 'name',
    reverse: false
  };
  public sortMethods = [
    {
      sortType: 'name',
      class: 'col-2'
    },
    {
      sortType: 'surname',
      class: 'col-2'
    },
    {
      sortType: 'email',
      class: 'col-3'
    },
    {
      sortType: 'fullname',
      class: 'col-3'
    },
    {
      sortType: 'integer',
      class: 'col-1'
    },
  ];
  private alive: boolean;

  constructor(public documentService: DocumentService,
    public searchService: SearchService) { }

  ngOnInit() {
    this.alive = true;
    this.searchService.init('name', { reverse: false });
    this.searchService.data.pipe(
      takeWhile(() => this.alive)).subscribe(data => {
        this.data = [...data];
      });
  }

  ngAfterViewInit() {
    this.searchService.loading.pipe(
      takeWhile(() => this.alive)).subscribe((val) => {
        if (val) {
          this.loadingSpinnerComponent.show();
        } else {
          this.loadingSpinnerComponent.hide();
        }
      });
  }

  public nextBatch() {
    const end = this.viewport.getRenderedRange().end;
    const total = this.viewport.getDataLength();
    this.searchService.more(end, total);
  }

  public removeItem(index, doc) {
    this.loadingSpinnerComponent.show();
    this.documentService.deleteDocument(doc.objectID).then(() => {
      this.searchService.deleteDocument(index);
      this.loadingSpinnerComponent.hide();
    });
    this.nextBatch();
  }

  public sort(value) {
    if (this.sortProperties.field !== value) {
      this.sortProperties.reverse = null;
    }
    switch (this.sortProperties.reverse) {
      case false: {
        this.sortProperties.reverse = true;
        break;
      }
      case true: {
        this.sortProperties.field = 'name';
        this.sortProperties.reverse = false;
        break;
      }
      default: {
        this.sortProperties.reverse = false;
        this.sortProperties.field = value;
        break;
      }
    }
    this.searchService.sortData(this.sortProperties.field, { reverse: this.sortProperties.reverse });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
