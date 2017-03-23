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
            var max = _.maxBy(point, 'timestamp');
            var channelCount = _.countBy(point, function(value){
                if (value.timestamp = max ) {
                    return value.channel_name;
                }
                
            });
            
            
            var clients = _.groupBy(point, 'client_id');

            console.log(_.maxBy(point);

            //transform object to array
            channelCountArray = [];
            for(var key in channelCount) { 
                channelCountArray.push([ key, channelCount[key] ]); 
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