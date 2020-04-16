import Utils        from '../../services/Utils.js'

let Italia = {
    render : async () => {

        var page_container = document.getElementById('page_container');
        var canvas = document.createElement('canvas');
        canvas.setAttribute('id','myChart');
        canvas.setAttribute('width','200px');
        canvas.setAttribute('height','200px');
        canvas.width=200;
        canvas.height=200;
        page_container.appendChild(canvas);
        
        //page_container.style.height = '1200px';
        //page_container.style.width = '1200px';
        
        var ctx = canvas.getContext('2d');

        //var covid19Data = await Utils.getCovid19Data(`./data/dpc-covid19-ita-andamento-nazionale.json`);
        const response = await fetch(`https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale.json`);
        let covid19Data = await response.json();
        var varLabels = covid19Data.map(function(obj){return obj["data"].substring(5,10);});
        
        var nuoviAttualmentePositivi = covid19Data.map(function(obj){return obj["nuovi_attualmente_positivi"];});
        var deceduti = covid19Data.map(function(obj){return obj["deceduti"];});
        var deltaDeceduti = deceduti.map((curr, i, array) => {
            return curr-= array[i-1]? array[i-1] : curr
        });            
        var dimessiGuariti = covid19Data.map(function(obj){return obj["dimessi_guariti"];});
        var deltaDimessiGuariti=dimessiGuariti.map((curr, i, array) => {
            return curr-= array[i-1]? array[i-1] : curr
        });
        var ricoveratiConSintomi = covid19Data.map(function(obj){return obj["ricoverati_con_sintomi"];});
        var deltaRicoveratiConSintomi=ricoveratiConSintomi.map((curr, i, array) => {
            return curr-= array[i-1]? array[i-1] : curr
        });

        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: varLabels,
                datasets: [{
                    label: 'Delta Ricoverati Con Sintomi (Tot:' + ricoveratiConSintomi.slice(-1)[0] + ')',
                    data: deltaRicoveratiConSintomi,
                    backgroundColor: Utils.chartColors().red,
                    borderColor:Utils.chartColors().red,
                    //borderWidth: 1,
                    fill : false
                },
                {
                    label: 'Terapia Intensiva',
                    data: covid19Data.map(function(obj){return obj["terapia_intensiva"];}),
                    backgroundColor: Utils.chartColors().blue,
                    borderColor:Utils.chartColors().blue,
                    //borderWidth: 1,
                    fill : false
                },
                {
                    label: 'Nuovi Positivi',
                    data: covid19Data.map(function(obj){return obj["nuovi_positivi"];}),
                    backgroundColor: Utils.chartColors().yellow,
                    borderColor:Utils.chartColors().yellow,
                    //borderWidth: 1,
                    fill : false
                },
                {
                    label: 'Delta Deceduti (Tot:' + deceduti.slice(-1)[0] + ')',
                    data: deltaDeceduti,
                    backgroundColor: Utils.chartColors().green,
                    borderColor:Utils.chartColors().green,
                    //borderWidth: 1,
                    fill : false
                },
                {
                    label: 'Delta Dimessi Guariti (Tot:' + dimessiGuariti.slice(-1)[0] + ')',
                    data: deltaDimessiGuariti,
                    backgroundColor: Utils.chartColors().orange,
                    borderColor:Utils.chartColors().orange,
                    //borderWidth: 1,
                    fill : false
                }
            ],
                
            },
            options: {
                responsive: true,
                scales: {
                    yAxes: [{
                        stacked: false,
                        ticks: {                           
                            beginAtZero: true,
                            stepSize:1000
                        }
                    }]
                }
            }
        });
        return '';
    },

    after_render: async () => {}  
        
}


export default Italia;

