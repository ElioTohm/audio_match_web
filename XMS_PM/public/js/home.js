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
            
            point['records'].forEach(function(element) {
                var channel = $.map(element, function(value, index) {
                                return [value];
                            });
                var timestamps = [];
                
                channel[1].forEach(function (subelement) {
                    console.log(subelement);    
                    timestamps.push($.map(subelement, function(value, index) {
                        if (index == 'timestamp') {
                            return [value*1000];
                        }
                        return [value];
                    }));
                });
                
                chart24h.addSeries({
                    name: channel[0],
                    data: timestamps,
                    type: 'spline',
                    color: point['channel_color'][channel[0]]
                }); 
            }, this);
            
            //save current fetched data
            fetched_data = point['records'];
            current_data = point['records'];

            // add array to series data
            // chart24h.series[0].setData(channelCountArray, true);

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
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        center: [15, 15],
        size: 100,
    }],
});
chart24h.showLoading('Loading...');
