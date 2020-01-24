import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { FetchPriceQuery } from './price-query.actions';
import { PriceQueryPartialState } from './price-query.reducer';
import { getSelectedSymbol, getAllPriceQueries } from './price-query.selectors';
import { map, skip } from 'rxjs/operators';
import { PriceRange } from './price-query.type';
import { DatePipe } from '@angular/common';

@Injectable()
export class PriceQueryFacade {
  public selectedSymbol$ = this.store.pipe(select(getSelectedSymbol));
  public priceQueries$ = this.store.pipe(
    select(getAllPriceQueries),
    skip(1),
    map(priceQueries => priceQueries.filter((priceQuery) => {
      const minDate = this.datePipe.transform(this.dateRange.start, 'yyyy-MM-dd');
      const maxDate = this.datePipe.transform(this.dateRange.end, 'yyyy-MM-dd');
      const resDate = this.datePipe.transform(priceQuery.date, 'yyyy-MM-dd');
      return (resDate >= minDate && resDate <= maxDate);
    }).map(priceQuery => [priceQuery.date, priceQuery.close])
    ));

  private dateRange: PriceRange = { start: '', end: '' };

  constructor(private store: Store<PriceQueryPartialState>, private datePipe: DatePipe) { }

  public fetchQuote(symbol: string, dateRange: PriceRange): void {
    /**
     * Since there is a limitation of API to return value for particular range
     * We have to do the below computations.
     */
    const startRange = new Date(dateRange.start);
    const endRange = new Date();
    const yearDifference = endRange.getFullYear() - startRange.getFullYear();
    let period = '';
    if (yearDifference === 0) {
      let monthDifference = endRange.getMonth() - startRange.getMonth();
      switch (true) {
        case (monthDifference < 2):
          period = '1m';
          break;

        case (monthDifference < 4):
          period = '3m';
          break;

        case (monthDifference < 7):
          period = '6m';
          break;

        default:
          period = 'ytd';
      }
    } else {
      switch (true) {
        case (yearDifference < 2):
          period = '1y';
          break;

        case (yearDifference < 3):
          period = '2y';
          break;

        case (yearDifference < 6):
          period = '5y';
          break;

        default:
          period = 'max';
      }
    }
    this.dateRange = dateRange;
    this.store.dispatch(new FetchPriceQuery(symbol, period));
  }
}
