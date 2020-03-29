const Utils = { 
    // --------------------------------
    //  Parse a url and break it into resource, id and verb
    // --------------------------------
    parseRequestURL : () => {

        let url = location.hash.slice(1).toLowerCase() || '/';
        let r = url.split("/")
        let request = {
            resource    : null,
            id          : null,
            verb        : null
        }
        request.resource    = r[1]
        request.id          = r[2]
        request.verb        = r[3]

        return request
    }

    // --------------------------------
    //  Simple sleep implementation
    // --------------------------------
    , sleep: (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    , chartColors: () => {
        return{
            blue: 'rgb(54, 162, 235)',    
            red: 'rgb(255, 99, 132)',
            orange: 'rgb(255, 159, 64)',
            yellow: 'rgb(255, 205, 86)',
            green: 'rgb(75, 192, 192)',     
            purple: 'rgb(153, 102, 255)',
            grey: 'rgb(201, 203, 207)',
            brown: 'rgb(255,248,220)',
            anotherPurple: 'rgb(189, 128, 255)',
            lightskyblue: 'rgb(135,206,250)',
            gold: 'rgb(212,175,55)',
            blue2: 'rgb(0, 0, 204)',
            cyan: 'rgb(128, 128, 255)',
            orange2: 'rgb(255, 191, 128)',
            green2: 'rgb(191, 255, 128)',
            pink: 'rgb(255, 128, 255)',
            pink2: 'rgb(255, 128, 191)',
            purple2: 'rgb(191, 128, 255)',
            purpleGrey: 'rgb(191, 169, 214)',
            purpleBlack: 'rgb(63, 41, 86)',
            red2: 'rgb(255, 0, 0)',

        };
    }
    , randomScalingFactor: () => {
        return (Math.random() > 0.5 ? 1.0 : -1.0) * Math.random() * 100;
    },
    getCovid19Data: async (filename) => {

        try {
            //const response = await fetch(`https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale.json`, options)
            //const response = await fetch(`https://raw.githack.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale.json`, options)
            const response = await fetch(filename);
            const json = await response.json();
            var arr = json.map(function(obj){return obj["data"];});
            return json
        } catch (err) {
            console.log('Error getting covid data', err)
        }
     },
    regioni: () => {
        //    const regioni = [...new Set(covid19Data.map(item => item.denominazione_regione))];
        return ["Abruzzo", "Basilicata", "P.A. Bolzano", "Calabria", "Campania", "Emilia Romagna", "Friuli Venezia Giulia", "Lazio", "Liguria", "Lombardia", "Marche", "Molise", "Piemonte", "Puglia", "Sardegna", "Sicilia", "Toscana", "P.A. Trento", "Umbria", "Valle d'Aosta", "Veneto"];
    },
    tipoCaso: () => {
        return ["ricoverati_con_sintomi","terapia_intensiva","totale_ospedalizzati","isolamento_domiciliare", "totale_attualmente_positivi","nuovi_attualmente_positivi","dimessi_guariti","deceduti","totale_casi","tamponi"];
    },
    humanize: (str) => {
        //convert underscore in spaces and capitalize first letters
        var i, frags = str.split('_');
        for (i=0; i<frags.length; i++) {
          frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
        }
        return frags.join(' ');
      },
      createCORSRequest: async (method, url) => {
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {
          // Most browsers.
          xhr.open(method, url, true);
        } else if (typeof XDomainRequest != "undefined") {
          // IE8 & IE9
          xhr = new XDomainRequest();
          xhr.open(method, url);
        } else {
          // CORS not supported.
          xhr = null;
        }
        return xhr;
      }

}

export default Utils;