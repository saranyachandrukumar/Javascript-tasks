const puppeteer = require('puppeteer');
const fs = require('fs')

try {
(async() => {
const browser = await puppeteer.launch({headless:false});
const page = await browser.newPage();

await page.goto('https://www.nseindia.com/get-quotes/equity?symbol=SBIN' , {waitUntil:'load'});
await page.waitForTimeout(1500);



const details = await page.$eval('#securityInfo > thead > tr', x => x.innerText);
const info = await page.$eval('#securityInfo > tbody > tr', x => x.innerText);

console.log(details,info);
await browser.close();
fs.writeFile("Security.txt",JSON.stringify(details,info,'',2),(err) => {
    if(err){console.log(err)}
    else{console.log('Saved Successfully!')}    
});
})()
}
catch(e)
{
    console.log("Error",e);
}