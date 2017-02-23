// global
var chart1h;
var chart24h;

//keps track of previous info for linechart
var previouslineinfo1h = []; 
var previouslineinfo24h = []; 

//request data from mongo
function requestData1h() {
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        url: '/homegraph',
        data: JSON.stringify({"timeinterval": 1}),
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
            var difference = _.differenceBy(watchedbytime, previouslineinfo1h, _.isEqual);
            
            for(var key in watchedbytime) {

                //if we don't have previousdata or we have a difference => add series to all series
                if(previouslineinfo1h.length == 0 || difference.length != 0) {
                    charttimestampinfo = [];
                    for(var channel in difference[key]) {
                        for(var timetags in difference[key][channel]) { 
                            charttimestampinfo.push([ timetags*1000, difference[key][channel][timetags] ]); 
                        }
                        chart1h.addSeries({
                            name: Object.keys(difference[key])[0],
                            data: charttimestampinfo,
                            type: 'scatter',
                            tooltip: {
                                pointFormat: '{point.x:%H:%M}: <b>{point.y}</b>'
                            }
                        });
                    }
                }
                
                //always update series data
                chart1h.series[parseInt(key) + 1].setData(charttimestampinfo, true);    
            }

            //save current fetched data
            previouslineinfo1h = watchedbytime;

            // add array to series data
            chart1h.series[0].setData(channelCountArray, true);

            // call it again after one second
            setTimeout(requestData1h, 5000);    
        },
    });
}

// draw chart
chart1h = new Highcharts.Chart({
    credits: {
        enabled: false
    },
    chart: {
        renderTo: 'graph1h',
        zoomType: 'x',
        events: {
            load: requestData1h()
        }
    },
    title: {
        text: 'Channel watched in the pasted 1h'
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
                            type: 'scatter',
                            tooltip: {
                                pointFormat: '{point.x:%H:%M}: <b>{point.y}</b>'
                            }
                        });
                    }
                }
                
                //always update series data
                chart24h.series[parseInt(key) + 1].setData(charttimestampinfo, true);    
            }

            //save current fetched data
            previouslineinfo24h = watchedbytime;

            // add array to series data
            chart24h.series[0].setData(channelCountArray, true);

            // call it again after one secondsss
            setTimeout(requestData24h, 60*60*1000);    
        },
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
            load: requestData24h()
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