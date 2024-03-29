/**
 * Extending login and other general functionality to puppeteer Page class
 */
//Dependencies
const puppeteer=require('puppeteer');
const sessionFactory=require('../factories/sessionFactory');
const userFactory=require('../factories/userFactory');

class CustomPage {
    static async build(){
        const browser=await puppeteer.launch({
            headless:false,
            args:['--no-sandbox']
        });
        
        const page=await browser.newPage();

        const customPage= new CustomPage(page);

        return new Proxy(customPage, {
            get:function(target, property){
                return customPage[property]||browser[property]||page[property];
            }
        })

    }


    constructor(page){
        this.page=page;
    }


    async login(){
        const user=await userFactory.createUser();
        const {session, sig}= sessionFactory.createSession(user);

        await this.page.setCookie({name:'session', value:session});
        await this.page.setCookie({name:'session.sig', value:sig});
    

        //Refrthis.esh page to reflect changes
        await this.page.goto('http://localhost:3000/blogs');

        await this.page.waitFor('a[href="/auth/logout"]');

    }

    async getContent(selector){
        return this.page.$eval(selector, el=>el.innerHTML);
    }
}

module.exports=CustomPage;  