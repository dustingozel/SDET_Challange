// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  /* Maximum time one test can run for. */
  timeout: 30 * 1000,

  expect: {
    timeout: 5000,
  },
  
  reporter: 'html',
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chrome',
      use: {
        browserName: 'chromium',
        headless: true,
        screenshot: 'on',
        trace: 'on', // 'retain-on-fail'//off
        video: 'off', //  this will capture video if the test fails. Other options: 'on', 'retain-on-failure', 'on-first-retry'
        // viewPort : {width: 1510, height: 1050}, //this sets up the browser size
        // ...devices ['Galaxy S8 landscape'] //you can choose the mobile phone other than apple here to run your test in that phone's screen size
      },
    },
    // {
    //   name: 'firefox',
    //   use: {
    //     browserName: 'firefox',
    //     headless: true,
    //     screenshot: 'on',
    //     trace: 'on', // 'retain-on-fail'//off,on
    //   },
    // },
    // {
    //   name: 'safari',
    //   use: {
    //     browserName: 'webkit',
    //     headless: true,
    //     screenshot: 'on',
    //     trace: 'on', // 'retain-on-fail'//off,on
    //     // ...devices ['iPhone 13'] //you can choose the mobile phone other than apple here to run your test in that phone's screen size
    //   },
    // },
    // {
    //   name: 'edge',
    //   use: {
    //     channel: 'msedge',
    //     headless: true,
    //     screenshot: 'on',
    //     trace: 'on', // 'retain-on-fail'//off,on
    //     // ...devices ['iPhone 13'] //you can choose the mobile phone other than apple here to run your test in that phone's screen size
    //   },
    // }
  ],
});