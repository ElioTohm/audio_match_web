var chart; // global
function requestData() {
    $.ajax({
        url: '/getdata',
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
            chart.series[0].setData(multiArray, true);
            
            // call it again after one second
            setTimeout(requestData, 1000);    
        },
        cache: false
    });
}
chart = new Highcharts.Chart({
    credits: {
        enabled: false
    },
    chart: {
        renderTo: 'container',
        events: {
            load: requestData
        },
        options3d: {
            enabled: true,
            alpha: 45,
            beta: 0
        }
    },
    title: {
        text: 'Channel watched'
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
        data: [],
        center: [100, 80],
        size: 100,
        showInLegend: false,
        dataLabels: {
            enabled: false
        }
    }],

});