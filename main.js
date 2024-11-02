import crypto  from 'crypto';
import fetch from 'node-fetch';
// Import the commander module
import { Command } from 'commander';
import 'dotenv/config'
const program = new Command();

//console.log(process.env)
const apiKey = process.env.apiKey;
const apiSecret = process.env.apiSecret;
async function signCodeforcesUrl(apiKey, apiSecret, methodName, params) {
    // Generate a random 6-character string
    const rand = crypto.randomBytes(3).toString('hex');

    // Current time in UNIX timestamp format
    const currentTime = Math.floor(Date.now() / 1000);

    // Adding apiKey and time to params
    params.apiKey = apiKey;
    params.time = currentTime;

    // Sort the parameters lexicographically by keys and values
    const sortedParams = Object.keys(params).sort().reduce((acc, key) => {
        acc.push(`${key}=${params[key]}`);
        return acc;
    }, []).join('&');

    // Concatenating the string as per the documentation
    const stringToHash = `${rand}/${methodName}?${sortedParams}#${apiSecret}`;
    
    // Hashing the string using SHA-512
    const hash = crypto.createHash('sha512');
    hash.update(stringToHash);
    const hashHex = hash.digest('hex');

    // Forming the apiSig
    const apiSig = `${rand}${hashHex}`;

    // Creating the signed URL
    const signedUrl = `https://codeforces.com/api/${methodName}?${sortedParams}&apiSig=${apiSig}`;
    return signedUrl;
}

async function fetchData(url) {
    try {
        // Sending the HTTP request to the specified URL
        const response = await fetch(url);

        // Check if the response was successful
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parsing the JSON response into an object
        const data = await response.json();

        // Use the data object as needed
        console.log(data);
        return data;
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }
}

function isValidInteger(str) {
    const invalid_val = { valid: false, val: -1 };
    const regex = /^\s*\d+\s*$/;
    if (!regex.test(str)) {
        return invalid_val;
    }
    const num = Number(str);
    return { valid: true, val: num };
}
async function querySubmissionById(contest_id, submission_id) {
    const methodName = 'contest.status';
    const params = { contestId: contest_id, asManager: true };
    const url = await signCodeforcesUrl(apiKey, apiSecret, methodName, params);
    //console.log(url);
    return url;
}
async function querySubmissionByAuthor(contest_id, handle) {
    const methodName = 'contest.status';
    const params = { contestId: contest_id, asManager: true,handle: handle };
    const url = await signCodeforcesUrl(apiKey, apiSecret, methodName, params);
    //console.log(url);
    return url;
}
let contest_id = 0;
let submission_id = 0;
// Define the 'query' command
program
  .command('query <contest_id> <submission_id>')
  .description('Query a contest and submission ID')
  .action((contest_id_, submission_id_) => {
    contest_id = contest_id_;
    submission_id = submission_id_;
    console.log(`Contest ID: ${contest_id}`);
    console.log(`Submission ID: ${submission_id}`);
    querySubmissionById(contest_id, submission_id).then(async url => {
        // console.log(url);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
         // Parsing the JSON response into an object
        const data = await response.json();
        console.log(data.status);
        if (data.status !== "OK"){
            throw new Error(`API error! Status: ${data.status}`);
        }
        let result = data.result.filter(item => item.id == submission_id);
        if(result.length != 1){
            throw new Error(`API error! Invalid result length: ${result.length}`);
        }
        result =result[0];
        //console.log(result);
        console.log(`contestId:${result.contestId}, name:${result.problem.name}, author:${result.author.members[0].handle}, point: ${result.points}, fullCredit:${result.verdict}`);
    })
  });
  program
  .command('qa <contest_id> <handle>')
  .description('Query a contest and author(handle)')
  .action((contest_id_, handle) => {
    contest_id = contest_id_;
    console.log(`Contest ID: ${contest_id}`);
    console.log(`handle ID: ${handle}`);
    querySubmissionByAuthor(contest_id, handle).then(async url => {
        // console.log(url);
        const response = await fetch(url);
        if (!response.ok) {
            if(response.status == '400'){
                const data = await response.json();
                console.log(data);
                return;
            }else{
                console.log(response);
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

        }
         // Parsing the JSON response into an object
        const data = await response.json();
        console.log(data.status);
        if (data.status !== "OK"){
            //if user handle not found, status will be 400
            if(data.status == '400'){
                console.log(data);
            }else{
                throw new Error(`API error! Status: ${data.status}`);
            }
            
        }
        if(data.result.length < 1){
            throw new Error(`API error! Invalid result length: ${result.length}`);
        }
        //console.log(data);
        let problemsStat = {};
        for (let submission in data.result){
            submission = data.result[submission];
            if(!(submission.problem.name in problemsStat)){

                problemsStat[submission.problem.name]={
                    verdict: submission.verdict,
                    points: submission.points,
                    problemName: submission.problem.name,
                    author: submission.author.members[0].handle,
                    contestId: submission.contestId
                };
            }else{
                if (submission.points > problemsStat[submission.problem.name].points || 
                    (problemsStat[submission.problem.name].verdict != 'OK' && submission.verdict == 'OK')
                ){
                    problemsStat[submission.problem.name].verdict=submission.verdict;
                    problemsStat[submission.problem.name].points=submission.points;
                }
            }

        }

        for(let problem in problemsStat){
            problem = problemsStat[problem];
            console.log(`contestId:${problem.contestId}, name:${problem.problemName}, author:${problem.author}, point: ${problem.points}, fullCredit:${problem.verdict}`);
        }

    })
  });
// Parse the command line arguments
program.parse(process.argv);

// If no arguments were provided, display help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

