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
            _.forEach(point, function(value) {
                var name = ''
                var sum = 0
                var data = []

                name = value._id

                localStorage.setItem(value._id, JSON.stringify(value));
                _.forEach(value.watched_per_ts, function(count) {
                    var counter = count.counter
                    sum = sum + counter
                    data.push(counter)
                });
                pieinfo.push({
                    'name': value._id,
                    'y':sum
                }) 
                chart24h.addSeries({'name': name, 'data': data, 'type': 'column'})
            });
              
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
        events: {
            load: requestData24h,
            // selection: function(event) {
            //     var piedata = current_data;
            //     if(event.xAxis != null) {
            //         piedata = _.filter(current_data, function(data) {
            //             return data.timestamp >= event.xAxis[0].min/1000  && data.timestamp <= event.xAxis[0].max/1000;
            //         });

            //     } else {
            //         piedata = _.filter(fetched_data, function(data) {
            //             return data.timestamp;
            //         });
            //     }
            //     current_data = piedata;
            //     channelCountArray = drawpie(piedata);
            //     this.series[0].update({data:channelCountArray}, true);
            // }
        }
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
                // legendItemClick: function (e) {
                //     selectchannelname =  this.name;
                //     if (this.visible) {
                //         hiddenchannels.push(selectchannelname);
                //     } else{
                //         var index = hiddenchannels.indexOf(selectchannelname);
                //         hiddenchannels.splice(index, 1);
                //     }

                //     channelCountArray = drawpie(current_data);
                //     chart24h.series[0].update({data:channelCountArray}, true);
                // }
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