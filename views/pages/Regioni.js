import Utils        from '../../services/Utils.js'
import DataGraphTab from './DataGraphTab.js'


let Regioni = {
    getComboRegioni: () => {
        //var before = `<div class="select is-multiple is-12"><select id="regionsSelect" multiple size="8">`;
        //var after = `</select></div>`;
        var options = "";
        Utils.regioni().forEach(element => {
            if(element=="Lombardia"){
                options += `<option selected="selected" value="` + element +`">`+element+`</option>`;
            }
            else{
                options += `<option value="` + element +`">`+element+`</option>`;
            } 
        });
        return options;//before + options + after;
    },
    getComboTipoCaso: () => {

        var radio = "";
        var i=0;
        Utils.tipoCaso().forEach(element => {

            
            if(element=="nuovi_positivi"){
                radio += `<input class="is-checkradio is-small is-rtl" id="tipoCasoRadio`+i+`" type="radio" name="tipoCasoRadio" checked="checked" value="`+element+`" />`;
            }
            else{
                radio += `<input class="is-checkradio is-small is-rtl" id="tipoCasoRadio`+i+`" type="radio" name="tipoCasoRadio" value="`+element+`" />`;
            }
            radio+=`<label for="tipoCasoRadio`+i+`">`+Utils.humanize(element)+`</label>`;    
            i++;
        });
        return radio;
    },
    updateMyChart  : (myChart, covid19Data) => {

        //var varLabels = covid19Data.map(function(obj){return obj["data"].substring(5,10);});
        const varLabels = [...new Set(covid19Data.map(item => item.data.substring(5,10)))];
        var regions = Regioni.getRegionsSelected();


        var maxRegion = []; 
        //console.log('updateMyChart');
        var tipoCaso = document.querySelector('input[name="tipoCasoRadio"]:checked').value;

        myChart.data.datasets=[];

        var dataTable = document.getElementById('dataTable');
        
        dataTable.innerHTML = Regioni.getTableData(covid19Data, regions);
        regions.forEach(createLine);
        
        function createLine(region, index){
            var varData = covid19Data.filter(function(obj){return obj["denominazione_regione"]==region;}).map(function(objMap){return objMap[tipoCaso]})
            console.log(varData);
            maxRegion.push(Math.max(...varData));
            var indexRegion = Utils.regioni().indexOf(region);           
            var colorValues = Object.values(Utils.chartColors());
            var color = colorValues[indexRegion];
            myChart.options.title.text = Utils.humanize(tipoCaso);
            myChart.options.title.fontSize = 16;
            myChart.options.title.display = true;
            myChart.data.labels= varLabels;
            myChart.data.datasets.push({
                    label: region,
                    data: varData,
                    backgroundColor: color,
                    borderColor:color,
                    fill : false
                });              
        }
        myChart.options.scales.yAxes[0].ticks.stepSize=Utils.getStepSize(maxRegion);
        myChart.update();
    },
    render : async () => {

        var page_container = document.getElementById('page_container');
        page_container = await DataGraphTab.render();       
        var regionsSelect = document.getElementById('regionsSelect');
        var radioTipoCaso = document.getElementById('radioTipoCaso');
        regionsSelect.innerHTML = Regioni.getComboRegioni();
        radioTipoCaso.innerHTML = Regioni.getComboTipoCaso();
        //var regionSelectArray = [];
        
        //regionSelectArray.push(regionsSelect.value)
                     
        var canvas = document.getElementById('myChart');
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
                            stepSize:200
                        }
                    }]
                }
            }
        });
        var regionsSelect = document.getElementById('regionsSelect');
        var radioTipoCasoSelect = document.getElementById('globalRadioId');
        console.log(radioTipoCasoSelect);
        radioTipoCasoSelect.addEventListener('click',function() {
            Regioni.updateMyChart(myChart, covid19Data);
        },false);

        regionsSelect.addEventListener('change',function() {
            Regioni.updateMyChart(myChart, covid19Data);
        },false);
        
        const response = await fetch(`https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni.json`);
        let covid19Data = await response.json();
        

        Regioni.updateMyChart(myChart, covid19Data);


        
        
        return "";
    },
    getRegionsSelected: () => {
        
        var regionsSelect = document.getElementById('regionsSelect');
        console.log(regionsSelect);
        var selections = [];
        if(typeof regionsSelect=="string")
            selections.push(regionsSelect.value);
        else{    
            for (var i=0, iLen=regionsSelect.selectedOptions.length; i<iLen; i++) {
                var opt = regionsSelect.selectedOptions[i];       
                if (opt.selected) {
                    selections.push(opt.value || opt.text);
                }
            }
        } 
        return selections;   
    },
    after_render: async () => {
        
    },
    getTableData: (covid19Data, area) =>{
               
        
        //area can be an array of the regions or province selected
        var html = '';
        area.forEach(element => {
            var covid19DataArea = covid19Data.filter(function(obj){return obj["denominazione_regione"]==element;})
            var covid19DataOrdered=covid19DataArea.sort((a,b) => (a.data > b.data) ? -1 : ((b.data > a.data) ? 1 : 0)); 
            html += '<section class="tab-content"><div class="has-text-link has-text-weight-bold is-uppercase">'+element+'</div><br><table class="table is-striped is-narrow is-bordered">';
            html += '<thead><tr>';
            
            for( var j in covid19DataOrdered[0] ) {
                if(Utils.tipoCaso().includes(j)||j=="data"){
                    html += '<th class="is-size-7">' + Utils.humanize(j).replace(' ','<BR>') + '</th>';
                }
            }
            html += '</tr></thead><tbody>';
            for( var i = 0; i < covid19DataOrdered.length; i++) {
            html += '<tr>';
            for( var j in covid19DataOrdered[i] ) {
                if(Utils.tipoCaso().includes(j)){
                    html += '<td class="is-size-7">' + covid19DataOrdered[i][j] + '</td>';
                }
                if(j=="data"){
                    html += '<td class="is-size-7">' + covid19DataOrdered[i][j].substring(5,10) + '</td>';
                }
            }
            html += '</tr>';
            }
            html += '</tbody></table></section><br>';
        });
        return html;
      }
    

      
}

export default Regioni;

