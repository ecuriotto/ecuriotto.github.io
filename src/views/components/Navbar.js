let Navbar = {
    render: async () => {
        let view =  /*html*/`
             <nav class="navbar" role="navigation" aria-label="main navigation">
                <div class="container">
                    <div class="navbar-brand">
                        <a class="navbar-item" href="/#/">
                            <img src="./externalLib/images/italyFlag.png" alt="" width="112" height="48">
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
                            <a class="navbar-item" id="navsecret" href="/#/secret">
                                Secret
                            </a>
                        </div>
                        <div class="navbar-end">
                            <div class="navbar-item">
                                <div class="buttons">
                                    <a class="button is-primary" href="/#/register">
                                        <strong>Sign up</strong>
                                    </a>
                                    <a class="button is-light">
                                        Log in
                                    </a>
                                </div>
                            </div>
                        </div>
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