const puppeteer = require('puppeteer');
const fs = require('fs');
const { scrollPageToBottom } = require('puppeteer-autoscroll-down');

try{
    async function CarrefourUAE() {
        const browser = await puppeteer.launch({headless:false});
        const page = await browser.newPage();
        await page.goto("https://www.carrefouruae.com/mafuae/en/", {waitUntil:'load'});
        await page.waitForTimeout(10000);
        const arr1 = [];
        
        // Read the file contents 
        const keyword = fs.readFileSync("./carrefourkeywords.csv",'utf-8');
        const keywords = keyword.split(',\r\n');
        console.log(keywords);

        //Reading Xpath from file
        const xpath = fs.readFileSync("./xpathcarrefour.csv",'utf-8');
        const xpaths = xpath.split(',\r\n');
        console.log(xpaths);

        for(let i=0;i<keywords.length;i++) {
            const arr = [];
            const searchBar = await page.$x(xpaths[0]);
            await searchBar[0].type(keywords[i],{delay:100})
            await page.keyboard.press('Enter');
            await page.waitForTimeout(15000);
            await scrollPageToBottom(page);
            await page.waitForTimeout(15000);

            const productName =  await page.$x(xpaths[1]);
            const productPrice = await page.$x(xpaths[2]);
            const productSize = await page.$x(xpaths[3]);
            const productURL = await page.$x(xpaths[4]);


            for(let j=0;j<productName.length;j++) {
                try{
                arr.push({
                    ProductName : await page.evaluate(el=>el.textContent,productName[j]),
                    ProductPrice : await page.evaluate(el=>el.textContent,productPrice[j]),
                    ProductSize : await page.evaluate(el=>el.textContent,productSize[j]),
                    ProductURL : await page.evaluate(el=>el.textContent,productURL[j]),
                    });
                }
                catch(e) {
                       console.log("Error",e);
 
                }
            }
            await ClearSearch(page);
            arr1.push(arr);
            
        }
       
        console.log(arr1,arr1.length);
        await browser.close();
        fs.writeFile("carrefourdetails.csv",JSON.stringify(arr1,'',2),(err) => {
            if(err){console.log(err)}
            else{console.log('Saved Successfully!')}
        });
        

    }
    //SearchBox Function Used to clear the SearchBox for next Input
    async function ClearSearch(page) {
        const searchBox = await page.$x('//*[@class="css-1jv2uvu"]//div[@class="css-1by272f"]//input[@class="css-12uq56f"]');
        await searchBox[0].focus();
        await page.keyboard.down('Control');
        await page.keyboard.press('A');
        await page.keyboard.up('Control')
        await page.keyboard.press('Backspace');
        await page.waitForTimeout(10000);
    }
    CarrefourUAE();
}
catch(e) {
    console.log("Error",e);
}