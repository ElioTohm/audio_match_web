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
                if(a.confidence < 50 && a.confidence > 5){
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
                console.log(nowclient['channel_name']);
                $('tbody').append(
                    '<tr>'+
                        '<td>'+nowclient['client_id']+'</td>'+
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