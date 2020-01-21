import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { FetchPriceQuery } from './price-query.actions';
import { PriceQueryPartialState } from './price-query.reducer';
import { getSelectedSymbol, getAllPriceQueries } from './price-query.selectors';
import { map, skip } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class PriceQueryFacade {
  public selectedSymbol$: Observable<string> = this.store.pipe(select(getSelectedSymbol));
  public priceQueries$: Observable<(string | number)[][]> = this.store.pipe(
    select(getAllPriceQueries),
    skip(1),
    map(priceQueries =>
      priceQueries.map(priceQuery => [priceQuery.date, priceQuery.close])
    )
  );

  constructor(private store: Store<PriceQueryPartialState>) {}

  public fetchQuote(symbol: string, period: string): void {
    this.store.dispatch(new FetchPriceQuery(symbol, period));
  }
}
