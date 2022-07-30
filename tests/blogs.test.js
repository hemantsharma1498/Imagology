/**
 * Tester for blogs page
 */
//Dependencies
const Page=require('./helpers/page');

let page;


beforeEach(async()=>{
    page=await Page.build();
    await page.goto('localhost:3000');

});

afterEach(async()=>{
    await page.close();
});


describe('When logged in', async()=>{
    beforeEach(async()=>{
        await page.login();
        await page.click('.btn-floating.btn-large.red');    
    });

    test('can see blog form', async()=>{
    
        const label=await page.getContent('form label');
    
        expect(label).toEqual('Blog Title')
    });

    describe('when input is invalid', async()=>{
        
        beforeEach(async()=>{
            await page.click('form button');
        });
        
        test('error message appears on screen', async()=>{

            let titleError=await page.getContent('.title .red-text');
            let contentError=await page.getContent('.content .red-text');

           
            expect(titleError).toEqual('You must provide a value');
            expect(contentError).toEqual('You must provide a value');

        });
    });

});