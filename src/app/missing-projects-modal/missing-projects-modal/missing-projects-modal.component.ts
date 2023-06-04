import { SimpleChanges } from '@angular/core';
import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-missing-projects-modal',
  templateUrl: './missing-projects-modal.component.html',
  styleUrls: ['./missing-projects-modal.component.css']
})
export class MissingProjectsModalComponent implements OnInit, OnChanges {

  @Input() data;
  allTitles: string[];
  missingProjects: string[] = [];
  showSuccess: boolean;

  constructor() { }

  ngOnInit() {
    this.allTitles = this.data.filter(d => !d.rejection_link).map( d => d.title);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data) {
      this.allTitles = this.data
      .filter(d => !d.rejection_link)
      .map( d => d.title);
    }
  }

  checkProjects(titleText: string) {
    this.missingProjects = [];
    const inputTitles: string[] = titleText.split('\n').map( (t) => t.trim() );
    for (let title of inputTitles) {
      if (!this.allTitles.includes(title)) {
        this.missingProjects.push(title);
      }
    }
    if (this.missingProjects.length === 0) {
      this.showSuccess = true;
      setTimeout( () => {
        this.showSuccess = false;
      }, 5000);
    }
  }

}
