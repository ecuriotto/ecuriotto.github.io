/*
Js that gives the structure of the page
*/ 
let DataGraphTab = {

    render : async () => {

        var page_container = document.getElementById('page_container');

        var page_container_html = /*html*/`
            <div class="column is-full">
                <div class="field" id="globalRadioId">
                    <div id='radioTipoCaso' class='columns'></div>
                </div>
                <div class="tabs is-toggle is-centered">
                    <ul>
                        <li class="is-active">
                            <a class="button is-small">
                            <span class="icon is-small"><i class="fas fa-image" aria-hidden="true"></i></span>
                            <span>Grafico</span>
                            </a>
                        </li>
                        <li>
                            <a class="button is-small">
                            <span class="icon is-small"><i class="far fa-file-alt" aria-hidden="true"></i></span>
                            <span>Dati</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>        
            <div id='secondRow' class='columns'>
                <div id='dropDownRegions' class='column is-2'>
                     <div class="select is-multiple is-12">                   
                        <select id="regionsSelect" multiple size="8"></select>
                    </div>
                </div>        
                <div id='firstDivInPageContainer' class='column is-10'>

                    <div>
                        <section><canvas id='myChart' class='tab-content'></canvas></section>
                        <section><div id='dataTable' class="tab-content columns"></div></section>
                    </div>            
                </div>


            </div>
            <div class="zoom">
            <div class="container>
                <div class="notification>                  
              
                </div>     
                <div class="notification is-primary">                  
                    <button id="idFirst" class="button is-white">First</button>
                    <button id="idCenter" class="button is-light">Center</button>
                    <button id="idLast" class="button is-dark">Last</button>
                    <button id="idAll" class="button is-black">All</button>                
                </div>
                <div>                  
           
            </div>            
            </div>
            <div class="container>                 
        </div>
        
    </div> 

        `

        var page_container = document.getElementById('page_container');
        page_container.innerHTML = page_container_html;     

        let tabsWithContent = (function () {
            
            let tabs = document.querySelectorAll('.tabs li');
            let tabsContent = document.querySelectorAll('.tab-content');

            let deactivateAllTabs = function () {
                tabs.forEach(function (tab) {
                    tab.classList.remove('is-active');
                });
            };

            let hideTabsContent = function () {
                tabsContent.forEach(function (tabContent) {
                    tabContent.style.display = "none";
                    tabContent.classList.remove('is-active');
                });
            };

            let activateTabsContent = function (tab) {
                tabsContent[getIndex(tab)].style.display = "";
                tabsContent[getIndex(tab)].classList.add('is-active');
            };

            let getIndex = function (el) {
                return [...el.parentElement.children].indexOf(el);
            };

            tabs.forEach(function (tab) {              
                tab.addEventListener('click', function () {
                    deactivateAllTabs();
                    hideTabsContent();
                    tab.classList.add('is-active');
                    activateTabsContent(tab);
                });
            })

            tabs[0].click();
        })();
/*
        let zoomWithContent = (function () {
            
            
            

            let deactivateAllTabs = function () {
                tabs.forEach(function (tab) {
                    tab.classList.remove('is-active');
                });
            };

            let hideTabsContent = function () {
                tabsContent.forEach(function (tabContent) {
                    tabContent.style.display = "none";
                    tabContent.classList.remove('is-active');
                });
            };

            let activateTabsContent = function (tab) {
                tabsContent[getIndex(tab)].style.display = "";
                tabsContent[getIndex(tab)].classList.add('is-active');
            };

            let getIndex = function (el) {
                return [...el.parentElement.children].indexOf(el);
            };

            tabs.forEach(function (tab) {              
                tab.addEventListener('click', function () {
                    deactivateAllTabs();
                    hideTabsContent();
                    tab.classList.add('is-active');
                    activateTabsContent(tab);
                });
            })

            tabs[0].click();
        })();
  */    
        return page_container;
    }
    , after_render: async () => {}
}
export default DataGraphTab;