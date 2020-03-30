import Utils        from '../../services/Utils.js'



let Regioni = {
    getComboRegioni: () => {
        var before = `<div class="select is-multiple is-12"><select id="regionsSelect" multiple size="8">`;
        var after = `</select></div>`;
        var options = "";
        Utils.regioni().forEach(element => {
            if(element=="Lombardia"){
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
        var i=0;
        Utils.tipoCaso().forEach(element => {
            if(i==5)
                radio+=`<BR>`;
            if(element=="nuovi_attualmente_positivi"){
                radio += `<input class="is-checkradio is-small is-rtl" id="tipoCasoRadio`+i+`" type="radio" name="tipoCasoRadio" checked="checked" value="`+element+`">`;
            }
            else{
                radio += `<input class="is-checkradio is-small is-rtl" id="tipoCasoRadio`+i+`" type="radio" name="tipoCasoRadio" value="`+element+`">`;
            }
            radio+=`<label for="tipoCasoRadio`+i+`">`+element+`</label>`;
            i++;
        });
        return before + radio + after;
    },
    updateMyChart : (myChart, covid19Data) => {

        //var varLabels = covid19Data.map(function(obj){return obj["data"].substring(5,10);});
        const varLabels = [...new Set(covid19Data.map(item => item.data.substring(5,10)))];
        var regions = Regioni.getRegionsSelected();

        //console.log(varLabels);
        //console.log('updateMyChart');
        var tipoCaso = document.querySelector('input[name="tipoCasoRadio"]:checked').value;
        //console.log(varLabels);
        myChart.data.datasets=[];
        regions.forEach(createLine);
        function createLine(region, index){
            var varData = covid19Data.filter(function(obj){return obj["denominazione_regione"]==region;}).map(function(objMap){return objMap[tipoCaso]})
            console.log(varData);
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

        
        dropDownRegions.innerHTML = Regioni.getComboRegioni();
        radioTipoCaso.innerHTML = Regioni.getComboTipoCaso();


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
                            stepSize:200
                        }
                    }]
                }
            }
        });
    const response = await fetch(`https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni.json`);
    let covid19Data = await response.json();
    
    var regionSelectArray = [];
    var regionsSelect = document.getElementById('regionsSelect');
    regionSelectArray.push(regionsSelect.value)
    Regioni.updateMyChart(myChart, covid19Data);

    var radioTipoCasoSelect = document.getElementById('globalRadioId');//document.querySelector('input[name="tipoCasoRadio"]:checked').value;

    radioTipoCasoSelect.addEventListener('click',function() {
        Regioni.updateMyChart(myChart, covid19Data);
    },false);

    regionsSelect.addEventListener('change',function() {
        Regioni.updateMyChart(myChart, covid19Data);
    },false);
    
    
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
                    selections.push(opt.value || opt.text);
                }
            }
        }
        console.log('test');
        console.log(selections);   
        return selections;   
    },
    after_render: async () => {
        
    },

      
}

export default Regioni;

