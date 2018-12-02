var elt = document.getElementById('calculator');
var calculator = Desmos.GraphingCalculator(elt, {
  zoomButtons: true,
  settingsButton: true,
  expressionsCollapsed: true
});

let inputExpression = document.querySelector('#input-expression');
let valueOfX = document.querySelector('#value-of-x');
let submitButton = document.querySelector('#submit');
let iterationSlider = document.querySelector('#iteration');
let cValue = document.querySelector('.computed-value');
let eValue = document.querySelector('.estimated-value');
let iterationCaption = document.querySelector('#iteration-caption');
let beforeBreak = document.querySelector('.before-break');
let beforeBreakIteration;

document.body.addEventListener('keypress', function(e) {
  if (e.keyCode == 13) {
    submitButton.click();
  }
});

iterationSlider.addEventListener('change', function() {
  iterationCaption.textContent = iterationSlider.value;
});

inputExpression.addEventListener('keydown', function() {
  cValue.textContent = '';
  eValue.textContent = '';
  beforeBreak.textContent = '';
});

submitButton.addEventListener('click', function(e) {
  let expression = inputExpression.value;
  let expressionGraph = '\\' + inputExpression.value;
  let computationalValue;
  let estimatedValue;
  let x = parseInt(valueOfX.value);

  cValue.textContent = '';
  eValue.textContent = '';
  beforeBreak.textContent = '';
  beforeBreakIteration = undefined;

  if (expression.search('sin') != -1) {
    // // console.log('sin');
    if (
      expression.charAt(3) == '(' &&
      expression.charAt(expression.length - 1) == ')'
    ) {
      expression = expression.substring(4, expression.length - 1);
    }
    estimatedValue = estimateSin(eval(expression), iterationSlider.value);
    computationalValue = Math.sin(eval(expression));
    // if (
    //   expression.charAt(3) == '(' &&
    //   expression.charAt(expression.length - 1) == ')'
    // ) {
    //   estimatedValue = estimateSin(
    //     expression.substring(4, expression.length - 1),
    //     iterationSlider.value
    //   );
    //   computationalValue = Math.sin(
    //     expression.substring(4, expression.length - 1)
    //   );
    // } else {
    //   estimatedValue = estimateSin(
    //     expression.substring(3, expression.length),
    //     iterationSlider.value
    //   );
    //   computationalValue = Math.sin(expression.substring(3, expression.length));
    // }
  } else if (expression.search('cos') != -1) {
    console.log('cos');
    if (
      expression.charAt(3) == '(' &&
      expression.charAt(expression.length - 1) == ')'
    ) {
      expression = expression.substring(4, expression.length - 1);
    }
    estimatedValue = estimateCos(eval(expression), iterationSlider.value);
    computationalValue = Math.cos(eval(expression));
    // if (
    //   expression.charAt(3) == '(' &&
    //   expression.charAt(expression.length - 1) == ')'
    // ) {
    //   estimatedValue = estimateCos(
    //     expression.substring(4, expression.length - 1),
    //     iterationSlider.value
    //   );
    //   computationalValue = Math.cos(
    //     expression.substring(4, expression.length - 1)
    //   );
    // } else {
    //   estimatedValue = estimateCos(
    //     expression.substring(3, expression.length),
    //     iterationSlider.value
    //   );
    //   computationalValue = Math.cos(expression.substring(3, expression.length));
    // }
  } else if (expression.charAt(0) == 'e' && expression.charAt(1) == '^') {
    // console.log('e');

    if (
      expression.charAt(2) == '(' &&
      expression.charAt(expression.length - 1) == ')'
    ) {
      expression = expression.substring(3, expression.length - 1);
    }
    // console.log(expression);
    estimatedValue = estimateExponential(
      eval(expression),
      iterationSlider.value
    );
    computationalValue = Math.exp(eval(expression));
    expressionGraph = expressionGraph.replace('(', '{');
    expressionGraph = expressionGraph.replace(')', '}');
    // estimatedValue = estimateExponential(
    //   expression.substring(2, expression.length),
    //   iterationSlider.value
    // );
    // computationalValue = Math.exp(expression.substring(2, expression.length));
  } else if (expression.search('ln') != -1) {
    // console.log('ln');
    // console.log(expression.length);
    if (
      expression.charAt(2) == '(' &&
      expression.charAt(expression.length - 1) == ')'
    ) {
      expression = expression.substring(3, expression.length - 1);
    }
    // console.log(expression.length);
    // console.log(expression);
    estimatedValue = estimateLn(eval(expression), iterationSlider.value);
    computationalValue = Math.log(eval(expression)) / Math.log(2.71828);

    // if (
    //   expression.charAt(2) == '(' &&
    //   expression.charAt(expression.length - 1) == ')'
    // ) {
    //   estimatedValue = estimateLn(
    //     expression.substring(4, expression.length - 2),
    //     iterationSlider.value
    //   );
    //   computationalValue =
    //     Math.log(expression.substring(4, expression.length - 2)) /
    //     Math.log(2.71828);
    // } else {
    //   estimatedValue = estimateLn(
    //     expression.substring(3, expression.length - 1),
    //     iterationSlider.value
    //   );
    //   computationalValue =
    //     Math.log(expression.substring(3, expression.length - 1)) /
    //     Math.log(2.71828);
    // }
  }

  cValue.textContent = `The computed value is: ` + computationalValue;
  eValue.textContent = `The estimated value is: ` + estimatedValue;

  if (typeof beforeBreakIteration != 'undefined')
    beforeBreak.textContent =
      `The maximum iteration before NaN error is: ` + beforeBreakIteration;

  // if (isNaN(computationalValue)) {
  //   console.log('Expression not evaluable.');
  // }

  calculator.setExpression({
    id: 'graph1',
    latex: expressionGraph
  });

  e.preventDefault;
});

function estimateLn(x, iteration) {
  x -= 1;
  let value = 0;
  for (i = 1; i < iteration; i++) {
    let temp = Math.pow(-1, i - 1) * (Math.pow(x, i) / i);
    if (isNaN(temp)) {
      beforeBreakIteration = i;
      break;
    }
    value += temp;
  }
  return value;
}

function estimateExponential(x, iteration) {
  let value = 0;
  for (i = 0; i < iteration; i++) {
    let temp = Math.pow(x, i) / factorial(i);
    if (isNaN(temp)) {
      beforeBreakIteration = i;
      break;
    }
    value += temp;
  }
  return value;
}

function estimateSin(x, iteration) {
  let value = 0;
  for (i = 0; i < iteration; i++) {
    let temp =
      (Math.pow(-1, i) * Math.pow(x, 2 * i + 1)) / factorial(2 * i + 1);
    if (isNaN(temp)) {
      beforeBreakIteration = i;
      break;
    }
    value += temp;
  }
  return value;
}

function estimateCos(x, iteration) {
  let value = 0;
  for (i = 0; i < iteration; i++) {
    let temp = (Math.pow(-1, i) * Math.pow(x, 2 * i)) / factorial(2 * i);
    if (isNaN(temp)) {
      beforeBreakIteration = i;
      break;
    }
    value += temp;
  }
  return value;
}

const factorial = x => (x < 1 ? 1 : x * factorial(x - 1));

// $value = 0;
// $input = 3;
// $value = 0;

// for ($i = 0; $i<100; $i++) {
//     // $value += pow($input,$i) / factorial($i); // e^x
//     // $value += ( pow(-1,$i) * ( pow($input, ((2*$i)+1) )) ) / factorial( (2*$i)+1 ); // sinx
// }
// echo($value);

// function factorial($in) {
//     // 0! = 1! = 1
//     $out = 1;

//     // Only if $in is >= 2
//     for ($i = 2; $i <= $in; $i++) {
//         $out *= $i;
//     }

//     return $out;
// }
