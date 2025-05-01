let input = document.getElementById('inputBox');
let btns = document.querySelectorAll('button');

let string = "";
let isResult = false;

const operators = ['+', '-', '*', '/', '%'];

function updateDisplay(value) {
    const lastChar = string[string.length - 1];

    if (value === '=') {
        try {
            let result=eval(string);
            if(!Number.isInteger(result)){
                result=parseFloat(result.toFixed(15));
            }
            string = result.toString();
            input.value = string;
            isResult = true;
        } catch {
            input.value = "Error";
            string = "";
            isResult = false;
        }
    } else if (value === 'AC') {
        string = "";
        input.value = string;
        isResult = false;
    } else if (value === 'DEL') {
        string = string.slice(0, -1);
        input.value = string;
    }
    else if(value === '%'){
        if(string !== ""){
            let match=string.match(/(\d+\.?\d*)$/);
            if(match){
                let number=match[0];
                let percentValue=(parseFloat(number)/100);
                if(isResult){
                    string=percentValue.toString();
                    input.value=string;
                }else{
                    let prevExpr=string.slice(0,-number.length);
                    let opMatch=prevExpr.match(/([\d\.]+)([+\-])$/);
                    if(opMatch){
                        let base=parseFloat(opMatch[1]);
                        percentValue=base*percentValue;
                    }
                    string=prevExpr+percentValue;
                    input.value=string;
                }
                isResult=false;
            }
        }
    }
    
    else {
        if (isResult && (!isNaN(value) || value === '.')) {
            // Start new calculation after result shown
            string = "";
            isResult = false;
        }
        let lastnumber=string.split(/[\+\-\*\/\%]/).pop();
        if(string === "" ){
            if(value === "0" || value === "00"){
                string = "0";
            }else if(value === "."){
                string = "0.";
            }else if(!isNaN(value)){
                string=value;
            }
            input.value=string;
            input.scrollLeft=input.scrollWidth;
            return ;
        }
        if((lastnumber === "0" || lastnumber === "0." ) && value === "."){
            if(!lastnumber.includes(".")){
                string+=".";
                input.value=string;
                input.scrollLeft=input.scrollWidth;
            }
            return;
        }
        if(value === '.'){
            if(lastnumber.includes('.')){
                input.value=string;
                input.scrollLeft=input.scrollWidth;
                return;
            }
        }
        if(lastnumber === "0" && (value === "0" || value === "00")){
            input.value=string;
            input.scrollLeft=input.scrollWidth;
            return;
        }
        
        if (operators.includes(value)) {
            if(value === '-' && (lastChar === '*' || lastChar === '/')){
                string+=value;
            }else if (operators.includes(lastChar)) {
                // Replace last operator with new one
                string = string.slice(0, -1) + value;
            } else if (string !== "") {
                string += value;
            } else if (value === '-') {
                // Allow negative number at the beginning
                string += value;
            }
        } else {
            if(string === "0" && (value !== "." && isNaN(lastChar))){
                string=value;
            }else if(string === "0" && isNaN(value)){
                string=value;
            }
            else{
                string += value;
            }
        }

        input.value = string;
        input.scrollLeft=input.scrollWidth;
        isResult = false;
    }
}

// ✅ Handling button clicks
btns.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const value = e.target.innerHTML.trim();
        updateDisplay(value);
    });
});

// ✅ Handling keyboard input
document.addEventListener('keydown', (e) => {
    let key = e.key;

    if (key === 'Enter') {
        e.preventDefault();
        updateDisplay('=');
    } else if (key === 'Backspace') {
        updateDisplay('DEL');
    } else if (key === 'Escape') {
        updateDisplay('AC');
    } else if (!isNaN(key) || key === '.' || operators.includes(key)) {
        e.preventDefault();
        updateDisplay(key);
    }
});
