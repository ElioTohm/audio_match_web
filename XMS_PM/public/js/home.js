// global
var chart24h;

localStorage.clear()

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
            console.log(point)
            // //transform object to array
            pieinfo = []
            barinfo = []
            for (var i in point) {
                var name = ''
                var sum = 0
                var data = []

                name = point[i]._id

                for (var y in point[i].watched_per_ts) {
                    localStorage.setItem(point[i]._id, JSON.stringify(point[i]));
                    var counter = point[i].watched_per_ts[y].counter
                    sum = sum + counter
                    data.push(counter)
                }
                pieinfo[i] = {
                    'name': point[i]._id,
                    'y':sum
                } 
                chart24h.addSeries({'name': name, 'data': data, 'type': 'column'})
            }

            // // filter info to get channel watched by time within time interval
            // var watchedbytime = _(point).groupBy('channel_name')
            //                             .map(function(item, itemId) {
            //                                 var obj = {};
            //                                 obj[itemId] = _.countBy(item, 'timestamp');
            //                                 return obj;
            //                             }).valueOf();

            // for(var key in watchedbytime) {

            //     charttimestampinfo = [];
            //     for(var channel in watchedbytime[key]) {
            //         for(var timetags in watchedbytime[key][channel]) {
            //             charttimestampinfo.push([ timetags*1000, watchedbytime[key][channel][timetags] ]);
            //         }
            //         if (Object.keys(watchedbytime[key])[0] == 'MBCAction') {
            //             chart24h.addSeries({
            //                 name: Object.keys(watchedbytime[key])[0],
            //                 data: charttimestampinfo,
            //                 type: 'column',
            //                 color: '#faaa00'
            //             });
            //         } else if (Object.keys(watchedbytime[key])[0] == 'MBC1') {
            //             chart24h.addSeries({
            //                 name: Object.keys(watchedbytime[key])[0],
            //                 data: charttimestampinfo,
            //                 type: 'column',
            //                 color: '#a702b1'
            //             });
            //         } else if (Object.keys(watchedbytime[key])[0] == 'MBC2') {
            //             chart24h.addSeries({
            //                 name: Object.keys(watchedbytime[key])[0],
            //                 data: charttimestampinfo,
            //                 type: 'column',
            //                 color: '#25e200'
            //             });
            //         } else if (Object.keys(watchedbytime[key])[0] == 'MBC3') {
            //             chart24h.addSeries({
            //                 name: Object.keys(watchedbytime[key])[0],
            //                 data: charttimestampinfo,
            //                 type: 'column',
            //                 color: '#e20000'
            //             });
            //         } else if (Object.keys(watchedbytime[key])[0] == 'MBC4') {
            //             chart24h.addSeries({
            //                 name: Object.keys(watchedbytime[key])[0],
            //                 data: charttimestampinfo,
            //                 type: 'column',
            //                 color: '#9370DB'
            //             });
            //         } else if (Object.keys(watchedbytime[key])[0] == 'Other') {
            //             chart24h.addSeries({
            //                 name: Object.keys(watchedbytime[key])[0],
            //                 data: charttimestampinfo,
            //                 type: 'column',
            //                 color: '#730028'
            //             });
            //         }
            //     }
            // }

            // //save current fetched data
            // fetched_data = point;
            // current_data = point;

            // // add array to series data
            chart24h.series[0].setData(pieinfo, true);

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
     tooltip: {
        shared: true,
        crosshairs: true
    },
    chart: {
        renderTo: 'graph24h',
        zoomType: 'x',
        // events: {
        //     load: requestData24h,
        //     selection: function(event) {
        //         var piedata = current_data;
        //         if(event.xAxis != null) {
        //             piedata = _.filter(current_data, function(data) {
        //                 return data.timestamp >= event.xAxis[0].min/1000  && data.timestamp <= event.xAxis[0].max/1000;
        //             });

        //         } else {
        //             piedata = _.filter(fetched_data, function(data) {
        //                 return data.timestamp;
        //             });
        //         }
        //         current_data = piedata;
        //         channelCountArray = drawpie(piedata);
        //         this.series[0].update({data:channelCountArray}, true);
        //     }
        // }
    },
    title: {
        text: 'Channels watched in the past week'
    },
    xAxis: {
        tickmarkPlacement: 'on',
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
            pointFormat: '<b>{point.percentage:.1f}%</b>'
        },
        center: [15, 15],
        size: 100,
    }],
});
chart24h.showLoading('Loading...');

//draw pie series
// function drawpie (currentpiedata)
// {
//     for (var channel_name in hiddenchannels) {
//         currentpiedata = currentpiedata.filter(function(n) {
//             return n.channel_name != hiddenchannels[channel_name];
//         });
//     }
//     var piedata = _.countBy(currentpiedata, 'channel_name')
//     channelCountArray = [];
//     for(var key in piedata) {
//         if (key == 'MBCAction') {
//             channelCountArray.push({name: key, y: piedata[key], color: '#faaa00'});
//         } else if (key == 'MBC1') {
//             channelCountArray.push({name: key, y: piedata[key], color: '#a702b1'});
//         } else if (key == 'MBC2') {
//             channelCountArray.push({name: key, y: piedata[key], color: '#25e200'});
//         } else if (key == 'MBC3') {
//             channelCountArray.push({name: key, y: piedata[key], color: '#e20000'});
//         } else if (key == 'MBC4') {
//             channelCountArray.push({name: key, y: piedata[key], color: '#9370DB'});
//         } else if (key == 'Other') {
//             channelCountArray.push({name: key, y: piedata[key], color: '#730028'});
//         }
//     }
//     return channelCountArray;
// }

$('#btn-line').click(function () {
    $.each(chart24h.series, function(key, series) {
        if ( key > 0) {
            series.update({
                type: 'line'
            })
        }
    });
    if (!$(this).hasClass('btn-primary')) {
        $(this).toggleClass( "btn-primary" );
        $('#btn-column').toggleClass( "btn-primary" );
    }
});

$('#btn-column').click(function () {
    $.each(chart24h.series, function(key, series) {
        if ( key > 0) {
            series.update({
                type: 'column'
            })
        }
    });
    if (!$(this).hasClass('btn-primary')) {
        $( this ).toggleClass( "btn-primary" );
        $('#btn-line').toggleClass( "btn-primary" );
    }
});