const webdriver = require('selenium-webdriver');
var chromedriver = require('chromedriver');

var chai = require("chai"),
chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var assert = chai.assert;

var By = webdriver.By,
    until = webdriver.until;

const LOGIN = "test@gmail.com";
const PASSWORD = "test123123";
const QUERY_SEARCH = "javascript";
const USER_CABINET_URL = "https://biblio.by/customer/account/";
const SUBMIT_SEARCH_BUTTON_LOCATOR = By.css('.select-sort-by > select');
const SORT_BY_YEAR_PUBLISHED = By.css('select > option:nth-child(4)');
const URL_AFTER_SORT = 'https://biblio.by/catalogsearch/result/index/?dir=desc&order=publ_year&q=javascript';
const CART_LOCATOR = By.className('top-link-cart');
const CART_URL = "https://biblio.by/checkout/cart/";
const BOOK1_NAME_LOCATOR = By.partialLinkText('JavaScript и jQuery');
const BOOK2_NAME_LOCATOR = By.partialLinkText('ES6');

function createDriver() {
  var driver = new webdriver.Builder()
        .forBrowser('chrome')
        .build();
        driver.manage().timeouts().implicitlyWait(5000);
  return driver;
}

function logIn(){
        return browser.findElement(By.css('li.last')).click()
         .then(() => {
        return browser.wait(until.elementLocated(By.name('login[username]')));
        }).then(() => {
                return browser.findElement(By.name('login[username]')).sendKeys(LOGIN);
        }).then(() => {
                return browser.findElement(By.name('login[password]')).sendKeys(PASSWORD);
        }).then(() => {
                 return browser.findElement(By.name('persistent_remember_me')).click();
        }).then(() => {   
                return browser.findElement(By.id('send2')).submit();
})}

function checkLogIn(){
        return assert.eventually.equal(browser.getCurrentUrl(), USER_CABINET_URL, 'Fail. Check login and password.');
}

function bookSearch(){
        return browser.wait(until.elementLocated(By.id('search')))        
         .then(() => {
        return browser.findElement(By.id('search')).sendKeys(QUERY_SEARCH)
        }).then(() => {
               return browser.findElement(By.css('button.button[title*="Поиск"]')).click();                
        }).then(() => {
               return browser.findElement(SUBMIT_SEARCH_BUTTON_LOCATOR).click();
        })
}

function sortBooks(){
         return browser.findElement(SORT_BY_YEAR_PUBLISHED).click();
}

function bookSelection(locator){
        return browser.wait(until.urlIs(URL_AFTER_SORT))        
         .then(() => {
        return browser.findElement(locator).click()
        }).then(() => {
               return browser.findElement(By.css('button[data-original-title*="В корзину"]')).click();
        }).then(() => {
                return browser.actions().mouseMove({x: 0, y: 0}).click().perform();
        }).then(() => {
                return browser.sleep(500);
        });
}

function checkAddingToCart(){
        return browser.findElement(CART_LOCATOR).click()
        .then(() => {
                var cartEmpty = true;
                 if(browser.findElement(By.css('#shopping-cart-table')).isDisplayed()){
                        cartEmpty = false;
                }
                return cartEmpty;
        }).then((cartEmpty) => {
                return assert.isFalse(cartEmpty, 'no items found in a shopping cart');
        })
}

function deleteAllFromCart(){
        return browser.navigate().to(CART_URL)
        .then(()=> {
        return browser.findElement(By.css('#empty_cart_button')).click()
        });
}

var browser = createDriver();
browser.manage().window().maximize();
return browser.get('https://biblio.by/').then(() => {
      return  logIn();
}).then(() => {
        return checkLogIn();
}).then(() => {
        return bookSearch();
}).then(() => {
        return sortBooks();
}).then(() => {
        return bookSelection(BOOK1_NAME_LOCATOR);
}).then(() => {
        return checkAddingToCart();
}).then(() => {
        browser.navigate().back();
        return browser.navigate().back();
}).then(() => {
       return bookSelection(BOOK2_NAME_LOCATOR);
}).then(() => {
        return deleteAllFromCart();
}).then(() => { 
         return browser.quit();
});
