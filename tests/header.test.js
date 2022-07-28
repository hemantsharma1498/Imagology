/*
 *Dependencies
 */
const puppeteer=require('puppeteer');
const Buffer=require('safe-buffer').Buffer;
const Keygrip=require('keygrip');
const keys=require('../config/keys');


//Global vars required for tests
let browser, page;

//Open a browser window and page before runing tests
beforeEach(async ()=>{
    browser=await puppeteer.launch({
        headless:false
    });

    page=await browser.newPage();

    await page.goto('localhost:3000');

});

//Close the browser window after each test
afterEach(async ()=>{
    await browser.close();
});


//Blogster should appear on the header
test('Header has correct text', async()=>{

    
    const headerText=await page.$eval('a.left.brand-logo', el=>el.innerHTML);

    expect(headerText).toEqual('Blogster');

});

//Sign in with Google should redirect to Google's sign in page
test('Correct Sign-In redirect', async()=>{

    await page.click('.right a');

    let url= await page.url();

    expect(url).toMatch(/accounts\.google\.com/);


});

//Create a pseudo session by faking cookies
test('Test session with fake cookies should show logout button', async()=>{
    //Blog user Id pulled from MongoDB
    const id='62d6af36dbe42e23a0df561a';

    const sessionObject={
        passport:{
            user: id
        }
    }

    const sessionString=Buffer.from(JSON.stringify(sessionObject)).toString('base64');

    const keygrip=new Keygrip([keys.cookieKey]);

    const sig=keygrip.sign('session='+sessionString);

    await page.setCookie({name:'session', value:sessionString});
    await page.setCookie({name:'session.sig', value:sig});


    //Refresh page to reflect changes
    await page.reload();

    //Check if logout button exists
    let logoutText= await page.$eval('a[href="/auth/logout"]', el=>el.innerHTML);
    expect(logoutText).toMatch('Logout')
});

