import Utils        from '../../services/Utils.js'

let getCovid19Data = async () => {
    const options = {
       method: 'GET',
       headers: {
           'Content-Type': 'application/json',
           'Content-Type': 'text/plain',
           'Access-Control-Allow-Origin': '*',
           'Access-Control-Allow-Methods': 'GET',
           'Access-Control-Allow-Headers': 'Accept, Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
           'Accept' : '*/*'
       }
       //, mode: 'cors'
   };
   try {
       //const response = await fetch(`https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale.json`, options)
       //const response = await fetch(`https://raw.githack.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale.json`, options)
       const response = await fetch(`./data/dpc-covid19-ita-andamento-nazionale.json`);
       const json = await response.json();
       var arr = json.map(function(obj){return obj["data"];});
       console.log('chartColors');
       console.log(Object.values(Utils.chartColors())[0]);
       return json
   } catch (err) {
       console.log('Error getting covid data', err)
   }
}

let SampleChart = {
    render : async () => {
        var page_container = document.getElementById('page_container');
        var canvas = document.createElement('canvas');
        canvas.setAttribute('id','myChart');
        canvas.setAttribute('width','200px');
        canvas.setAttribute('height','200px');
        canvas.width=200;
        canvas.height=200;
        page_container.appendChild(canvas);
        /*
        page_container.style.height = '400px';
        page_container.style.width = '400px';
        */
        var ctx = canvas.getContext('2d');

        var covid19Data = await getCovid19Data();
        console.log('covid19Data');
        console.log(covid19Data);
        var varLabels = covid19Data.map(function(obj){return obj["data"].substring(5,10);});
        console.log(varLabels);
        var varData = covid19Data.map(function(obj){return obj["ricoverati_con_sintomi"];});
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: varLabels,
                datasets: [{
                    label: 'ricoverati_con_sintomi',
                    data: varData,
                    backgroundColor: Utils.chartColors().red,
                    borderColor:Utils.chartColors().red,
                    //borderWidth: 1,
                    fill : false
                },
                {
                    label: 'terapia_intensiva',
                    data: covid19Data.map(function(obj){return obj["terapia_intensiva"];}),
                    backgroundColor: Utils.chartColors().blue,
                    borderColor:Utils.chartColors().blue,
                    //borderWidth: 1,
                    fill : false
                },
                {
                    label: 'nuovi_attualmente_positivi',
                    data: covid19Data.map(function(obj){return obj["nuovi_attualmente_positivi"];}),
                    backgroundColor: Utils.chartColors().yellow,
                    borderColor:Utils.chartColors().yellow,
                    //borderWidth: 1,
                    fill : false
                },
                {
                    label: 'deceduti',
                    data: covid19Data.map(function(obj){return obj["deceduti"];}),
                    backgroundColor: Utils.chartColors().green,
                    borderColor:Utils.chartColors().green,
                    //borderWidth: 1,
                    fill : false
                },
                {
                    label: 'dimessi_guariti',
                    data: covid19Data.map(function(obj){return obj["dimessi_guariti"];}),
                    backgroundColor: Utils.chartColors().orange,
                    borderColor:Utils.chartColors().orange,
                    //borderWidth: 1,
                    fill : false
                }],
                
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


export default SampleChart;

