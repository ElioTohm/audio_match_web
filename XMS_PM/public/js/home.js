function requestData1h() {
    var token = $('meta[name="csrf-token"]').attr('content');
    $.ajaxSetup({
      headers: {
        'X-CSRF-TOKEN': token
      }
    });
    $.ajax({
        type:'POST',
        url: '/homegraph',
        success: function(point) {
           var info = point.map(function(a) 
            {
                return a.channel_name;
            });
            // add the point
            var hist = {};
            info.map( function (a) { if (a in hist) hist[a] ++; else hist[a] = 1; } );
            var value = $.map(hist, function(value, index) {
                            return value;
                        });
            
            console.log(point);
            console.log(info);
            console.log(hist);

            multiArray = [];
            for(var key in hist) { multiArray.push([ key, hist[key] ]); }

            console.log(multiArray);

            // add the point
            chart1h.series[0].setData(multiArray, true);
            
            // call it again after one second
            setTimeout(requestData1h, 1000);    
        },
        error:function(data)
        {
            console.log(data['responseText']);
        },
        cache: false
    });
}
var chart1h = new Highcharts.Chart({
    credits: {
        enabled: false
    },
    chart: {
        renderTo: 'graph1h',
        events: {
            load: requestData1h()
        },
        options3d: {
            enabled: true,
            alpha: 45,
            beta: 0
        }
    },
    title: {
        text: 'Info for the past hour'
    },
    xAxis: {
        type: 'datetime',
        tickPixelInterval: 150,
        maxZoom: 20 * 1000
    },
    yAxis: {
        minPadding: 0.2,
        maxPadding: 0.2,
        title: {
            text: 'Value',
            margin: 80
        }
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
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    series: [{
        type: 'pie',
        name: 'Records',
        data: []
    }],
});


function requestData24h() {
    var token = $('meta[name="csrf-token"]').attr('content');
    $.ajaxSetup({
      headers: {
        'X-CSRF-TOKEN': token
      }
    });
    $.ajax({
        type:'POST',
        url: '/homegraph',
        success: function(point) {
           var info = point.map(function(a) 
            {
                return a.channel_name;
            });
            // add the point
            var hist = {};
            info.map( function (a) { if (a in hist) hist[a] ++; else hist[a] = 1; } );
            var value = $.map(hist, function(value, index) {
                            return value;
                        });
            
            console.log(point);
            console.log(info);
            console.log(hist);

            multiArray = [];
            for(var key in hist) { multiArray.push([ key, hist[key] ]); }

            console.log(multiArray);

            // add the point
            chart24h.series[0].setData(multiArray, true);
            
            // call it again after one second
            setTimeout(requestData24h, 1000);    
        },
        error:function(data)
        {
            console.log(data['responseText']);
        },
        cache: false
    });
}
var chart24h = new Highcharts.Chart({
    credits: {
        enabled: false
    },
    chart: {
        renderTo: 'graph24h',
        events: {
            load: requestData24h()
        },
        options3d: {
            enabled: true,
            alpha: 45,
            beta: 0
        }
    },
    title: {
        text: 'Info for the last 24h'
    },
    xAxis: {
        type: 'datetime',
        tickPixelInterval: 150,
        maxZoom: 20 * 1000
    },
    yAxis: {
        minPadding: 0.2,
        maxPadding: 0.2,
        title: {
            text: 'Value',
            margin: 80
        }
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
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    series: [{
        type: 'pie',
        name: 'Records',
        data: []
    }],
});