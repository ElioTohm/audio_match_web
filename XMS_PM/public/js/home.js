// global
var chart24h;
var upperbound = null;
var lowerbound = null;
var invisible = []

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
            localStorage.setItem('point', JSON.stringify(point));
            // //transform object to array
            pieinfo = []
            barinfo = []
            _.forEach(point, function(value, index) {
                console.log(index)
                    if (index != "channel_color") {
                    var name = ''
                    var sum = 0
                    var data = []
    
                    name = value._id
    
                    _.forEach(value.watched_per_ts, function(count) {
                        var counter = count.counter
                        sum = sum + counter
                        data.push([count.timestamp * 1000, counter])
                    });
                    pieinfo.push({
                        'name': value._id,
                        'y':sum,
                        'color': point.channel_color[value._id]
                    }) 
                    data.sort(function(a, b) {
                        return a[0] - b[0];
                      });

                    chart24h.addSeries({'name': name, 'data': data, 'type': 'column', 'color': point.channel_color[name]})
                }
            });
              

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
    boost: {
        useGPUTranslations: true
    },
    chart: {
        renderTo: 'graph24h',
        zoomType: 'x',
        events: {
            load: requestData24h,
            selection: function(event) {
                
                if(event.xAxis != null){
                    lowerbound = event.xAxis[0].min/1000
                    upperbound = event.xAxis[0].max/1000
                } else {
                    lowerbound, upperbound = null
                }
             
                updatepie();
            }
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
                legendItemClick: function (e) {
                    var chart = this.chart,
                    index = this.index;
                  
                    selectchannelname =  this.name;
                    if (this.visible) {
                        invisible.push(selectchannelname);
                    } else{
                        var index = invisible.indexOf(selectchannelname);
                        invisible.splice(index, 1);
                    }
                    
                   updatepie();
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

function updatepie() {

    var piedata = JSON.parse(localStorage.getItem('point'));
    var pieinfo = []
    _.forEach(piedata, function(value, index) {
        if ((index != 'channel_name') && (!_.includes(invisible, value._id))) {
            var sum = 0
            name = value._id

            _.forEach(value.watched_per_ts, function(count) {
                if(lowerbound != null){
                    if ((count.timestamp >= lowerbound) &&  (count.timestamp <= upperbound)) {
                        sum = sum + count.counter
                    }
                } else {
                    sum = sum + count.counter
                }
            });
            pieinfo.push({
                'name': value._id,
                'y':sum,
                'color': piedata.channel_color[value._id]
            })     
        }
    });
    chart24h.series[0].update({data:pieinfo}, true);
}