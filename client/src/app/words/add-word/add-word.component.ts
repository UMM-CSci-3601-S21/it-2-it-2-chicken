import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-add-word',
  templateUrl: './add-word.component.html',
  styleUrls: ['./add-word.component.scss']
})
export class AddWordComponent implements OnInit {
  @Output() addWord = new EventEmitter();
  @Input() words = [];

  forms = [''];
  wordName = '';
  finished = false;
  type: string;
  cleared = false;

  added = false;

  valid: boolean;


  constructor() { }

  check() {
    if (this.wordName && this.type) {
      this.finished =
        this.wordName.length > 1 &&
        this.type.length > 1     &&
        !this.words.some(word =>
          word.word === this.wordName &&
          word.forms === [this.wordName, ...this.forms.filter(e => e.length !== 0)]
        );
      console.log(this.wordName.length);
    }
    return this.finished;
  }

  ngOnInit(): void {
  }

  add(val) {
    this.forms.push(val);
    this.cleared = false;
  }

  removeForm(i: number) {
    console.log(i);
    this.forms.splice(i, 1);
    if (this.forms.length === 0) { this.forms = ['']; }
  }

  save() {
    this.addWord.emit({
      name: this.wordName,
      forms: [...new Set([this.wordName, ...this.forms.filter(e => e.length !== 0)])],// This line removes repetitions and inserts main word
      type: this.type
    });
    console.log(this.forms + this.wordName + this.type);
    this.wordName = '';
    this.forms = [''];
    this.added = false;
    this.finished = false;
    this.cleared = true;
  }
}
