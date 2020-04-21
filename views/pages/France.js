

import Utils        from '../../services/Utils.js'
import DataGraphTab from './DataGraphTab.js'

let France = {
    getComboRegioni: async (covid19Data) => {
        var response = await fetch(`../../data/french-regions-departments-population.json`);
        let regions = await response.json();
        //We want to get the order of departments for hosp cases
        //First Let's get the last day of the array
        var lastDay = covid19Data.reduce(function(prev,cur){
            var curInt = parseInt(cur.jour.replace('-',''));
            if(prev && parseInt(prev.jour.replace('-',''))>curInt){
                return prev;
            }
            else 
                return cur
        });
        //console.log(lastDay.jour);
        var orderOfCases =1;
        var depByAllSexInLastDay = covid19Data.filter(function(obj){return obj.sexe == '0'}).filter(function(obj){return obj.jour == lastDay.jour}).filter(function(obj){return obj.dep.length<3});
        var depSortedByHospCasesInLastDay = depByAllSexInLastDay.sort((a,b)=> {

            if(a&&b){
                var populationA = parseInt(regions.departments[a.dep.toLowerCase()].population.replace(/,/g,''));
                var populationB = parseInt(regions.departments[b.dep.toLowerCase()].population.replace(/,/g,'')); 
                                                       
                return (parseInt(a.hosp)/populationA > parseInt(b.hosp)/populationB ? -1 : 1)
            }
            else
               return 1; 
        }).map((function(objMap){
            objMap.orderOfCases = orderOfCases++; 
            objMap.population = parseInt(regions.departments[objMap.dep.toLowerCase()].population.replace(/,/g,''));
            return objMap}));

        var departmentsSortableStructure = [];
        for(var depOrig in regions.departments){
            var newDep = regions.departments[depOrig];
            newDep.code = depOrig;
            var orderOfCasesDep = depSortedByHospCasesInLastDay.filter(function(obj){return obj.dep==newDep.code});
            newDep.orderOfCases = orderOfCasesDep.length>0 ? orderOfCasesDep[0].orderOfCases : '?';

            departmentsSortableStructure.push(newDep);
        }
        var options = "";
        departmentsSortableStructure=departmentsSortableStructure.sort((a,b)=> (a.name > b.name) ? 1 : -1);

        options += `<option selected="selected" value="0">France</option>`;
        departmentsSortableStructure.forEach(element => {           
            options += `<option value="` + element.code +`">`+element.formatted_name+ ` ` +element.orderOfCases+`</option>`;            
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
       //console.log(covid19Data);
        var tipoMisura = {"hosp":" Number of people currently hospitalized","rea":"Number of people currently in resuscitation or critical care","rad":"Total amount of patient that returned home","dc":"Total amout of deaths at the hospital"};
        myChart.data.datasets=[];

        var varDataFiltered = {};
        varDataFiltered.date=varLabels;
        var indexRegion = 0;
        Object.keys(tipoMisura).forEach(createLine);


        var dataTable = document.getElementById('dataTable');       
        dataTable.innerHTML = France.getTableData(varDataFiltered, regions[0]);
        function createLine(tipoMisuraKey, index){
            var varData =[];
            if(regions[0].value==0){
                varData= getFranceTotal(tipoMisuraKey);
                //varData = covid19Data.filter(function(obj){return obj["dep"]==regions[0];}).filter(function(objMap){return objMap["sexe"]==tipoCaso}).map(function(objMap){return objMap[tipoMisuraKey]})
            }
            else{
                varData = covid19Data.filter(function(obj){return obj["dep"]==regions[0].value;}).filter(function(objMap){return objMap["sexe"]==tipoCaso}).map(function(objMap){return objMap[tipoMisuraKey]})
            }    
            varDataFiltered[tipoMisuraKey] = varData;

            maxRegion.push(Math.max(...varData));         
            var colorValues = Object.values(Utils.chartColors());           
            var color = colorValues[indexRegion];
            myChart.options.title.text = regions[0].text.toUpperCase();
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
        function getFranceTotal(tipoMisuraKey){
            var covid19DataFiltered = covid19Data.filter(function(objMap){return objMap["sexe"]==tipoCaso});//.map(function(objMap){return objMap[tipoMisuraKey]})
            var covid19DataFrance = [];
            varLabels.forEach(function(jourDate){
                var covid19DataFilteredByDate = covid19DataFiltered.filter(function(objMap){return objMap['jour'].substring(5,10)==jourDate})
                covid19DataFrance.push(covid19DataFilteredByDate.reduce((prev, cur) => prev + parseInt(cur[tipoMisuraKey]), 0));               
            });
            return covid19DataFrance;
        }
        myChart.options.scales.yAxes[0].ticks.stepSize=Utils.getStepSize(maxRegion);
        myChart.update();
    },

    render : async () => {

        var page_container = document.getElementById('page_container');
        page_container = await DataGraphTab.render();       
        var regionsSelect = document.getElementById('regionsSelect');
        var radioTipoCaso = document.getElementById('radioTipoCaso');

                     
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
        radioTipoCasoSelect.addEventListener('click',function() {
            France.updateMyChart(myChart, covid19Data);
        },false);

        regionsSelect.addEventListener('change',function() {
            France.updateMyChart(myChart, covid19Data);
        },false);
        
        const response = await fetch(`../../data/donneesFr.csv`);

        let covid19DataCsv = await response.text();
        var covid19Data = Utils.csvToJson(covid19DataCsv);
        
        covid19Data = covid19Data.filter(function(obj){if (obj.jour) return obj});
        regionsSelect.innerHTML = await France.getComboRegioni(covid19Data);
        radioTipoCaso.innerHTML = France.getComboTipoCaso();
        France.updateMyChart(myChart, covid19Data);       
        return "";
    },
    getRegionsSelected: () => {
        
        var regionsSelect = document.getElementById('regionsSelect');
        var selections = [];
        
        if(typeof regionsSelect=="string")
            selections.push(regionsSelect.value);
        else{    
            for (var i=0, iLen=regionsSelect.selectedOptions.length; i<iLen; i++) {
                var opt = regionsSelect.selectedOptions[i];       
                if (opt.selected) {
                    selections.push(opt);
                }
            }
        } 
        return selections;   
    },
    after_render: async () => {
        
    },
    getTableData: (varDataFiltered, region) =>{
               
    //    console.log(JSON.stringify(varDataFiltered));
        
        //area can be an array of the regions or province selected
        var html = '';
        //var covid19DataOrdered=covid19DataArea.sort((a,b) => (a.data > b.data) ? -1 : ((b.data > a.data) ? 1 : 0)); 
        html += '<section class="tab-content"><div class="has-text-link has-text-weight-bold is-uppercase">'+region.text+'</div><br><table class="table is-striped is-narrow is-bordered">';
        html += '<thead><tr>';
        var keys =  Object.keys(varDataFiltered);
        for( var j of keys ) {           
                html += '<th class="is-size-7">' + j + '</th>';
        }
        
        html += '</tr></thead><tbody>';
        for( var i = varDataFiltered["date"].length-1; i >=0 ; i--) {
            html += '<tr>';
            for( var j of keys ) {      
                html += '<td class="is-size-7">' + varDataFiltered[j][i] + '</td>';
            }
            html += '</tr>';
        }
        html += '</tbody></table></section><br>';      
        return html;
      }
    

      
}

export default France;

