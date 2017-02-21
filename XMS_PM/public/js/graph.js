// global
var chart;

//keps track of previous info for linechart
var previouslineinfo; 

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
            channelCountArray = [];
            for(var key in channelCount) { 
                channelCountArray.push([ key, channelCount[key] ]); 
            }

            var watchedbytime = _(point).groupBy('channel_name')
                                        .map(function(item, itemId) {
                                            var obj = {};
                                            obj[itemId] = _.countBy(item, 'timestamp');
                                            return obj;
                                        }).valueOf();

            for(var key in watchedbytime) {
                charttimestampinfo = [];
                for(var channel in watchedbytime[key]) {
                    for(var timetags in watchedbytime[key][channel]) { 
                        charttimestampinfo.push([ timetags, watchedbytime[key][channel][timetags] ]); 
                    }
                }
                //TODO complete if statment to update if new channel is added
                if(!true) {
                    chart.addSeries({
                        name: Object.keys(watchedbytime[key])[0],
                        data: charttimestampinfo,
                        type: 'spline',
                    });
                } else {
                    chart.series[key + 1].setData(charttimestampinfo, true);
                }
                previouslineinfo = watchedbytime;
            }

            // add array to series data
            chart.series[0].setData(channelCountArray, true);

            // call it again after one second
            setTimeout(requestData, 5000);    
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
        zoomType: 'x',
        events: {
            load: requestData
        }
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
        showInLegend: false,
        dataLabels: {
            enabled: false
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        center: [100, 80],
        size: 100,
        showInLegend: false,
        dataLabels: {
            enabled: false
        }
    },{
        type: 'spline',
        name: 'Average',
        data: [[1,3], [2,2.67], [3,3], [4,6.33], [5,3.33]],
    }],
});