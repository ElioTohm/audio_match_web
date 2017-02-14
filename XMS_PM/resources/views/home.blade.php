@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-10 col-md-offset-1">
            <div class="panel panel-default">
                <div id="container" style="width:100%; height:400px;"></div>
            </div>
        </div>
    </div>
</div>
<!-- <script type="text/javascript">
    var chart; // global

    $.ajax({
        url: '/getdata',
        success: function(point) {
            var info = point.map(function(a) {return parseInt(a.channel_id);});
            // add the point
            var hist = {};
            info.map( function (a) { if (a in hist) hist[a] ++; else hist[a] = 1; } );
            var value = $.map(hist, function(value, index) {
                            return value;
                        });
            
            console.log(info);
            console.log(hist);

            multiArray = [];
            for(var key in hist) { multiArray.push([ key, hist[key] ]); }

            console.log(multiArray);
            
            chart = new Highcharts.Chart({
                credits: {
                    enabled: false
                },
                chart: {
                    renderTo: 'container',
                    type: 'pie',
                    options3d: {
                        enabled: true,
                        alpha: 45,
                        beta: 0
                    }
                },
                title: {
                    text: 'Channel watched'
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                xAxis: {
                    type: 'channel id',
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
                        }
                    }
                },
                series: [{
                    type: 'pie',
                    name: 'records',
                    data: multiArray,
                }]
            }); 
        },
        error:function(data) {
            console.log(data['responseText']);
        },
        cache: false
    });
</script> -->

<script type="text/javascript">
    var chart; // global
    function requestData() {
        $.ajax({
            url: '/getdata',
            success: function(point) {
               var info = point.map(function(a) {return parseInt(a.channel_id);});
                // add the point
                var hist = {};
                info.map( function (a) { if (a in hist) hist[a] ++; else hist[a] = 1; } );
                var value = $.map(hist, function(value, index) {
                                return value;
                            });
                
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
</script>
@endsection
