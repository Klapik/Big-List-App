import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { SearchService } from 'src/app/services/search.service';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  public searchTerm$ = new Subject<string>();
  public error = null;
  private term = '';
  private alive: boolean;

  constructor(private searchService: SearchService) {
  }

  ngOnInit() {
    this.alive = true;
    this.searchService.search(this.searchTerm$).pipe(
      takeWhile(() => this.alive)).subscribe();
  }

  public search(term: string, isEnter?: boolean) {
    if (term.length >= 3 || !term) {
      this.error = null;
      if (isEnter && (this.term !== term)) {
        this.term = term;
        this.searchTerm$.next(term);
      }
    } else {
      this.error = 'The minimum number of characters has not been reached';
    }
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
