// global
var chart;

//keps track of previous info for linechart
var previousinfo; 

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
            var channelCount = _.countBy(point, 'channel_name');

            //transform object to array
            multiArray = [];
            for(var key in channelCount) { 
                multiArray.push([ key, channelCount[key] ]); 
            }

            // add array to series data
            chart.series[0].setData(multiArray, true);
            
            // call it again after one second
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
        events: {
            load: requestData
        }
    },
    title: {
        text: 'Channel watched'
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
        showInLegend: false,
        dataLabels: {
            enabled: false
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
    }],
});