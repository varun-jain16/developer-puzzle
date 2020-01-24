import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StocksComponent } from './stocks.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NxModule } from '@nrwl/nx';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StocksDataAccessPriceQueryModule, PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { StocksAppConfigToken } from '@coding-challenge/stocks/data-access-app-config';

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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('fetch quote when form is valid', () => {
    spyOn(priceQueryFacade, 'fetchQuote').and.stub();
    component['stockPickerForm'].controls['symbol'].setValue('test');
    component['stockPickerForm'].controls['period'].setValue('1m');
    component.fetchQuote();
    expect(priceQueryFacade.fetchQuote).toHaveBeenCalledTimes(1);
    expect(priceQueryFacade.fetchQuote).toHaveBeenCalledWith('test', '1m');
  });

  it('fetch quote when form is not valid', () => {
    spyOn(priceQueryFacade, 'fetchQuote').and.stub();
    component.fetchQuote();
    expect(priceQueryFacade.fetchQuote).not.toHaveBeenCalled();
  });
});
