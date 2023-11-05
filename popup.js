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

const generate = document.getElementById('generateButton');
const url = document.getElementById('problemUrl');
const rating = document.getElementById('problemRating');
//const problemTags = document.getElementById('problemTags');

const apiUrl = "https://codeforces.com/api/problemset.problems";
const problemsUrl = "https://codeforces.com/problemset/problem/"

generate.addEventListener('click', () => {
    fetchUrl(false);
});

window.onload = fetchUrl;

function fetchUrl(daily = true) {
    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        var problems = data.result.problems;
        var problem = problems[Math.floor(Math.random()*problems.length)];

        if(daily) {

            var seed = hfs.cyrb128(dateToString());
            var rand = hfs.sfc32(seed[0], seed[1], seed[2], seed[3]);
            
            problem = problems[Math.floor(rand()*problems.length)];
        }
        url.innerHTML = problem.index + ". " + problem.name;
        url.href = problemsUrl + problem.contestId + "/" + problem.index;
        rating.innerHTML = "Rating: " + problem.rating;
        /*let alltags = "";
        for(let i = 0; i < problem.tags.length; i++) {
            alltags += problem.tags[i] + ", ";
        }
        problemTags.innerHTML = "Tags: " + alltags.slice(0, alltags.length-2);*/
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