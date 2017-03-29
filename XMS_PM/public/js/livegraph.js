// global
var chart;

//keps track of previous info for linechart
var previouslineinfo = []; 

//request data from mongo
function requestData() {
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        url: '/getdata',
        type:'POST',
        success: function(point) {
            //on success count distinct channel_name
            _.each(point, function(a){
                if(a.confidence < 50 ){
                    a.channel_name = 'Other';
                }
            });
            var max = _.maxBy(point, 'timestamp');
            var channelCount = _.countBy(point, function(value){
                if (value.timestamp = max.timestamp ) {
                    return value.channel_name;
                }
            });
            
            
            var clients = _.groupBy(point, 'client_id');

            //transform object to array
            channelCountArray = [];
            for(var key in channelCount) { 
                if (key == 'LBCI') {
                    channelCountArray.push({name: key, y: channelCount[key], color: '#25e200'});
                } else if (key == 'MTV') {
                    channelCountArray.push({name: key, y: channelCount[key], color: '#e20000'});
                } else if (key == 'OTV') {
                    channelCountArray.push({name: key, y: channelCount[key], color: '#faaa00'});
                } else if (key == 'FUTURE') {
                    channelCountArray.push({name: key, y: channelCount[key], color: '#0090ed'});
                } else if (key == 'MANAR') {
                    channelCountArray.push({name: key, y: channelCount[key], color: '#faf500'});
                } else if (key == 'ALJADEED') {
                    channelCountArray.push({name: key, y: channelCount[key], color: '#000000'});
                } else if (key == 'TL') {
                    channelCountArray.push({name: key, y: channelCount[key], color: '#d1d1bd'});
                } else if (key == 'NBN') {
                    channelCountArray.push({name: key, y: channelCount[key], color: '#a702b1'});
                } else if (key == 'Other') {
                    channelCountArray.push({name: key, y: channelCount[key], color: '#730028'});
                }
            }

            // add array to series data
            chart.series[0].setData(channelCountArray, true);

            liveclientinfo = [];
            
            $('tbody').html('');

            _.forEach(clients, function(client) {
                var nowclient = client[client.length - 1];
                
                var client_name = nowclient['client_id'];
                switch(nowclient['client_id']) {
                    case '1':
                        client_name = '1- Johny';
                        break;
                    case '4':
                        client_name = '4- Elio';
                        break;
                    case '5':
                        client_name = '5- unknown';
                        break;
                    case '6':
                        client_name = '6- Fady house';
                        break;
                    case '7':
                        client_name = '7- unknown';
                        break;
                    case '8':
                        client_name = '8- Fady office';
                        break;
                    case '9':
                        client_name = '9- Tony';
                        break;
                    case '10':
                        client_name = '10- unknown';
                        break;
                    case '11':
                        client_name = '11- unknown';
                        break;
                    case '12':
                        client_name = '12- unknown';
                        break;
                    case '13':
                        client_name = '13- XMS';
                        break;                            
                }
                $('tbody').append( 
                    '<tr>'+
                        '<td>'+client_name+'</td>'+
                        '<td>'+nowclient['channel_name']+'</td>'+
                    '</tr>'
                );
            });
            
            chart.hideLoading();

            // call it again after 10 second
            setTimeout(requestData, 10000);    
        },
        error: function (data) {
            console.log(data['responseText']);
        }
    });
}

// draw chart
chart = new Highcharts.Chart({
    credits: {
        enabled: false
    },
    chart: {
        renderTo: 'container',
        options3d: {
            enabled: true,
            alpha: 45,
            beta: 0
        },
        events: {
            load: requestData
        },
    },
    title: {
        text: 'Channel watched'
    },
    xAxis: {
            type: 'datetime'
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            depth: 35,
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            },
            showInLegend: true
        }
    },
    series: [{
        type: 'pie',
        name: 'Records',
        data: [],
        showInLegend: true,
        dataLabels: {
            enabled: true
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
    }],
});
chart.showLoading('Loading...');