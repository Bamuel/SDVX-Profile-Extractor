# SDVX Profile Extractor

This project automates the extraction of profile data from the SDVX (Sound Voltex) game website using Cypress for end-to-end testing. The extracted data is saved as a JSON file and can be uploaded to a web server.

## Features

- **Automated Profile Data Extraction**: Extracts player information, stats, and play history from the SDVX profile page.
- **Image Handling**: Downloads and encodes images (e.g., profile card, skill level icons) as Base64.
- **JSON Export**: Saves the extracted data to a JSON file for further use.
- **GitHub Actions Integration**: Automates the process via a CI/CD pipeline, including running tests and uploading results to a web server.

## Prerequisites

- **Node.js**: Version 23 or higher.
- **Cypress**: Installed via `npm`.
- **Google Chrome**: Required for running Cypress tests.



## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>

2. Install dependencies:  
   `npm install`
3. Set up Cypress environment variables:  
   Add `COOKIE_M573SSID` to your local cypress.env.json file:
   ```json
   {
       "COOKIE_M573SSID": "<your_cookie_value>"
   }
   ```
   
## Usage
1. **Run Cypress Tests**:  
   Execute the tests to extract profile data:
   ```bash
   npx cypress run --spec cypress/e2e/sdvx.cy.js --browser chrome
   ```
2. **Extract Profile Data**:  
   The extracted data will be saved in the `cypress/fixtures/SDVXprofileData.json` file.

## How to Get the M573SSID Cookie from Your Browser

Follow these steps to retrieve the `M573SSID` cookie from your browser:

### 1. Open the SDVX Website
Navigate to the SDVX profile page:  
[https://p.eagate.573.jp/game/sdvx/vi/playdata/profile/index.html](https://p.eagate.573.jp/game/sdvx/vi/playdata/profile/index.html).

*Ensure you are logged in to your account.*

### 2. Open Developer Tools
- **Windows/Linux:** Press `F12` or `Ctrl+Shift+I`
- **Mac:** Press `Cmd+Option+I`

### 3. Go to the Application Tab
- In Developer Tools, click the **Application** tab.
- If not visible, click the `>>` icon to find it in the overflow menu.

### 4. Locate Cookies
- In the left sidebar under **Storage**, expand **Cookies**.
- Select the domain: `p.eagate.573.jp`.

### 5. Find the M573SSID Cookie
- Look for the `M573SSID` cookie in the list.
- Copy its **Value** field.

### 6. Use the Cookie Value
Replace `<your_cookie_value>` in your `cypress.env.json` file:
```json
{
  "COOKIE_M573SSID": "your_copied_cookie_value"
}
```