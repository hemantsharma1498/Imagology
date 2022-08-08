/**
 * Tester for blogs page
 */
//Dependencies
const Page=require('./helpers/page');

let page;


beforeEach(async()=>{
    page=await Page.build();
    await page.goto('http://localhost:3000');

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

    describe('when input is valid', async()=>{
        beforeEach(async()=>{
            await page.type('.title input', 'Test title');
            await page.type('.content input', 'Test content');

            await page.click('form button');
        });

        test('submitting takes user to review screen', async()=>{
            let confirmationText=await page.getContent('h5');

            expect(confirmationText).toEqual('Please confirm your entries');
        });

        test('submitting then saving adds blog to blogs page', async()=>{
            await page.click('button.green');
            await page.waitFor('.card');

            let title=await page.getContent('.card-title');
            let content=await page.getContent('p');

            expect(title).toEqual('Test title');
            expect(content).toEqual('Test content');
        });
    });



});


describe('when not logged in', async()=>{
    test('user cannot create posts', async()=>{

        let status=await page.evaluate(()=>{
        
            return fetch('/api/blogs', {
                method:'POST',
                credentials:'same-origin',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({title:'Test title', content:'Test content'})

            }).then(res=>res.json()); //fetch returns raw data, needs to be converted to valid JSON

        }
        
        );

        expect(status).toEqual({error: 'You must log in!'});
    });


    test('user cannot see existing posts', async()=>{
        
        let posts=await page.evaluate(()=>{
            
            return fetch('/api/blogs', {
                method: 'GET',
                credentials:'same-origin',
                headers:{
                    'Content-Type':'application/json'
                }
            }).then(res=>res.json());
        }
        
        );

        expect(posts).toEqual({error: 'You must log in!'});
    });
});