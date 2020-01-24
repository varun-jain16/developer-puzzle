import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { StocksComponent } from './stocks.component';
import { SharedUiChartModule } from '@coding-challenge/shared/ui/chart';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule } from '@angular/material';
import { StocksDataAccessPriceQueryModule, PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NxModule } from '@nrwl/nx';
import { StocksAppConfigToken } from '@coding-challenge/stocks/data-access-app-config';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('StocksComponent', () => {
  let component: StocksComponent;
  let fixture: ComponentFixture<StocksComponent>;
  let priceQueryFacade: PriceQueryFacade;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StocksComponent],
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
        SharedUiChartModule,
        StocksDataAccessPriceQueryModule
      ],
      providers: [{
        provide: StocksAppConfigToken, useValue: {
          production: false,
          apiKey: '',
          apiURL: ''
        }
      }],
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

  it('fetch quote on value changes when form is valid', fakeAsync(() => {
    spyOn(priceQueryFacade, 'fetchQuote').and.stub();
    component.stockPickerForm.controls['symbol'].setValue('test');
    component.stockPickerForm.controls['period'].setValue('1m');
    tick(1000);
    expect(priceQueryFacade.fetchQuote).toHaveBeenCalledTimes(1);
    expect(priceQueryFacade.fetchQuote).toHaveBeenCalledWith('test', '1m');
  }));

  it('fetch quote on value changes when form is invalid', fakeAsync(() => {
    spyOn(priceQueryFacade, 'fetchQuote').and.stub();
    component.stockPickerForm.controls['symbol'].setValue('test');
    tick(1000);
    expect(priceQueryFacade.fetchQuote).not.toHaveBeenCalled();
  }));
});
