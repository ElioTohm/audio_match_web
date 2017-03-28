// global
var chart24h;

//keps track of previous info for linechart
var previouslineinfo24h = []; 

//request data from mongo

//request data from mongo
function requestData24h() {

    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        data: JSON.stringify({"timeinterval": 24}),
        url: '/homegraph',
        type:'POST',
        success: function(point) {
            //on success count distinct channel_name
            _.each(point, function(a){
                if(a.confidence < 50 ){
                    a.channel_name = 'Other';
                }
            });
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

            console.log(point);

            //check difference between the current data and the previous call
            var difference = _.differenceBy(watchedbytime, previouslineinfo24h, _.isEqual);
            
            for(var key in watchedbytime) {

                //if we don't have previousdata or we have a difference => add series to all series
                if(previouslineinfo24h.length == 0 || difference.length != 0) {
                    charttimestampinfo = [];
                    for(var channel in difference[key]) {
                        for(var timetags in difference[key][channel]) { 
                            charttimestampinfo.push([ timetags*1000, difference[key][channel][timetags] ]); 
                        }
                        chart24h.addSeries({
                            name: Object.keys(difference[key])[0],
                            data: charttimestampinfo,
                            type: 'column',
                            tooltip: {
                                pointFormat: '{point.x:%H:%M}: <b>{point.y}</b>'
                            }
                        });
                    }
                }
                
                //always update series data
                // chart24h.series[parseInt(key) + 1].setData(charttimestampinfo, true);    
            }

            //save current fetched data
            previouslineinfo24h = watchedbytime;

            // add array to series data
            chart24h.series[0].setData(channelCountArray, true);
            chart24h.hideLoading();

            // call it again after 1h
            setTimeout(requestData24h, 1200000);
 
        },
        error: function (data) {
            console.log(data['responseText']);
        }
    });
}

// draw chart
chart24h = new Highcharts.Chart({
    credits: {
        enabled: false
    },
    chart: {
        renderTo: 'graph24h',
        zoomType: 'x',
        events: {
            load: requestData24h
        }
    },
    title: {
        text: 'Channel watched in the past 24h'
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
chart24h.showLoading('Loading...');