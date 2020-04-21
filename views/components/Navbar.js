let Navbar = {
    render: async () => {
        let view =  /*html*/`
             <nav class="navbar" role="navigation" aria-label="main navigation">
                <div class="container">
                    <div class="navbar-brand">
                        <a class="navbar-item" href="/#/" margin:0px; padding: 0px;>
                            <img src="./externalLib/images/italyFlag.png" alt="" width="122" height="108" margin:0px; padding: 0px;>
                        </a>

                        <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarMain">
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                        </a>
                    </div>

                    <div id="navbarMain" class="navbar-menu is-active" aria-expanded="false">
                        <div class="navbar-start">
                            <a class="navbar-item" id="nav" href="/#/">
                                Italia
                            </a>
                            <a class="navbar-item" id="navregioni" href="/#/regioni">
                                Regioni
                            </a>
                            <a class="navbar-item" id="navprovince" href="/#/province">
                                Province
                            </a>                           
                            <a class="navbar-item" id="navfrance" href="/#/france">
                                France
                            </a>                           
                        </div>
                        
                        <!--<div class="navbar-end">-->
                            <!--<div class="navbar-item">-->
                                <!--<a class="navbar-item" href="https://presse.inserm.fr/">-->
                                    <!--<img src="./externalLib/images/coronavirus.jpg" alt="https://presse.inserm.fr/" width="132" height="58" margin:0px; padding: 0px;>-->                               <!--</a>-->                 
                           <!-- </div> -->
                        <!--</div>-->
                    </div>
                </div>
            </nav>
            <div class="has-text-centered">                   
                    <p class="title">STATISTICHE CORONAVIRUS</p>                   
            </div>
            <br>   
        `
        return view
    },
    after_render: async () => {

    }


}

export default Navbar;