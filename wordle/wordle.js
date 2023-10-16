//INSERT THE TEST FILE 

const state = {
  secret: '',
  hint : '',
  grid: Array(4)
    .fill()
    .map(() => Array(4).fill('')),
  currentRow: 0,
  currentCol: 0,
};
const myButton = document.getElementById('start_over');

var guessword = {
  word: "",
  hint: "",}; 

  const list = async () => {

  const res = await fetch("https://api.masoudkf.com/v1/wordle", {
      headers: {
      "x-api-key": "sw0Tr2othT1AyTQtNDUE06LqMckbTiKWaVYhuirv",
      },
  });

  let json = await res.json();
  let {dictionary} = json;


  guessword = dictionary[Math.floor(Math.random() * dictionary.length)];
  guessword.word = guessword.word.toUpperCase();
  guessword.hint = guessword.hint;

  return guessword.word;
  }

list().then((data) => {
  state.secret = data;
  state.hint = guessword.hint;
  console.log(state.secret);
    console.log(state.hint);

});

//WHEN ICON IS PRESSED

//dark mode
// does not deselect the icon on its own

const button = document.getElementById('darkMode');
const body = document.body;
const tiles = document.getElementsByClassName('tiles');
const form = document.querySelector('body');
const footer = document.querySelector('.footer');
const hintDW = document.getElementById('hint');
const instructions = document.getElementById('instructions');

const header = document.getElementsByClassName('header');


button.addEventListener('click', () => {
  body.classList.toggle('dark');
  instructions.classList.toggle('dark');
  hintDW.classList.toggle('dark');
  button.classList.toggle('dark');
  header.color = 'white';
  
  Array.from(tiles).forEach((tile) => {
    tile.classList.toggle('dark');
  });
  footer.classList.toggle('dark');
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
});



//hint
const hintButton = document.getElementById('hint');

const hint = document.getElementById('hintText');
const textBox = document.createElement('div');

hintButton.addEventListener('click', () => {
    if (isOpen) {
        textBox.remove();
        isOpen = false;
    } else {
        hint.innerHTML = "<em>Hint:</em>&nbsp" + state.hint;
        textBox.classList.add('bottom');
        hint.classList.add('hintText');
        textBox.appendChild(hint);
        document.body.appendChild(textBox);
        isOpen = true;
    }
});

//instructions 

const instButton = document.getElementById('instructions');
const instTB = document.getElementById('instTB');
const instText = document.getElementById('instText');
let isOpen = false;

instButton.addEventListener('click', () => {
  if (isOpen) {
    instTB.classList.remove('show');
    isOpen = false;
  } else {
    instText.innerHTML = "<b>&nbsp;&nbsp;&nbsp;&nbsp;How to play</b><br><br>" +
      "<ul>" +
      "<li>Start typing. The letters will appear in the boxes</li>"+
      "<li>Remove letters with Backspace</li>"+
      "<li>Hit Enter/Return to submit an answer</li>"+
      "<li>Letters with green background are in the right spot</li>"+
      "<li>Letters with yellow background exist in the word, but are in the wrong spots</li>"+
      "<li>Letters with gray background do not exist in the word</li>"+
      "<li>If you need a hint, click the ? icon</li>"+
      "</ul>";

    instTB.classList.add('show');
    isOpen = true;
  }
});

var length =4;

var row = 0;
var column = 0;

var gameOver = false;

window.onload = function() {
    placement();

}

function placement() {

    //<span id=0-0 class="tiles"> P </span>
    for (let r=0; r<length; r++) {
        for (let c=0; c<length; c++) {
            let tiles = document.createElement("span");
            tiles.id = r.toString() + "-" + c.toString();
            tiles.classList.add("tiles");
/**/        tiles.innerHTML = "";
            document.getElementById("table").appendChild(tiles);
        }
    }
    
//WHEN KEY PRESSED    
    document.addEventListener("keyup", (l) => { 
    if (gameOver) return;

        if ("KeyA" <= l.code && l.code <= "KeyZ") {
            if (column < 4){
                let preTile = document.getElementById(row.toString() + "-" + column.toString());
                if (preTile.innerText== "") {
                    preTile.innerText = l.code[3];
                    column += 1;
                }
            }
        }
        else if (l.code == "Backspace"){
            if (column > 0 && column <= 4){ 
                column -= 1;
            }
            let preTile = document.getElementById(row.toString() + "-" + column.toString());
            preTile.innerText = "";
        }
        
        else if (l.code == "Enter"){
            if (column==4){
                update();
                row += 1;
                column = 0;
            }
            else if (column < 4){
                alert('Word must be 4 letters')
            }}
            
            /*the game over part*/
/**/        
    })
}

function update() { /* Have to UPLOAD THE TEST FILE*/
/**/    
    let numCorrect = 0;

    // to prevent repetition of letters // not working
    let letterCount = {};

    for (let i = 0; i < state.secret.length; i++) {
        let letter = state.secret[i];

        if (letterCount[letter]) {
           letterCount[letter] += 1;
        } 
        else {
           letterCount[letter] = 1;
        }
    }

    console.log(letterCount); 
/**/    
    
    for (c=0; c<length; c++) {
        let preTile = document.getElementById(row.toString() + "-" + c.toString());
        let letter = preTile.innerText;

        
        if (state.secret[c] == letter) {
            preTile.classList.add("correct");
            numCorrect += 1;
        }
        else if ( state.secret.includes(letter) ) {
            preTile.classList.add("present");
        }
        else {
            preTile.classList.add("not_present");
        }

        if(numCorrect == length) {
            gameOver = true;
    
            const winnerPC = document.getElementById("winnerPC");
            const winContainer = document.createElement("win");
            winContainer.classList.add("winner");
            
            const winMessage = document.createElement("win");
            winMessage.innerHTML = "You guessed the word &nbsp <b> "+ state.secret + " </b>&nbsp correctly !";
            
            winContainer.appendChild(winMessage);
            winnerPC.appendChild(winContainer);
            
            //CONGRATULATIONS
            
            document.getElementById("table").remove();
            const winnerGif = document.getElementById('img');
            winnerGif.style.display = 'block';


        }
        else if (row >= 3 && column == 4 && numCorrect != length) {
            gameOver = true;
            document.getElementById("table").remove();
            const looserGif = document.getElementById('img2');
            looserGif.style.display = 'block';


            const looser = document.getElementById('looserPC');
            looser.style.display = 'flex';
            
            document.getElementById("looserPC").innerHTML = "You could not guess the word &nbsp <b>" +  state.secret + " </b> &nbsp.";

          }

    }
}


