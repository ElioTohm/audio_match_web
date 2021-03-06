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
            
            var channelCount = _.countBy(point['clients'], 'channel_name');

            //transform object to array
            channelCountArray = [];
            for(var key in channelCount) {
                channelCountArray.push({name: key, y: channelCount[key], color: point['channel_color'][key]});
            }

            // add array to series data
            chart.series[0].setData(channelCountArray, true);

            liveclientinfo = [];
            
            $('tbody').html('');

            _.forEach(point['clients'], function(client) {                
                $('tbody').append( 
                    '<tr>'+
                        '<td>'+client['client_id']+ '- ' + client['client_name'] +'</td>'+
                        '<td>'+client['channel_name']+'</td>'+
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

