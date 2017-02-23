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
            var channelCount = _.countBy(point, 'channel_name');
            
            //transform object to array
            channelCountArray = [];
            for(var key in channelCount) { 
                channelCountArray.push([ key, channelCount[key] ]); 
            }

            // filter info to get channel watched by time within time interval
            var watchedbytime = _(point).groupBy('channel_name')
                                        .map(function(item, itemId) {
                                            var obj = {};
                                            obj[itemId] = _.countBy(item, 'timestamp');
                                            return obj;
                                        }).valueOf();
            
            //check difference between the current data and the previous call
            var difference = _.differenceBy(watchedbytime, previouslineinfo, _.isEqual);
            
            for(var key in watchedbytime) {

                //if we don't have previousdata or we have a difference => add series to all series
                if(previouslineinfo.length == 0 || difference.length != 0) {
                    charttimestampinfo = [];
                    for(var channel in difference[key]) {
                        for(var timetags in difference[key][channel]) { 
                            charttimestampinfo.push([ timetags, difference[key][channel][timetags] ]); 
                        }
                        chart.addSeries({
                            name: Object.keys(difference[key])[0],
                            data: charttimestampinfo,
                            type: 'spline',
                        });
                    }
                }
                
                //always update series data
                chart.series[parseInt(key) + 1].setData(charttimestampinfo, true);    
            }

            //save current fetched data
            previouslineinfo = watchedbytime;

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
        center: [15, 15],
        size: 100,
        showInLegend: false,
        dataLabels: {
            enabled: false
        }
    }],
});