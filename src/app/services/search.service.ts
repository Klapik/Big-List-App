import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, scan } from 'rxjs/operators';
import * as algoliasearch from 'algoliasearch';
import { environment } from '../../environments/environment';

const DEFAULT_BATCH_SIZE = 100;

interface QueryConfig {
  index: string; //  index name
  field: string; // field to orderBy
  term: string; // term to search
  limit: number; // limit per query
  reverse: boolean; // reverse order?
  offset: number; // offset
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  // Source data
  private _done = new BehaviorSubject(false);
  private _loading = new BehaviorSubject(false);
  private _data = new BehaviorSubject([]);

  private query: QueryConfig;

  // Observable data
  data: Observable<any>;
  done: Observable<boolean> = this._done.asObservable();
  loading: Observable<boolean> = this._loading.asObservable();

  // Initialize the Algolia Client
  client = algoliasearch(environment.algolia.appId, environment.algolia.searchKey);
  indexes: any;
  replicaIndex: any;

  constructor() {
  }

  initIndicies() {
    this.indexes = {
      documents_name_asc: this.client.initIndex('documents_name_asc'),
      documents_name_desc: this.client.initIndex('documents_name_desc'),
      documents_surname_asc: this.client.initIndex('documents_surname_asc'),
      documents_surname_desc: this.client.initIndex('documents_surname_desc'),
      documents_fullname_asc: this.client.initIndex('documents_fullname_asc'),
      documents_fullname_desc: this.client.initIndex('documents_fullname_desc'),
      documents_email_asc: this.client.initIndex('documents_email_asc'),
      documents_email_desc: this.client.initIndex('documents_email_desc'),
      documents_integer_asc: this.client.initIndex('documents_integer_asc'),
      documents_integer_desc: this.client.initIndex('documents_integer_desc'),
    };
  }

  init(field: string, opts?: any) {
    this.initIndicies();
    this.makeFirstQuery(field, opts);

    // Create the observable array for consumption in components
    this.data = this._data.asObservable().pipe(scan((acc, val) => {
      if (!val) {
        return [];
      }
      if (val.length && val[0].op && val[0].op === 'delete') {
        acc.splice(val[0].index, 1);
        return acc;
      } else {
        return acc.concat(val);
      }
    }));
  }

  public makeFirstQuery(field: string, opts?: any) {
    this._done.next(false);
    this.query = {
      field,
      limit: DEFAULT_BATCH_SIZE,
      reverse: false,
      term: '',
      offset: 0,
      ...opts
    };

    this.query.index = 'documents_'.concat(field).concat(this.query.reverse ? '_desc' : '_asc');

    // loading
    this._loading.next(true);

    return this.indexes[this.query.index].search('', {
      query: this.query.term,
      length: this.query.limit,
    }).then(res => {
      this._data.next(res.hits);
      this.query.offset += res.hits.length;
      this._loading.next(false);
      // no more values, mark done
      if (!res.hits.length) {
        this._done.next(true);
      }
    });

  }

  // load more documents
  more(end, total) {
    if (end <= (total - 30)) {
      return;
    }
    if (this._done.value || this._loading.value) {
      return;
    }
    // loading
    this._loading.next(true);
    this.indexes[this.query.index].search('', {
      query: this.query.term,
      offset: this.query.offset,
      length: this.query.limit,
    }).then(res => {
      this.query.offset += res.hits.length;
      this._data.next(res.hits);
      this._loading.next(false);
      // no more values, mark done
      if (!res.hits.length) {
        this._done.next(true);
      }
    });
  }

  // clear observable data
  public reset() {
    this._data.next(null);
  }

  public sortData(field: string, opts?: any) {
    this.reset();
    return this.makeFirstQuery(field, {...opts, term: this.query.term});
  }

  deleteDocument(index) {
    this._data.next([{op: 'delete', index: index}]);
    this.query.offset -= 1;
  }

  search(terms: Observable<string>) {
    return terms.pipe(
      debounceTime(0),
      distinctUntilChanged(),
      switchMap((term) => {
        this.reset();
        return this.makeFirstQuery(this.query.field, {reverse: this.query.reverse, term: term});
      })
    );
  }
}


