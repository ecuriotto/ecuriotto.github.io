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
       console.log('json');
       console.log(json);
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
                    label: '# of Votes',
                    data: varData,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        stacked: true,
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

