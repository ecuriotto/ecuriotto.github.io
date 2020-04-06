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

    regioni: () => {
        //    const regioni = [...new Set(covid19Data.map(item => item.denominazione_regione))];
        return ["Abruzzo", "Basilicata", "P.A. Bolzano", "Calabria", "Campania", "Emilia-Romagna", "Friuli Venezia Giulia", "Lazio", "Liguria", "Lombardia", "Marche", "Molise", "Piemonte", "Puglia", "Sardegna", "Sicilia", "Toscana", "P.A. Trento", "Umbria", "Valle d'Aosta", "Veneto"];
    },
    tipoCaso: () => {
        return ["ricoverati_con_sintomi","terapia_intensiva","totale_ospedalizzati","isolamento_domiciliare", "variazione_totale_positivi","nuovi_positivi","dimessi_guariti","deceduti","totale_positivi","tamponi"];
    },
    humanize: (str) => {
        //convert underscore in spaces and capitalize first letters
        var i, frags = str.split('_');
        for (i=0; i<frags.length; i++) {
          frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
        }
        return frags.join(' ');
      },
      getStepSize: (arrayWithNumbers) =>{
                  //We want a fixed number of ticks, i.e. 10. We got the max value and we define the step size
        var totalMax = Math.max(...arrayWithNumbers);       
        var numberOfDigitsInTotalMaxMin1 = totalMax.toString().length-1
        var roundFactor = 10**numberOfDigitsInTotalMaxMin1;
        var roundedMax = Math.ceil(totalMax / roundFactor) * roundFactor;
        console.log(totalMax);
        console.log(numberOfDigitsInTotalMaxMin1);
        console.log(roundFactor);
        console.log(roundedMax);
        return roundedMax>100?roundedMax/10:roundedMax/5;
      },

      csvToJson:(csv) => {
        var lines=csv.split("\n");
        var result = [];
        var headers=lines[0].replace(/"/g,'').replace(/\r/g,'').split(";");     
        console.log(headers);
        //.map(function(objMap){return objMap.replace('"','')})
        for(var i=1;i<lines.length;i++){      
            var obj = {};
            var currentline=lines[i].replace(/"/g,'').replace(/\r/g,'').split(";");     
            for(var j=0;j<headers.length;j++){
                obj[headers[j]] = currentline[j];
            }     
            result.push(obj);      
        }     
        return result; //JSON
      }




}

export default Utils;