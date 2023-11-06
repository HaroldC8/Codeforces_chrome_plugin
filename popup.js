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

const container = document.getElementById('container');
const generate = document.getElementById('generateButton');
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
    loader.style.visibility = 'visible';
    problemDiv.style.visibility = 'hidden';
    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        loader.style.visibility = 'hidden';
        var problems = data.result.problems;
        var problem = problems[Math.floor(Math.random()*problems.length)];
        problemDiv.style.backgroundColor = "#efefef";

        if(daily) {
            var seed = hfs.cyrb128(dateToString());
            var rand = hfs.sfc32(seed[0], seed[1], seed[2], seed[3]);

            problem = problems[Math.floor(rand()*problems.length)];
            problemDiv.style.backgroundColor = "#ddf0dd";
        }
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