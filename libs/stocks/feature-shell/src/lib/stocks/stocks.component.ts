import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';
import { debounceTime, takeWhile } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TIME_PERIODS } from '../constants/time-periods.contant';
import { ITimePeriods } from '../interfaces/time-periods.interface';

@Component({
  selector: 'coding-challenge-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit, OnDestroy {
  public stockPickerForm: FormGroup;
  private isComponentActive: boolean;

  public quotes$: Observable<(string | number)[][]> = this.priceQuery.priceQueries$;

  public readonly timePeriods: Readonly<ITimePeriods[]> = TIME_PERIODS;

  constructor(private fb: FormBuilder, private priceQuery: PriceQueryFacade) {
    this.stockPickerForm = fb.group({
      symbol: [null, Validators.required],
      period: [null, Validators.required]
    });
  }

  public ngOnInit(): void {
    this.isComponentActive = true;
    this.stockPickerForm.valueChanges
      .pipe(takeWhile(() => this.isComponentActive))
      .pipe(debounceTime(1000))
      .subscribe(this.fetchQuote);
  }

  public ngOnDestroy(): void {
    this.isComponentActive = false;
  }

  private fetchQuote = (): void => {
    if (this.stockPickerForm.valid) {
      const { symbol, period } = this.stockPickerForm.value;
      this.priceQuery.fetchQuote(symbol, period);
    }
  }
}
