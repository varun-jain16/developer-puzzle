import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'coding-challenge-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public readonly heading: string = 'Welcome to stocks!';
  public readonly title: string = 'stocks';

  constructor(private titleService: Title){}

  public ngOnInit(): void{
    this.titleService.setTitle(this.title);
  }
}
