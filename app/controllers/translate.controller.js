import BaseController from './base.controller';
import Dictionary from '../lib/dict.json';
import Dictionaery from '../lib/dictionaery.js';
import Lietal from '../models/Lietal.js';  
import compromise from 'compromise';

class TranslateController extends BaseController {

  constructor() {
    super();
    this.lietal = new Lietal(Dictionary, true);
  } 

  translate = async (req, res, next) => {
    const { lang, word } = req.params;
    //QUESTION SETTING - SUBJECT TOPIC VERB
    let doc = compromise(word);
    let construction = {
      questions: doc.questions().out('text').trim(),      
      nouns: doc.nouns().out('text').trim(),
      adjectives: doc.adjectives().out('text').trim(),
      values: doc.values().out('text').trim(),
      pronouns: doc.match('#Pronoun').out('text').trim(),
      subjects: doc.people().out('text').trim(),
      topics: doc.topics().out('text').trim(),
      verbs: doc.verbs().conjugate(),
      negative: doc.match('#Negative').out('text').trim() ? 'negative' : null,
      future: doc.match('#FuturePerfect').out('text').trim() ? 'future' : null,
      past: doc.match('#PastTense').out('text').trim() ? 'past' : null,
    };    
    construction.verbs = construction.verbs.reduce(function(oldValue, current){
      oldValue += current.Infinitive + ' ';
      return oldValue;
    }, '');
    construction.verbs = construction.verbs.trim();
    construction.questions = construction.questions.split(' ')[0] ? construction.questions.split(' ')[0] : ''   
    let direction = lang == 'en' ? 'en_li' : 'li_en';
    let translation = '';
    try {
      let wordsArray = [];
      for ( let key in construction ) {
        if(construction[key]) {
          construction[key].split(' ').map((w) => {
            w = key == 'verbs' ? 'to_' + w : w;
            let index = wordsArray.indexOf(w);            
            wordsArray.push(w);
            if(index >= 0) {
              wordsArray.splice(index, 1);
            }            
          });          
        }
      }
      let array = wordsArray.join(' ')
        .replace(/(is)|(am)|(are)/g, 'be')
        .replace(' negative', '.negative')
        .replace(' past', '_past');
      translation = this.lietal.construction(array);       
      if (translation) {
        return res.status(200).json({ success: true, word, direction, translation });
      } else {
        return res.status(200).json({ success: false, word });
      }
    } catch (err) {
      next(err);
    }
  }
}

export default new TranslateController();