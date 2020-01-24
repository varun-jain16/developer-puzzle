import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'coding-challenge-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent implements OnInit, OnDestroy {
  @Input() public data$: Observable<any>;
  public chartData: any;

  public chart: {
    title: string;
    type: string;
    data: any;
    columnNames: string[];
    options: any;
  };

  private isComponentActive: boolean;

  constructor(private cd: ChangeDetectorRef) { }

  public ngOnInit(): void {
    this.isComponentActive = true;
    this.chart = {
      title: '',
      type: 'LineChart',
      data: [],
      columnNames: ['period', 'close'],
      options: { title: `Stock price`, width: '600', height: '400' }
    };

    this.data$
      .pipe(takeWhile(() => this.isComponentActive))
      .subscribe(newData => {
        this.chartData = newData;
        this.cd.detectChanges();
      });
  }

  public ngOnDestroy(): void {
    this.isComponentActive = false;
  }
}
