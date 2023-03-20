🔨 Build your own
<> Install Node 16 version
<> Install Visual Studio Code
<> Clone the repo to the VSCode or your own IDE
<> After opening the project in VSCode
<> Open a terminal -> new terminal
 |- Install the Playwright using npx playwright install. This will install playwright.
 |- Install the dependencies using npm install. This will install all dependencies shown in package.json file.

📁Structure

>> playwright-report --> Results after running the scripts will be visible here
     > data: There is a zip file containing the traces of the report.
     > index.html: Report will be generated here. Copy path and paste in the browser. You can access traces, screenshots and videos from report.

>>> tests
    >> pageObjects --> Locators and method related to a page storing here. That means that for each page we would define a new Page object for our needs.
    >> specs --> All test cases are written in this folder. The files need to have .spec.js extension.
    >> testData --> Datas, credentials related to tests storing here.
        > base.json: Url should be provided in this file.

>>> important files to have:

 |- playwright.config.js --> All framework level configurations are defined here.Defined all browser types in this file.

 |- package.json --> Scripts can define here. Dependencies can be store in this file.


>>> relevant informations:

 🔨npx playwright test: It is the command that runs the files.🔨
