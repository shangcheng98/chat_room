// @ts-ignore
import Typo from "./typo.js";
import init , {initialize_chain,generate_prediction}  from "../markov/pkg/index"
 
// @ts-ignore
const dictionary = new Typo("de", undefined, undefined, {dictionaryPath: "dictionaries"});

//Globals for DOM
let textAreaHighlights = null;
let textArea = null;
let spellPredictionArea = null;
let wordPredictionArea = null;


//Start and End of the current word. Needed to be set correctly for event handlers.
let currentWordStart = -1;
let currentWordStop = 0;

let wrongWords: Array<String> = [];

let spellPredictions: NodeListOf<HTMLElement> = null;
let wordPredictions: NodeListOf<HTMLElement> = null;

/**
 *
 * @param word Word to delete
 *
 * Delete word if it contains in dict
 */
function deleteFromWrongWords(word) {
    const index = wrongWords.indexOf(word);
    if (index > -1) {
        wrongWords.splice(index, 1);
    } else {
        console.log("word not found");
    }
}

/**
 * @param word Word to add and delete
 *
 * Add word to dictionary and delete it from wrong words
 */
function addWordToDictionary(word: string) {
    dictionary.dictionaryTable[word] = null;
    deleteFromWrongWords(word);
}

/**
 *
 * Mark all wrong words with <string>-tag and set to highlights
 */
function applyMarks() {
    let text = textArea.value;
    wrongWords.forEach(wrong => {
        if (wrong.length == 0) return false;
        text = text.replace(new RegExp('\\b' + <string>wrong + '\\b', 'gi'), '<mark>' + <string>wrong + '</mark>');
         
    });

    textAreaHighlights.innerHTML = text;
}

/**
 *
 * @param s String to check
 *
 * Check if string matches punctuation
 */
function isPunctuation(s) {
    if (s == undefined) {
        return true;
    }

    return s.match(/(~|`|!|@|#|\$|%|\^|&|\*|\(|\)|{|}|\[|\]|;|:|\"|'|<|,|\.|>|\?|\/|\\|\||-|_|\+|=| )/g) != null;
}

/**
 *
 * @param word Word to check
 *
 * Checks if word is in the dictionary and if not, marks the wrong words in the list
 */
function checkWord(word) {
    //Remove spaces at beginning/end
    word = word.replace(/ /g, '');
    word = word.replace(/(~|`|!|@|#|\$|%|\^|&|\*|\(|\)|{|}|\[|\]|;|:|\"|'|<|,|\.|>|\?|\/|\\|\||-|_|\+|=)/g,"");
    if (!dictionary.check(word)) {
        wrongWords.push(word);
        
    }
  
}

function checkWords() {
	wrongWords = [];
    const tokens: Array<string> = textArea.value.split(' ');
     
    tokens.forEach((token => checkWord(token)));
}

/**
 *
 * @param index
 * @return The word at index
 *
 * Get the word at a certain index
 */
function getWordAtIndex(index) {
    const text = textArea.value;
    currentWordStart = currentWordStop = index;

    while (!isPunctuation(text[currentWordStart])) {
        currentWordStart--;
    }

    currentWordStart++;

    while (!isPunctuation(text[currentWordStop])) {
        currentWordStop++;
    }

    return text.substring(currentWordStart, currentWordStop);
}

/**
 *
 * @param words Words to show
 *
 * Shows correction options specified in words
 */
function showSpellPredictions(words) {
    let i = 0;
    Array.from(spellPredictions).forEach((prediction) => {
        prediction.innerHTML = words[i] == undefined ? "" : words[i];
        i++;
    });
    spellPredictionArea.style.visibility = "visible";
}

/**
 *
 * @param words Words to show
 *
 * Shows prediction options specified in words
 */
function showWordPredictions(words) {
    let i = 0;
    Array.from(wordPredictions).forEach((prediction) => {
        prediction.innerHTML = words[i] == undefined ? "" : words[i];
        i++;
    });
    wordPredictionArea.style.visibility = "visible";
}

/**
 *
 * @param word Word to get prediction for
 * @return Generated predictions
 *
 *  Generates predictions using WebAssembly
 */
function getPredictionFor(word) {
    //Implement me!
    let suggest:string;
    suggest = generate_prediction(word);
    const tokens: Array<string>  = suggest.split(' ')
   
    return tokens[1];
}

/**
 *
 * @param e KeyboardEvent
 *
 * Called each time something has been typed into the textarea.
 */
function handleKeyUp(e: KeyboardEvent): void {
    const tokens: Array<string>  = textArea.value.split(' ')
    
    //Implement me!
    checkWords();
    
    applyMarks()

    if(e.keyCode == 32){
        
        let words: string[] = [];
        for(let i=0;i< 3;i++){
            words.push(getPredictionFor(tokens[tokens.length-1]));
        }
        
       showWordPredictions(words);
    }else{
       
        document.getElementById('wordPrediction').style.visibility = "hidden";
        document.getElementById('spellPrediction').style.visibility = "hidden";
    }
}

/**
 *
 * @param e KeyboardEvent
 *
 * Called each time before something has been typed into the textarea.
 */
function handleKeyDown(e: KeyboardEvent): void {
  
     if(e.key == "Backspace"){
        checkWords();
     }
    //Implement me!
}

/**
 *
 * @param event
 *
 * Handles the click on a word
 */
function handleClick(event: Event): void {

    //target of click checken?

    let choosenWord = getWordAtIndex(textArea.selectionStart);
    if(wrongWords.includes(choosenWord)){
         showSpellPredictions(dictionary.suggest(choosenWord,3));
    }
   
    //showSpellPredictions();
    //Implement me!
}

/**
 *
 * @param event Event
 *
 * Handles click to add a new word to dict
 *
 */
function handleClickAddToDict(event: Event): void {
    console.log('handleClickAddToDict'+event)
    let choosenWord = getWordAtIndex(textArea.selectionStart);
    addWordToDictionary(choosenWord);
}

/**
 *
 * @param event Event
 *
 * Handles click of spell-predictions to change missspelled word
 *
 */
function handleClickSpellPrediction(e: MouseEvent): void {
    let choosenWord = getWordAtIndex(textArea.selectionStart);
     
 
    textArea.setRangeText((e.target as HTMLElement).innerHTML,currentWordStart,currentWordStop);
     
    
    document.getElementById('spellPrediction').style.visibility = "hidden";
    //Implement me!

}

/**
 *
 * @param event Event
 *
 * Handles click of spell-predictions to change missspelled word
 *
 */
function handleClickWordPrediction(e: MouseEvent): void {
    //Implement me!
    let choosenWord = getWordAtIndex(textArea.selectionStart);
     
    let len = choosenWord.length;
    textArea.setRangeText((e.target as HTMLElement).innerHTML,textArea.selectionStart,textArea.selectionStart+len);
    
}

/**
 * Import into your webpack entrypoint.
 * Just run the function on windowload.
 */
export default function loadCheckWords(): void
{
    textAreaHighlights = document.getElementById('highlights');
    textArea = document.getElementById('textarea') as HTMLTextAreaElement;
    spellPredictionArea = document.getElementById("spellPrediction");
    spellPredictions = <NodeListOf<HTMLElement>>document.querySelectorAll((".innerSpellPrediction"));
    const menuAdd = <HTMLElement>document.getElementsByClassName("addWord")[0];

    wordPredictionArea = document.getElementById("wordPrediction");
    wordPredictions = <NodeListOf<HTMLElement>>document.querySelectorAll((".innerWordPrediction"));

    textArea.addEventListener('keydown', handleKeyDown);
    textArea.addEventListener('keyup', handleKeyUp);

    window.addEventListener("click", handleClick);
    menuAdd.addEventListener("click", handleClickAddToDict);

    //Add event-listeners for the prediction Elements. When clicked they should replace the wrong word
    Array.from(spellPredictions).forEach((prediction) => {
        prediction.addEventListener("click", handleClickSpellPrediction);
    });

    Array.from(wordPredictions).forEach((prediction) => {
        prediction.addEventListener("click", handleClickWordPrediction);
    });

    // ...

}

  
    init('index_bg.wasm').then(function(){
            fetch("/train_data.yaml").then(function(data){
                    data.blob().then(function(yamldata){
                    yamldata.text().then(val => {
                        initialize_chain(val)
                      
                      
                         
                        })
                    })
                }) 

    });

  
      
 