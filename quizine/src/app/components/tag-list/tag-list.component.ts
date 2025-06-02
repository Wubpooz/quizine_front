import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tag-list',
  standalone: true,
  imports: [],
  templateUrl: './tag-list.component.html'
})
export class TagListComponent {
    @Input() tags: string[] = [];
    @Input() class: string = "";
}
