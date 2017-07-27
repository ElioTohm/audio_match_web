$('#submit_time').click(function () {

    var datasent = {
        'from_data': 1,
        'to_data': 2
    }

    $.ajax({
    	url : "/report",
        type: "POST",
        contentType: "json",
        processData: false,
        data: JSON.stringify(datasent),
        headers: {
           'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success:function(data)
        {
            $('tbody').html("");
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[i].clients.length; j++) {
                    console.log(data[i]);
                    var time = data[i].clients[j].timestamp * 30 ;
                    var minutes = Math.floor(time / 60);
                    var seconds = time - minutes * 60;
                    var hours = Math.floor(time / 3600);

                    var element = "<tr><td>"+i+"</td><td>"+data[i]._id.channel_name+"</td><td>"+data[i].clients[j].client_id+"</td><td>"+hours+"</td><td>"+minutes+"</td><td>"+seconds+"</td></tr>";
                    $('tbody').append(element);
                }
            }
        },
        error:function (error)
        {
            console.log(error['responseText']);
        }
    });

});