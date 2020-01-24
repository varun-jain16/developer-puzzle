import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StocksComponent } from './stocks.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule } from '@angular/material';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NxModule } from '@nrwl/nx';
import { StocksDataAccessPriceQueryModule, PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';
import { StocksAppConfigToken } from '@coding-challenge/stocks/data-access-app-config';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('StocksComponent', () => {
  let component: StocksComponent;
  let fixture: ComponentFixture<StocksComponent>;
  let priceQueryFacade: PriceQueryFacade;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        NoopAnimationsModule,
        NxModule.forRoot(),
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        StocksDataAccessPriceQueryModule
      ],
      declarations: [StocksComponent],
      providers: [{
        provide: StocksAppConfigToken, useValue: {
          production: false,
          apiKey: '',
          apiURL: ''
        }
      }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    priceQueryFacade = fixture.debugElement.injector.get(PriceQueryFacade);
  });

  describe('ngOnInIt', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('min date to be unchanged if periodFrom is null', () => {
      const minDate = new Date('24-01-2020');
      component.minDateTo = minDate;
      component['stockPickerForm'].controls['periodFrom'].setValue(null);
      expect(component.minDateTo).toBe(minDate);
    });

    it('min date to change if periodFrom is not null and period to is not less than period from', () => {
      const newMinDate = new Date('23-01-2020')
      component.minDateTo = new Date('24-01-2020');
      component['stockPickerForm'].controls['periodFrom'].setValue(newMinDate);
      expect(component.minDateTo).toBe(newMinDate);
    });

    it('period to be period from if period to is less than period from', () => {
      const fromDate = new Date('24-01-2020');
      const toDate = new Date('23-01-2020');
      const minDate = new Date('22-01-2020');
      component.minDateTo = minDate;
      component['stockPickerForm'].controls['periodTo'].setValue(toDate);
      component['stockPickerForm'].controls['periodFrom'].setValue(fromDate);
      expect(component.minDateTo).toBe(fromDate);
      expect(component['stockPickerForm'].controls['periodTo'].value.getDate())
        .toBe(component['stockPickerForm'].controls['periodFrom'].value.getDate());
    });
  });

  describe('fetchQuote', () => {
    it('fetch quote when form is valid', () => {
      const periodFrom = new Date('23-01-2020');
      const periodTo = new Date('24-01-2020');
      spyOn(priceQueryFacade, 'fetchQuote').and.stub();
      component['stockPickerForm'].controls['symbol'].setValue('test');
      component['stockPickerForm'].controls['periodFrom'].setValue(periodFrom);
      component['stockPickerForm'].controls['periodTo'].setValue(periodTo);
      component.fetchQuote();
      expect(priceQueryFacade.fetchQuote).toHaveBeenCalledTimes(1);
      expect(priceQueryFacade.fetchQuote).toHaveBeenCalledWith('test', { start: periodFrom, end: periodTo });
    });

    it('fetch quote when form is not valid', () => {
      spyOn(priceQueryFacade, 'fetchQuote').and.stub();
      component.fetchQuote();
      expect(priceQueryFacade.fetchQuote).not.toHaveBeenCalled();
    });
  });
});
