class Verb {
    constructor(spanish, english, yo, tu, el, nosotros, vosotros, ustedes) {
        this.spanish = spanish;
        this.english = english;
        this.yo = yo;
        this.tu = tu;
        this.el = el;
        this.nosotros = nosotros;
        this.vosotros = vosotros;
        this.ustedes = ustedes;
    }
}

function randint(max) {
    return Math.floor(Math.random() * max);
}

function stringtoobjects(str) {
    str = str.slice(str.indexOf("\n") + 1)
    console.log(str)
    //At this point, the first row is removed.
    let rows = str.split("\n")
    let output = []
    for (let row of rows) {
        let columns = row.split(",");
        let word = new Verb();
        word.spanish = columns[0];
        word.english = columns[1];
        word.yo = columns[2];
        word.tu = columns[3];
        word.el = columns[4];
        word.nosotros = columns[5];
        word.vosotros = columns[6];
        word.ustedes = columns[7];
        output.push(word);
    }
    output.pop();
    for (let word of output) {
        word.ustedes = word.ustedes.substring(0,word.ustedes.length - 1);
    }
    return output
}

document.addEventListener("DOMContentLoaded", function() {
    let words = []
    let currentWord;
    let currentConjugation;
    let target;
    let loaded = false;
    function newWord() {
        if (loaded) {
            currentWord = words[randint(words.length)];
            currentConjugation = Object.keys(currentWord)[randint(6) + 2]
            target = currentWord[currentConjugation];
            document.querySelector("#question").innerHTML = `${currentConjugation} ${currentWord.spanish}`;
        }
    }

    document.querySelector("#fileform").addEventListener("submit", function(event) {
        event.preventDefault();
        let reader = new FileReader();
        let bruh = document.querySelector("#fileinput").files[0];

        reader.onload = function(event) {
            let csv = event.target.result
            words = stringtoobjects(csv);
            loaded = true;
            newWord()
        }

        reader.readAsText(bruh, "UTF-8");

        
    })



    let answerBox = document.querySelector("#answerbox");
    answerBox.addEventListener("keyup", function(event) {
        if (loaded) {
            if (event.key != "Enter") {
                return;
            }
            let input = answerBox.value;
            if (input == "") {
                return;
            }        
            
            if (input === target) {
                answerBox.value = "";
                newWord();
            }
            else {
                let question = document.querySelector("#question");
                question.style.color = "red";
                setTimeout(function() {
                    question.style.color = "black";
                }, 1000)
            }
        }
    })

    let hintbutton = document.querySelector("#hintbutton")
    hintbutton.addEventListener("click", function() {
        if (loaded) {
            let hint = document.querySelector("#hint")
            
            if (hintbutton.innerHTML == "Show hint") {
                //set hint here
                hint.innerHTML = `<tr> <td>${currentWord.yo}</td> <td>${currentWord.nosotros}</td> </tr> <tr> <td>${currentWord.tu}</td> <td>${currentWord.vosotros}</td></tr> <tr> <td>${currentWord.el}</td> <td>${currentWord.ustedes}</td></tr>`
                hintbutton.innerHTML = "Hide hint";
                hint.hidden = false;
                document.querySelector("#hintbox").hidden = false;
            }
            else {
                hint.hidden = true;
                hintbutton.innerHTML = "Show hint";
                document.querySelector("#hintbox").hidden = true;
            }
        }
    })
})
