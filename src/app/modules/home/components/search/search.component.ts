import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { SearchService } from 'src/app/services/search.service';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @ViewChild(LoadingSpinnerComponent, { static: false }) loadingSpinnerComponent: LoadingSpinnerComponent;

  searchTerm$ = new Subject<string>();
  error = null;
  term = '';

  constructor(private searchService: SearchService) {
    this.searchService.search(this.searchTerm$).subscribe( () => {
      this.loadingSpinnerComponent.hide();
    });
  }

  ngOnInit() {
  }

  public search(term: string, isEnter?: boolean) {
    if (term.length >= 3 || !term) {
      this.error = null;
      if (isEnter && (this.term !== term)) {
        this.term = term;
        this.loadingSpinnerComponent.show();
        this.searchTerm$.next(term);
      }
    } else {
      this.error = 'The minimum number of characters has not been reached';
    }
  }

}
