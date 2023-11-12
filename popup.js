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

const tryCount = 1000;
const container = document.getElementById('container');
const generate = document.getElementById('generateButton');
const generateTags = document.getElementById('generateTags');
const problemDiv = document.getElementsByClassName('problem')[0];
const problemId = document.getElementsByClassName('problemId')[0];
const problemName = document.getElementsByClassName('problemName')[0];
const problemRating = document.getElementsByClassName('problemRating')[0];
const loader = document.getElementById('loading');
//const problemTags = document.getElementById('problemTags');

const apiUrl = "https://codeforces.com/api/problemset.problems";
const problemsUrl = "https://codeforces.com/problemset/problem/"

generate.addEventListener('click', () => {
    fetchUrl(false);
});

window.onload = fetchUrl;

function fetchUrl(daily = true) {
    if(daily) {
      for (let i = 0; i < tags.length; i++){
        var opt = document.createElement('option');
        opt.value = tags[i];
        opt.innerHTML = tags[i];
        generateTags.appendChild(opt);
      }
    }
    loader.style.visibility = 'visible';
    problemDiv.style.visibility = 'hidden';
    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        var problems = data.result.problems;
        var problem = undefined;

        if(daily) {
            var seed = hfs.cyrb128(dateToString());
            var rand = hfs.sfc32(seed[0], seed[1], seed[2], seed[3]);

            problem = problems[Math.floor(rand()*problems.length)];
            problemDiv.style.backgroundImage = "url(./assets/timer-bg.png)";
        }
        else {
            let cur = tryCount;
            var curProblem = undefined;
            while(cur > 0) {
                curProblem = problems[Math.floor(Math.random()*problems.length)];
                if(curProblem.rating >= slider1 && curProblem.rating <= slider2) {
                    problem = curProblem;
                    break;
                }
                cur--;
            }
            problemDiv.style.backgroundImage = "url(./assets/random-bg.png)";
        }
        loader.style.visibility = 'hidden';
        if(problem !== undefined) {
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
        document.body.style.height = container.style.height;
    })
    .catch(error => {
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