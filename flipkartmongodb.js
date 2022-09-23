var Mongoclient = require('mongodb').MongoClient;
const puppeteer = require('puppeteer');
let details=[];

try{
async function data() {
    

       const browser = await puppeteer.launch({headless:false})
       const page = await browser.newPage()
       await page.goto('https://www.flipkart.com/', {waitUntil:'load'});
  
       await page.waitForTimeout(10000);  
       await page.click("._2KpZ6l._2doB4z");
       await page.waitForTimeout(10000);
       await page.focus('._3704LK');
       await page.keyboard.type('shoes');
       await page.click('.L0Z3Pu');
       await page.waitForTimeout(10000);
     
      const productname = await page.$x('(//*[@class="IRpwTa"])');
      const price = await page.$x('(//*[@class="_30jeq3"])');
   for(i=0;i<productname.length;i++) {
   try{
    details.push({
           
      productname:await page.evaluate(el => el.textContent,productname[i]),
      price:await page.evaluate(el => el.textContent,price[i]),
           
       
  }) 

}
catch(e)
{
    console.log("link err");
}
  }
           console.log(details)
           await browser.close();
           const url = 'mongodb://localhost:27017';
           Mongoclient.connect(url,function(err,db) {
           if(err) console.log("Error",err)
           const mydb = db.db('Flipkart');
           mydb.collection('Flip').insertMany(details,function (err,res) {
               if(err) console.log("Error",err);
               console.log("Document Inserted");
               db.close();
             });
           })
  }
      data();
 }
           


 catch(e)
  {
          console.log("Error",e);
  
  }
  