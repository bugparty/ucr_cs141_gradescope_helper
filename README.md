# UCR CS141 Gradescope Helper

This tool streamlines the grading process by integrating Codeforces submission data into the Gradescope grading page for UCR CS141. It verifies students' submissions, checks if they completed the correct problems, and retrieves their scores automatically.

## Features

- **Automatic Verification**: Confirms if a student submitted the correct problem for grading.
- **Score Retrieval**: Fetches and displays each student's score from Codeforces.
- **Quick Integration**: Easily integrates with the Gradescope grading page for real-time grading insights.

## Prerequisites

- **Admin Access**: You must be an admin for the relevant Codeforces contest.
- **API Key**: Obtain an API key and secret from Codeforces at [Codeforces API Settings](https://codeforces.com/settings/api).
- **Script Installation**: Install the script from [Greasyfork](https://greasyfork.org/zh-CN/scripts/512425-ucr-cs141-grader-helper-script).

## Installation

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install Dependencies**:
   Execute the following command to install required packages:
   ```bash
   npm install
   ```

3. **API Key Configuration**:
   - Create a `.env` file in the root directory of this repository.
   - Add your Codeforces API credentials to the `.env` file:
     ```env
     apiKey='YOUR_API_KEY'
     apiSecret='YOUR_API_SECRET'
     ```

4. **Script Setup**:
   - Update the `apikey` and `apisecret` fields in the `userscript.js` file with your Codeforces API credentials.
   - Install the script on your browser via the provided Greasyfork link.

## Usage

### Gradescope Integration
1. Open the grading page on Gradescope.
2. Click the **Fetch Info from Codeforces** button that appears on the page.
3. The script will automatically:
   - Retrieve all students' submissions.
   - Validate if each submission corresponds to the correct problem.
   - Display each student's score.

### Command Line Utility

You can use the command line tool to retrieve specific submission data. 

#### Commands:

- **Query by Contest ID and Submission ID**:
  ```bash
  node main.js query <contestId> <submissionId>
  ```
  **Example**:
  ```bash
  node main.js query 552084 285747506
  ```

  **Sample Output**:
  ```
  Contest ID: 552084
  Submission ID: 285747506
  OK
  contestId:552084, name:Number Candles, author:caitlinjian, point: 0.5, fullCredit:OK
  ```

- **Query by Contest ID and Author Handle**:
  ```bash
  node main.js qa <contestId> <author_handle>
  ```
  **Example**:
  ```bash
  node main.js qa 552084 aloftballoon
  ```

  **Sample Output**:
  ```
  Contest ID: 552084
  handle ID: aloftballoon
  OK
  contestId:552084, name:Merge Them!, author:aloftballoon, point: 2, fullCredit:OK
  contestId:552084, name:Shopping at Diagon Alley, author:aloftballoon, point: 2, fullCredit:OK
  contestId:552084, name:Time Turner, author:aloftballoon, point: 0.3, fullCredit:PARTIAL
  contestId:552084, name:Number Candles, author:aloftballoon, point: 0.5, fullCredit:OK
  ```

## Expected Output

When the commands are executed, you will receive detailed responses indicating:
- Contest and submission details.
- Scores awarded to the student for each problem.
- Status of credit (full or partial).

## Troubleshooting

- **Invalid API Key or Secret**: Double-check your API key and secret in the `.env` file and `userscript.js`.
- **Permission Errors**: Ensure you have admin access for the Codeforces contest.
- **Network Issues**: If the script fails to fetch data, verify your internet connection and try again.

## License

This project is licensed under the MIT License.

