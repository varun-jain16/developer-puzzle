import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartComponent } from './chart.component';
import { GoogleChartsModule } from 'angular-google-charts';
import { of } from 'rxjs';

describe('ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [GoogleChartsModule.forRoot()],
      declarations: [ChartComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
    component.data$ = of(null);
    fixture.detectChanges();
    spyOn(component, 'data$').and.stub();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be able to subscribe to change data', async() => {
    component.data$ = of([['23-01-2020', '45'],['22-01-2020', '44']]);
    component.ngOnInit();
    expect(component.chartData).toEqual([['23-01-2020', '45'],['22-01-2020', '44']]);
  });
});
