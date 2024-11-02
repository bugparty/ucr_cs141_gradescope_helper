# ucr cs141 gradescope helper

when you opened the grading page on gradescope, it will shows a button says fetch info from codeforces,

after clicked that, the program will fetch all students submissions and validate if the student submitted the right problem and how many scores they got.

in order to use this script, you must be a admin of the codeforce contest, and apply a api key in https://codeforces.com/settings/api, and then replace the apikey and apisecret in the script in order to work

you can install this script here: https://greasyfork.org/zh-CN/scripts/512425-ucr-cs141-grader-helper-script

the command line utility usage:
execute
```
npm i
```

create a .env file in root directory of this repo.
input the following into the .env file

```
apiKey='xxx'
apiSecret='xxx'
```

query by contestId and submissionId:

```
node main.js query  552084  285747506
```
query by contestId and author(handle):

```
node main.js qa 552084  zazavirtuoso 
```