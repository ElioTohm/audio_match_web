$('a').click(function () {
    $('.modal-title').html('Update client : ' + $(this).attr('id'));
    $('#name').val($(this).attr('clientname').trim());
    $('#lon').val($(this).attr('lon').trim());
    $('#lat').val($(this).attr('lat').trim());
    $('#btn-updateclient').attr('clientid', $(this).attr('id').trim());
});
$('#btn-updateclient').click(function () {
    var datasent = {"client_id" : $(this).attr('clientid'),
                    "name" : $('#name').val(),
                    "lon" : $('#lon').val(),
                    "lat" : $('#lat').val()
                };

    $.ajax(
    {
        url : "updateclient",
        type: "POST",
        contentType: "json",
            processData: false,
        data: JSON.stringify(datasent),
        headers: {
           'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success:function(data)
        {
            console.log(data);
            var clientid = $('#btn-updateclient').attr('clientid');
            $('[rowclientid='+clientid+']').html(
                '<td>'+clientid+'</td>'+
                '<td>'+$('#name').val()+'</td>'+
                '<td>'+$('#lon').val()+'</td>'+
                '<td>'+$('#lat').val()+'</td>'+
                '<td><a id="'+clientid+'" clientname="'+$('#name').val()+'" lon="'+$('#lon').val()+'" lat="'+$('#lat').val()+'" data-toggle="modal" data-target="#modal-updateclient"><span class="glyphicon glyphicon-pencil"></span></a></td>'
            );
        },
        error:function (error)
        {
            console.log(error['responseText']);
        }
    });
});
