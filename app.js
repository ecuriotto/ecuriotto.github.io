"use strict";

import About        from './views/pages/About.js'
import Error404     from './views/pages/Error404.js'
import PostShow     from './views/pages/PostShow.js'
import Italia       from './views/pages/Italia.js'
import Regioni      from './views/pages/Regioni.js'
import Province      from './views/pages/Province.js'
import France        from './views/pages/France.js'
import Navbar       from './views/components/Navbar.js'
import Bottombar    from './views/components/Bottombar.js' 
import Utils        from './services/Utils.js'


// List of supported routes. Any url other than these routes will throw a 404 error
const routes = {
    '/'             : Italia
    , '/about'      : About
    , '/p/:id'      : PostShow
    , '/regioni'    : Regioni
    , '/province'   : Province
    , '/france'     : France
};


// The router code. Takes a URL, checks against the list of supported routes and then renders the corresponding content page.
const router = async () => {

    // Lazy load view element:
    const header = null || document.getElementById('header_container');
    const content = null || document.getElementById('page_container');
    const footer = null || document.getElementById('footer_container');
    
    // Render the Header and footer of the page
    header.innerHTML = await Navbar.render();
    await Navbar.after_render();


    //footer.innerHTML = await Bottombar.render();
    //await Bottombar.after_render();


    // Get the parsed URl from the addressbar
    let request = Utils.parseRequestURL()

    // Parse the URL and if it has an id part, change it with the string ":id"
    let parsedURL = (request.resource ? '/' + request.resource : '/') + (request.id ? '/:id' : '') + (request.verb ? '/' + request.verb : '')
    
    // Get the page from our hash of supported routes.
    // If the parsed URL is not in our list of supported routes, select the 404 page instead
    let page = routes[parsedURL] ? routes[parsedURL] : Error404
    content.innerHTML = await page.render();
    var k = await page.render();
    await page.after_render();
    //Once navbar ready let's change the background color of the current tab for better navigation
    document.getElementById("nav"+request.resource).className="navbar-item has-background-primary";   
}

// Listen on hash change:
window.addEventListener('hashchange', router);

// Listen on page load:
window.addEventListener('load', router);
