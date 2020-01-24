import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  StocksAppConfig,
  StocksAppConfigToken
} from '@coding-challenge/stocks/data-access-app-config';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map, switchMap } from 'rxjs/operators';
import {
  FetchPriceQuery,
  PriceQueryActionTypes,
  PriceQueryFetched,
  PriceQueryFetchError,
  SelectSymbol
} from './price-query.actions';
import { PriceQueryPartialState } from './price-query.reducer';
import { PriceQueryResponse } from './price-query.type';
import { DatePipe } from '@angular/common';

@Injectable()
export class PriceQueryEffects {
  @Effect() loadPriceQuery$ = this.dataPersistence.fetch(
    PriceQueryActionTypes.FetchPriceQuery,
    {
      run: (action: FetchPriceQuery, state: PriceQueryPartialState) => {
        return this.httpClient
          .get(
            `${this.env.apiURL}/beta/stock/${action.symbol}/chart/${
            action.period
            }?token=${this.env.apiKey}`
          )
          .pipe(
            map((resp: PriceQueryResponse[]) => resp.filter((priceQuery) => {
              const minDate = this.datePipe.transform(action.dateRange.start, 'yyyy-MM-dd');
              const maxDate = this.datePipe.transform(action.dateRange.end, 'yyyy-MM-dd');
              const resDate = this.datePipe.transform(priceQuery.date, 'yyyy-MM-dd');
              return (resDate >= minDate && resDate <= maxDate);
            })), switchMap(resp => {
              return [
                new PriceQueryFetched(resp as PriceQueryResponse[]),
                new SelectSymbol(action.symbol)
              ];
            })
          )
      },

      onError: (action: FetchPriceQuery, error) => {
        return new PriceQueryFetchError(error);
      }
    }
  );

  constructor(
    @Inject(StocksAppConfigToken) private env: StocksAppConfig,
    private httpClient: HttpClient,
    private dataPersistence: DataPersistence<PriceQueryPartialState>,
    private datePipe: DatePipe
  ) { }
}
