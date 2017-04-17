// global
var chart24h;

//keps track of previous info for linechart
var fetched_data = []; 
var current_data = [];

//variable to keep track of hidden series
var hiddenchannels = [];

//request data from mongo
function requestData24h() 
{
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
            //transform object to array
            channelCountArray = drawpie(point);

            // filter info to get channel watched by time within time interval
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
                        charttimestampinfo.push([ timetags*1000, watchedbytime[key][channel][timetags] ]); 
                    }
                    if (Object.keys(watchedbytime[key])[0] == 'LBCI') {
                        chart24h.addSeries({
                            name: Object.keys(watchedbytime[key])[0],
                            data: charttimestampinfo,
                            type: 'column',
                            tooltip: {
                                pointFormat: '{point.x:%H:%M}: <b>{point.y}</b>'
                            },
                            color: '#25e200'
                        });    
                    } else if (Object.keys(watchedbytime[key])[0] == 'MTV') {
                        chart24h.addSeries({
                            name: Object.keys(watchedbytime[key])[0],
                            data: charttimestampinfo,
                            type: 'column',
                            tooltip: {
                                pointFormat: '{point.x:%H:%M}: <b>{point.y}</b>'
                            },
                            color: '#e20000'
                        });
                    } else if (Object.keys(watchedbytime[key])[0] == 'OTV') {
                        chart24h.addSeries({
                            name: Object.keys(watchedbytime[key])[0],
                            data: charttimestampinfo,
                            type: 'column',
                            tooltip: {
                                pointFormat: '{point.x:%H:%M}: <b>{point.y}</b>'
                            },
                            color: '#faaa00'
                        });
                    } else if (Object.keys(watchedbytime[key])[0] == 'FUTURE') {
                        chart24h.addSeries({
                            name: Object.keys(watchedbytime[key])[0],
                            data: charttimestampinfo,
                            type: 'column',
                            tooltip: {
                                pointFormat: '{point.x:%H:%M}: <b>{point.y}</b>'
                            },
                            color: '#0090ed'
                        });
                    } else if (Object.keys(watchedbytime[key])[0] == 'MANAR') {
                        chart24h.addSeries({
                            name: Object.keys(watchedbytime[key])[0],
                            data: charttimestampinfo,
                            type: 'column',
                            tooltip: {
                                pointFormat: '{point.x:%H:%M}: <b>{point.y}</b>'
                            },
                            color: '#faf500'
                        });
                    } else if (Object.keys(watchedbytime[key])[0] == 'ALJADEED') {
                        chart24h.addSeries({
                            name: Object.keys(watchedbytime[key])[0],
                            data: charttimestampinfo,
                            type: 'column',
                            tooltip: {
                                pointFormat: '{point.x:%H:%M}: <b>{point.y}</b>'
                            },
                            color: '#000000'
                        });
                    } else if (Object.keys(watchedbytime[key])[0] == 'TL') {
                        chart24h.addSeries({
                            name: Object.keys(watchedbytime[key])[0],
                            data: charttimestampinfo,
                            type: 'column',
                            tooltip: {
                                pointFormat: '{point.x:%H:%M}: <b>{point.y}</b>'
                            },
                            color: '#d1d1bd'
                        });
                    } else if (Object.keys(watchedbytime[key])[0] == 'NBN') {
                        chart24h.addSeries({
                            name: Object.keys(watchedbytime[key])[0],
                            data: charttimestampinfo,
                            type: 'column',
                            tooltip: {
                                pointFormat: '{point.x:%H:%M}: <b>{point.y}</b>'
                            },
                            color: '#a702b1'
                        });
                    } else if (Object.keys(watchedbytime[key])[0] == 'Other') {
                        chart24h.addSeries({
                            name: Object.keys(watchedbytime[key])[0],
                            data: charttimestampinfo,
                            type: 'column',
                            tooltip: {
                                pointFormat: '{point.x:%H:%M}: <b>{point.y}</b>'
                            },
                            color: '#730028'
                        });
                    }
                }
            }

            //save current fetched data
            fetched_data = point;
            current_data = point;

            // add array to series data
            chart24h.series[0].setData(channelCountArray, true);

            chart24h.hideLoading();

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
            load: requestData24h,
            selection: function(event) {
                var piedata = current_data;
                if(event.xAxis != null) {
                    piedata = _.filter(current_data, function(data) {
                        return data.timestamp >= event.xAxis[0].min/1000  && data.timestamp <= event.xAxis[0].max/1000;
                    });
                    
                } else {
                    piedata = _.filter(fetched_data, function(data) {
                        return data.timestamp;
                    });
                }
                current_data = piedata;
                channelCountArray = drawpie(current_data);
                this.series[0].update({data:channelCountArray}, true);
            }
        }
    },
    title: {
        text: 'Channels watched in the past week'
    },
    xAxis: {
            type: 'datetime'
    },
    plotOptions: {
        series: {
            events: {
                legendItemClick: function (e) {
                    selectchannelname =  this.name;
                    if (this.visible) {
                        hiddenchannels.push(selectchannelname);
                    } else{
                        var index = hiddenchannels.indexOf(selectchannelname);
                        hiddenchannels.splice(index, 1);
                    }

                    channelCountArray = drawpie(current_data);
                    chart24h.series[0].update({data:channelCountArray}, true);    
                }
            },
        }
    },           
    series: [{
        type: 'pie',
        name: 'Records',
        data: [],
        dataLabels: {
            enabled: false
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        center: [15, 15],
        size: 100,
    }],
});
chart24h.showLoading('Loading...');

//draw pie series
function drawpie (currentpiedata)
{ 
    for (var channel_name in hiddenchannels) {
        currentpiedata = currentpiedata.filter(function(n) {
            return n.channel_name != hiddenchannels[channel_name];
        }); 
    }
    var piedata = _.countBy(currentpiedata, 'channel_name')
    channelCountArray = [];
    for(var key in piedata) {
        if (key == 'LBCI') {
            channelCountArray.push({name: key, y: piedata[key], color: '#25e200'});
        } else if (key == 'MTV') {
            channelCountArray.push({name: key, y: piedata[key], color: '#e20000'});
        } else if (key == 'OTV') {
            channelCountArray.push({name: key, y: piedata[key], color: '#faaa00'});
        } else if (key == 'FUTURE') {
            channelCountArray.push({name: key, y: piedata[key], color: '#0090ed'});
        } else if (key == 'MANAR') {
            channelCountArray.push({name: key, y: piedata[key], color: '#faf500'});
        } else if (key == 'ALJADEED') {
            channelCountArray.push({name: key, y: piedata[key], color: '#000000'});
        } else if (key == 'TL') {
            channelCountArray.push({name: key, y: piedata[key], color: '#d1d1bd'});
        } else if (key == 'NBN') {
            channelCountArray.push({name: key, y: piedata[key], color: '#a702b1'});
        } else if (key == 'Other') {
            channelCountArray.push({name: key, y: piedata[key], color: '#730028'});
        }
    }      
    return channelCountArray;
}