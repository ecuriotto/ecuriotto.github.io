import Utils        from '../../services/Utils.js'



let Province = {
    getComboRegioni: () => {
        var before = `<div class="field"><div class="control"><div class="select"><select id="regionsSelect">`;
        var after = `</select></div></div></div>`;
        var options = `<option selected="selected" disabled value="">Scegli la regione</option>`;;
        Utils.regioni().forEach(element => {
            options += `<option value="` + element +`">`+element+`</option>`;
        });
        return before + options + after;
    },
    getComboTipoCaso: () => {
        var before = `<div class="column is-full"><div class="field" id="globalRadioId">`;
        var after = `</div></div>`;
        var radio = "";
        radio += `<input class="is-checkradio is-small is-rtl" id="tipoCasoRadio1" type="radio" name="tipoCasoRadio" checked="checked" value="totale_casi">`;
        radio+=`<label for="tipoCasoRadio1">Totale Casi</label>`;
        radio += `<input class="is-checkradio is-small is-rtl" id="tipoCasoRadio2" type="radio" name="tipoCasoRadio" value="nuovi_casi_positivi">`;
        radio+=`<label for="tipoCasoRadio2">Nuovi Casi Positivi</label>`;            
        return before + radio + after;
    },
    updateMyChart : (myChart, covid19Data) => {

        //var varLabels = covid19Data.map(function(obj){return obj["data"].substring(5,10);});

          

        var region = Province.getRegionSelected();
        var tipoCaso = document.querySelector('input[name="tipoCasoRadio"]:checked').value;
        //get all province data from region, stripping off dirty data including "definizione"  
        var varData = covid19Data.filter(function(obj){return obj["denominazione_regione"]==region;}).filter(function(obj2){return !obj2["denominazione_provincia"].includes("definizione")})
        const varLabels = [...new Set(varData.map(item => item.data.substring(5,10)))];
        const province =  [...new Set(varData.map(item => item.denominazione_provincia))];
        console.log(varData);
        console.log(varLabels);
        console.log(province);

        myChart.data.datasets=[];
        var regions = [];
        province.forEach(createLine);
        function createLine(provincia){
            var varData = covid19Data.filter(function(obj){return obj["denominazione_provincia"]==provincia;}).map(function(objMap){return objMap["totale_casi"]})
            /*nuovi_casi_positivi non è un dato fornito ma dobbiamo derivarlo. facciamo la differenza tra il totale de casi tra un giorno e il precedente
            */
           console.log(varData); 
           console.log(tipoCaso);
            if(tipoCaso=="nuovi_casi_positivi"){
                    varData = varData.map((curr, i, array) => {
                        return curr-= array[i-1]? array[i-1] : curr
                    }         
                    );
            }
            
            var indexProvincia = province.indexOf(provincia);           
            var colorValues = Object.values(Utils.chartColors());
            var color = colorValues[indexProvincia];
            myChart.options.title.text = Utils.humanize(tipoCaso);
            myChart.options.title.fontSize = 16;
            myChart.options.title.display = true;
            myChart.data.labels= varLabels;
            myChart.data.datasets.push({
                    label: provincia,
                    data: varData,
                    backgroundColor: color,
                    borderColor:color,
                    //borderWidth: 1,
                    fill : false
                });              
        }

        myChart.update();
    },
    render : async () => {
                  
               
        var page_container = document.getElementById('page_container');

        var secondRow = document.createElement('secondRow');
        secondRow.className = "columns";
        var firstDivInPageContainer = document.createElement('firstDivInPageContainer');
        firstDivInPageContainer.className = "column is-10";

        var dropDownRegions = document.createElement('dropDownRegions');
        dropDownRegions.className = "column is-2";

        var radioTipoCaso = document.createElement('radioTipoCaso');
        radioTipoCaso.className = "columns";

        
        dropDownRegions.innerHTML = Province.getComboRegioni();
        radioTipoCaso.innerHTML = Province.getComboTipoCaso();


        //firstDivInPageContainer.innerHTML = `<div>`;
        var canvas = document.createElement('canvas');
        canvas.setAttribute('id','myChart');

        
        page_container.appendChild(radioTipoCaso);
        page_container.appendChild(secondRow);
        
        secondRow.appendChild(dropDownRegions);
        secondRow.appendChild(firstDivInPageContainer);
        //page_container.appendChild(radioTipoCaso);

        firstDivInPageContainer.appendChild(canvas);
                     

        //Initialize empty chart
        var ctx = canvas.getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [],
                
            },
            options: {
                responsive: true,
                scales: {
                    yAxes: [{
                        stacked: false,
                        ticks: {                           
                            beginAtZero: true,
                            stepSize:100
                        }
                    }]
                }
            }
        });

    const response = await fetch(`https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-province.json`);
    let covid19Data = await response.json();
    var regionSelectArray = [];
    var regionsSelect = document.getElementById('regionsSelect');
    regionSelectArray.push(regionsSelect.value)
    //Province.updateMyChart(myChart, covid19Data);

    var radioTipoCasoSelect = document.getElementById('globalRadioId');//document.querySelector('input[name="tipoCasoRadio"]:checked').value;

    radioTipoCasoSelect.addEventListener('click',function() {
        Province.updateMyChart(myChart, covid19Data);
    },false);

    regionsSelect.addEventListener('change',function() {
        Province.updateMyChart(myChart, covid19Data);
    },false);
    return "";
    },
    getRegionSelected: () => {       
        var regionSelected = document.getElementById('regionsSelect');     
        return regionSelected.value;   
    },
    after_render: async () => {
        var navBarItems = document.getElementsByClassName("navbar-item");
        for (let i = 0; i < navBarItems.length; i++) {
                navBarItems[i].addEventListener('click',function(obj) {
                console.log("clicking on nav " + i);
                console.log(navBarItems[i]);
                //navBarItems[i].className = "navbar-item has-background-warning" ;
            },false);
        }
    },

      
}

export default Province;

