import Utils        from '../../services/Utils.js'
import DataGraphTab from './DataGraphTab.js'


let France = {
    getComboRegioni: async () => {
        var response = await fetch(`../../data/french-regions-departments.json`);
        let regions = await response.json();
        var departmentCodes = Object.keys(regions.departments);
        var options = "";
        
        departmentCodes.forEach(element => {
            if(element=="38"){
                options += `<option selected="selected" value="` + element +`">`+regions.departments[element].formatted_name+`</option>`;
            }
            else{
                options += `<option value="` + element +`">`+regions.departments[element].formatted_name+`</option>`;
            } 
        });
        return options;//before + options + after;
    },
    getComboTipoCaso: () => {
        var radio = `<input class="is-checkradio is-small is-rtl" id="tipoCasoRadio0" type="radio" name="tipoCasoRadio" checked="checked" value="0" />`;
        radio+=`<label for="tipoCasoRadio0">Tutti</label>`;    
        radio += `<input class="is-checkradio is-small is-rtl" id="tipoCasoRadio1" type="radio" name="tipoCasoRadio" value=1 />`;
        radio+=`<label for="tipoCasoRadio1">Maschi</label>`;
        radio += `<input class="is-checkradio is-small is-rtl" id="tipoCasoRadio2" type="radio" name="tipoCasoRadio" value=2 />`;
        radio+=`<label for="tipoCasoRadio2">Femmine</label>`;    
        return radio;
    },
    updateMyChart  : (myChart, covid19Data) => {

        //var varLabels = covid19Data.map(function(obj){return obj["data"].substring(5,10);});
        const varLabels = [...new Set(covid19Data.map(item => item.jour.substring(5,10)))];
        
        var regions = France.getRegionsSelected();


        var maxRegion = []; 
        //console.log('updateMyChart');
        var tipoCaso = document.querySelector('input[name="tipoCasoRadio"]:checked').value;
        /*
        
        hosp: Number of people currently hospitalized
        rea: Number of people currently in resuscitation or critical care
        rad: Total amount of patient that returned home
        dc: Total amout of deaths at the hospital
        */
        var tipoMisura = {"hosp":" Number of people currently hospitalized","rea":"Number of people currently in resuscitation or critical care","rad":"Total amount of patient that returned home","dc":"Total amout of deaths at the hospital"};
        myChart.data.datasets=[];

        var dataTable = document.getElementById('dataTable');
        
        dataTable.innerHTML = France.getTableData(covid19Data, regions);
        var indexRegion = 0;
        Object.keys(tipoMisura).forEach(createLine);

        function createLine(tipoMisuraKey, index){
            var varData = covid19Data.filter(function(obj){return obj["dep"]==regions[0];}).filter(function(objMap){return objMap["sexe"]==tipoCaso}).map(function(objMap){return objMap[tipoMisuraKey]})
            console.log(varData);
            maxRegion.push(Math.max(...varData));
            
            //var indexRegion = Utils.regioni().indexOf(region);           
            var colorValues = Object.values(Utils.chartColors());
            console.log('indexRegion' + indexRegion);
            var color = colorValues[indexRegion];
            console.log(colorValues[0]);
            myChart.options.title.text = regions[0];
            myChart.options.title.fontSize = 16;
            myChart.options.title.display = true;
            myChart.data.labels= varLabels;
            myChart.data.datasets.push({
                    label: tipoMisura[tipoMisuraKey],
                    data: varData,
                    backgroundColor: color,
                    borderColor:color,
                    fill : false
                }); 
            indexRegion++;                 
        }
        myChart.options.scales.yAxes[0].ticks.stepSize=Utils.getStepSize(maxRegion);
        myChart.update();
    },
    render : async () => {

        var page_container = document.getElementById('page_container');
        page_container = await DataGraphTab.render();       
        var regionsSelect = document.getElementById('regionsSelect');
        var radioTipoCaso = document.getElementById('radioTipoCaso');
        regionsSelect.innerHTML = await France.getComboRegioni();
        radioTipoCaso.innerHTML = France.getComboTipoCaso();
                     
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
            France.updateMyChart(myChart, covid19Data);
        },false);

        regionsSelect.addEventListener('change',function() {
            France.updateMyChart(myChart, covid19Data);
        },false);
        
        //const response = await fetch(`https://static.data.gouv.fr/resources/donnees-hospitalieres-relatives-a-lepidemie-de-covid-19/20200405-190003/donnees-hospitalieres-covid19-2020-04-05-19h00.csv`);
        const response = await fetch(`https://static.data.gouv.fr/resources/donnees-hospitalieres-relatives-a-lepidemie-de-covid-19/20200406-190011/donnees-hospitalieres-covid19-2020-04-06-19h00.csv`);
        let covid19DataCsv = await response.text();
        //console.log('France data:');
        var covid19Data = Utils.csvToJson(covid19DataCsv);
        
        covid19Data = covid19Data.filter(function(obj){if (obj.jour) return obj});
        console.log(covid19Data);
        France.updateMyChart(myChart, covid19Data);       
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
            var covid19DataArea = covid19Data.filter(function(obj){return obj["dep"]==element;})
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

export default France;

