/*
 *Dependencies
 */
const { session } = require('passport');
const puppeteer=require('puppeteer');
const Page=require('./helpers/page');

//Global vars required for tests
let page;

//Open a browser window and page before runing tests
beforeEach(async ()=>{
    page=await Page.build();
    await page.goto('localhost:3000');
});

//Close the browser window after each test
afterEach(async ()=>{
    await page.close();
});


//Blogster should appear on the header
test('Header has correct text', async()=>{

    
    const headerText=await page.getContent('a.left.brand-logo');

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
    
    await page.login();

    //Check if logout button exists
    let logoutText= await page.getContent('a[href="/auth/logout"]');
    expect(logoutText).toMatch('Logout')
});

