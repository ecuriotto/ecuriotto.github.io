import Utils        from '../../services/Utils.js'
import DataGraphTab from './DataGraphTab.js'


let Province = {
    getComboRegioni: () => {
        var before = `<div class="field"><div class="control"><div class="select"><select id="regionsSelect">`;
        var after = `</select></div></div></div>`;
        var options = ``;
        Utils.regioni().forEach(element => {
            if(element == "Piemonte"){
                options += `<option selected="selected" value="` + element +`">`+element+`</option>`;
            }
            else{
                options += `<option value="` + element +`">`+element+`</option>`;
            }
            
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
        var maxRegion = [];
        

        myChart.data.datasets=[];

        var dataTable = document.getElementById('dataTable');       
        var htmlData = '';
        for(var provincia of province){
            htmlData += createLine(provincia)
        }
        function createLine(provincia){
            var varData = covid19Data.filter(function(obj){return obj["denominazione_provincia"]==provincia;}).map(function(objMap){return objMap["totale_casi"]})
            /*nuovi_casi_positivi non è un dato fornito ma dobbiamo derivarlo. facciamo la differenza tra il totale de casi tra un giorno e il precedente
            */
            
            if(tipoCaso=="nuovi_casi_positivi"){
                    varData = varData.map((curr, i, array) => {
                        return curr-= array[i-1]? array[i-1] : curr
                    }         
                    );
            }
            htmlData=Province.getTableData(varLabels,varData, provincia);
            maxRegion.push(Math.max(...varData));
            
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
                    fill : false
            });
            return htmlData;
                         
        }
        dataTable.innerHTML = htmlData;
        myChart.options.scales.yAxes[0].ticks.stepSize=Utils.getStepSize(maxRegion);
        myChart.update();
    },
    render : async () => {
                               
        var page_container = document.getElementById('page_container');
        page_container = await DataGraphTab.render();       
        var regionsSelect = document.getElementById('regionsSelect');
        var radioTipoCaso = document.getElementById('radioTipoCaso');
        regionsSelect.innerHTML = Province.getComboRegioni();
        radioTipoCaso.innerHTML = Province.getComboTipoCaso();


        //firstDivInPageContainer.innerHTML = `<div>`;
        var canvas = document.getElementById('myChart');
        canvas.setAttribute('id','myChart');
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

    Province.updateMyChart(myChart, covid19Data);
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
            },false);
        }
    },
    getTableData: (varLabels,varData, provincia) =>{
               
        
        //area can be an array of the regions or province selected
        var html = '';
        html += '<div class="column"><div class="has-text-link has-text-weight-bold is-uppercase">'+provincia+'</div><br><table class="table is-striped is-narrow is-bordered">';
            html += '<thead><tr>';
            html += '<th class="is-size-7">Data</th>';             
            html += '<th class="is-size-7">'+provincia+'</th>';                         
            html += '</tr></thead><tbody>';

            var i=varLabels.length-1;
            while(i >= 0) {                              
                html += '<tr><td class="is-size-7">' + varLabels[i] + '</td>';                  
                html += '<td class="is-size-7">' + varData[i] + '</td>';                   
                html += '</tr>';                
                i--;
            }            
            html += '</tbody></table></div>';
        return html;
      }

      
}

export default Province;

