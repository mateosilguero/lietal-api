import BaseController from './base.controller';
import Dictionary from '../lib/dict.json';
import Dictionaery from '../lib/dictionaery.js';
import Lietal from '../models/Lietal.js';  

class TranslateController extends BaseController {

  constructor() {
    super();
    this.lietal = new Lietal(Dictionaery);
  } 

  translate = async (req, res, next) => {
    const { lang, word } = req.params;
    let direction = lang == 'en' ? 'en_li' : 'li_en';
    let translation = '';
    try {
      translation = this.lietal.convert(word, direction);
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