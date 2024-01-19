import * as hfs from "./hash-functions.js";

const tags = [
    '2-sat',
    'binary search',
    'bitmasks',
    'brute force',
    'combinatorics',
    'constructive algorithms',
    'data structures',
    'dfs and similar',
    'divide and conquer',
    'dp',
    'dsu',
    'expression parsing',
    'fft',
    'flow',
    'games',
    'geometry',
    'graph matchings',
    'graphs',
    'greedy',
    'hashing',
    'implementation',
    'interactive',
    'math',
    'matrices',
    'number theory',
    'probabilities',
    'schedules',
    'shortest paths',
    'sortings',
    'strings',
    'ternary search',
    'trees',
    'two pointers'
];

//const tryCount = 1000;
const container = document.getElementById('container');
const generate = document.getElementById('generateButton');
const generateTags = document.getElementById('generateTags');
const selectedTags = document.getElementById('selectedTags');
const problemDiv = document.getElementsByClassName('problem')[0];
const problemId = document.getElementsByClassName('problemId')[0];
const problemName = document.getElementsByClassName('problemName')[0];
const problemRating = document.getElementsByClassName('problemRating')[0];
const loader = document.getElementById('loading');
const errorMessage = document.getElementById('error');
let problemTags = [];

for (let i = 0; i < tags.length; i++){
  var opt = document.createElement('option');
  opt.value = tags[i];
  opt.innerHTML = tags[i];
  generateTags.appendChild(opt);
}

const apiUrl = "https://codeforces.com/api/problemset.problems";
const problemsUrl = "https://codeforces.com/problemset/problem/"

generate.addEventListener('click', () => {
    fetchUrl(false);
});

generateTags.addEventListener('change', () => {
  if(problemTags.includes(generateTags.value)) {
    return;
  }
  problemTags.push(generateTags.value);
  let t_tag = document.createElement('div');
  t_tag.innerHTML = generateTags.value;
  selectedTags.appendChild(t_tag);
});

window.onload = fetchUrl;

function fetchUrl(daily = true) {
    loader.style.visibility = 'visible';
    problemDiv.style.visibility = 'hidden';
    errorMessage.innerHTML = '';
    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        var allProblems = data.result.problems;
        var problem = undefined;

        if(daily) {
            var seed = hfs.cyrb128(dateToString());
            var rand = hfs.sfc32(seed[0], seed[1], seed[2], seed[3]);

            problem = allProblems[Math.floor(rand()*allProblems.length)];
            problemDiv.style.backgroundImage = "url(./assets/timer-bg.png)";
        }
        else {
            let goodProblems = [];
            allProblems.forEach(element => {
              if(element.rating >= slider1 && element.rating <= slider2 && problemTags.every(item => element.tags.includes(item))) {
                goodProblems.push(element)
              }
            });
            console.log(goodProblems);
            problem = goodProblems[Math.floor(Math.random()*goodProblems.length)];
            problemDiv.style.backgroundImage = "url(./assets/random-bg.png)";
        }

        if(problem !== undefined) {
            loader.style.visibility = 'hidden';
            problemDiv.href = problemsUrl + problem.contestId + "/" + problem.index;
            problemId.innerHTML = problem.contestId + problem.index;
            problemName.innerHTML = problem.name;
            if(problem.rating === undefined) {
                problemRating.innerHTML = '-';
            }
            else {
                problemRating.innerHTML = problem.rating;
            }
            problemDiv.style.visibility = 'visible';
        }
        else {
            errorMessage.innerHTML = 'No problems found';
            loader.style.visibility = 'hidden';
        }
        document.body.style.height = container.style.height;
    })
    .catch(error => {
        errorMessage.innerHTML = error;
        loader.style.visibility = 'hidden';
        console.log("Something went wrong:", error);
    })
}

function dateToString() {
    let dateObj = new Date();
    let month = dateObj.getUTCMonth() + 1;
    let day = dateObj.getUTCDate();
    let year = dateObj.getUTCFullYear();
    return (year + "/" + month + "/" + day);
}

function controlFromSlider(fromSlider, toSlider) {
  const [from, to] = getParsed(fromSlider, toSlider);
  if (from > to) {
    fromSlider.value = to;
    slider1 = to;
  } else {
    slider1 = from;
  }
  sliders_values.innerHTML = "Rating range: " + slider1 + "-" + slider2;
}

function controlToSlider(fromSlider, toSlider) {
  const [from, to] = getParsed(fromSlider, toSlider);
  setToggleAccessible(toSlider);
  if (from <= to) {
    toSlider.value = to;
    slider2 = to;
  } else {
    toSlider.value = from;
    slider2 = from;
  }
  sliders_values.innerHTML = "Rating range: " + slider1 + "-" + slider2;
}

function getParsed(currentFrom, currentTo) {
  const from = parseInt(currentFrom.value, 10);
  const to = parseInt(currentTo.value, 10);
  return [from, to];
}

function setToggleAccessible(currentTarget) {
  const toSlider = document.querySelector('#toSlider');
  if (Number(currentTarget.value) <= 0 ) {
    toSlider.style.zIndex = 2;
  } else {
    toSlider.style.zIndex = 0;
  }
}

const fromSlider = document.querySelector('#fromSlider');
const toSlider = document.querySelector('#toSlider');
const sliders_values = document.querySelector('#sliders_values');
let slider1 = 800, slider2 = 3500;
setToggleAccessible(toSlider);

fromSlider.oninput = () => controlFromSlider(fromSlider, toSlider);
toSlider.oninput = () => controlToSlider(fromSlider, toSlider);