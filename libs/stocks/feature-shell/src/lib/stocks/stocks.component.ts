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

  constructor(private fb: FormBuilder, private priceQuery: PriceQueryFacade) {
    this.stockPickerForm = fb.group({
      symbol: [null, Validators.required],
      periodFrom: [null, Validators.required],
      periodTo: [null, Validators.required]
    });
  }

  public ngOnInit(): void {
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

  public fetchQuote(): void {
    if (this.stockPickerForm.valid) {
      const { symbol, periodFrom, periodTo } = this.stockPickerForm.value;
      this.priceQuery.fetchQuote(symbol, { start: periodFrom, end: periodTo });
    }
  }

  public ngOnDestroy(): void {
    this.stockPickerFormSubscription.unsubscribe();
  }
}
