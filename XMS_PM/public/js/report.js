$('#submit_time').click(function () {
    $(this).after(function () {
        return '<i class="fa fa-spinner fa-spin" style="font-size:24px"></i>';
    });
    var datasent = {
        'from_data': new Date($('#from_date').val()).getTime() / 1000,
        'to_data': new Date($('#to_date').val()).getTime() / 1000
    }

    $.ajax({
        url: "/report",
        type: "POST",
        contentType: "json",
        processData: false,
        data: JSON.stringify(datasent),
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function (data) {
            console.log(data);

            $('tbody').html("");
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[i].clients.length; j++) {
                    var time = data[i].clients[j].timestamp * 30;
                    var hours = Math.floor(time / 3600);
                    var minutes = Math.floor((time - (hours * 3600)) / 60);
                    var seconds = time - minutes * 60 - hours * 3600;

                    var element = "<tr><td>" + data[i]._id.channel_name + "</td><td>" + data[i].clients[j].client_id + "</td><td>" + hours + "</td><td>" + minutes + "</td><td>" + seconds + "</td></tr>";
                    $('tbody').append(element);
                }
            }
            $('.fa-spin').remove();
        },
        error: function (error) {
            console.log(error['responseText']);
        }
    });

});