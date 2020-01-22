import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';
import { Subscription } from 'rxjs';

@Component({
  selector: 'coding-challenge-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit, OnDestroy {
  stockPickerForm: FormGroup;

  quotes$ = this.priceQuery.priceQueries$;

  public maxDateFrom: Date = new Date();
  public minDateTo: Date = new Date();
  public maxDateTo: Date = new Date();
  private stockPickerFormSubscription: Subscription;

  timePeriods = [
    { viewValue: 'All available data', value: 'max' },
    { viewValue: 'Five years', value: '5y' },
    { viewValue: 'Two years', value: '2y' },
    { viewValue: 'One year', value: '1y' },
    { viewValue: 'Year-to-date', value: 'ytd' },
    { viewValue: 'Six months', value: '6m' },
    { viewValue: 'Three months', value: '3m' },
    { viewValue: 'One month', value: '1m' }
  ];

  constructor(private fb: FormBuilder, private priceQuery: PriceQueryFacade) {
    this.stockPickerForm = fb.group({
      symbol: [null, Validators.required],
      periodFrom: [null, Validators.required],
      periodTo: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.stockPickerFormSubscription = this.stockPickerForm.get('periodFrom').valueChanges
      .subscribe((periodFromValue) => {
        if (periodFromValue) {
          if (
            this.stockPickerForm.controls['periodTo'].value &&
            this.stockPickerForm.controls['periodTo'].value < periodFromValue
          ) {
            this.stockPickerForm.controls['periodTo'].setValue(periodFromValue);
          }
          this.minDateTo = periodFromValue;
        }
      });
  }

  fetchQuote() {
    if (this.stockPickerForm.valid) {
      const { symbol, periodFrom, periodTo } = this.stockPickerForm.value;
      this.priceQuery.fetchQuote(symbol, { start: periodFrom, end: periodTo });
    }
  }

  ngOnDestroy(): void {
    this.stockPickerFormSubscription.unsubscribe();
  }
}
