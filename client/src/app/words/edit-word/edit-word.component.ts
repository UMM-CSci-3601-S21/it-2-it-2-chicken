import { Subscription } from 'rxjs';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WordListService } from 'src/app/services/wordlist.service';
import { Word } from 'src/app/datatypes/word';
import { WordList } from 'src/app/datatypes/wordlist';

@Component({
  selector: 'app-edit-word',
  templateUrl: './edit-word.component.html',
  styleUrls: ['./edit-word.component.scss']
})
export class EditWordComponent implements OnInit, OnChanges {
  forms = [''];
  wordlistname = '';
  wordList: WordList;
  wordname = '';
  word: Word;
  originalType = '';
  editedType = '';
  getUserSub: Subscription;

  finished = true;

  constructor(private route: ActivatedRoute, private service: WordListService) { }
  ngOnChanges(): void {
    this.check();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((pmap) => {
      this.wordlistname = pmap.get('name');
      this.wordname = pmap.get('word');
      if (this.getUserSub) {
        this.getUserSub.unsubscribe();
      }
      console.log(this.wordlistname);
      this.getUserSub = this.service.getWordListByName(this.wordlistname).subscribe(wl => {
        this.wordList = wl;
        this.originalType = WordList.getWordType(wl, this.wordname);
        this.word = WordList.getWord(wl, this.wordname);
        this.editedType = this.originalType;
        console.log(this.editedType);
      }
      );
    });
  }
  add(val) {
     this.forms.push(val);
    }

  check() {
    this.finished =
      this.wordname.length > 0 &&
      (['Noun', 'Adjective', 'Verb', 'Misc']).includes(this.editedType);
    console.log(this.wordname.length);

    return this.finished;
  }

  save() {
    const tedited: string = this.editedType === 'Noun' ? 'nouns' : this.editedType === 'Verb' ?
      'verbs' : this.editedType === 'Adjective' ? 'adjectives' : 'misc';
    const toriginal: string = this.originalType === 'Noun' ? 'nouns' : this.originalType === 'Verb' ?
      'verbs' : this.originalType === 'Adjective' ? 'adjectives' : 'misc';
    const loriginal: Word[] = this.wordList[tedited];
    const ledited: Word[] = this.wordList[toriginal];

    const index = loriginal.indexOf(this.word);
    if(index === -1){
      ledited.push({word:this.wordname,forms:this.forms});
      // loriginal.splice(,1);
    }
    // this.service.editWordList()
    // TODO: FINISH LATER
  }
  convertType(x){

  }
}
