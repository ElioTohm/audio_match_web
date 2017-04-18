@extends('layouts.app')

@section('content')
<div class="main">
	<div class="container">
	    <div class="row">
	        <div class="col-md-12 ">
				<div class="table-responsive">
					<table class="table table-striped ">
						<thead>
							<tr>
							  <th>client id</th>
							  <th>name</th>
							  <th>longitude</th>
							  <th>lattitude</th>
							  <th><span class="glyphicon glyphicon-cog"></span></th>
							</tr>
						</thead>
						<tbody>
							@foreach ($clients as $key => $client)
								<tr rowclientid="{{$client->id}}">
									<td>{{$client->id}}</td>
									<td>{{$client->name}}</td>
									@if(isset($client['lon']) || isset($client['lat']))
										<td>{{$client->lon}}</td>
										<td>{{$client->lat}}</td>
										<td><a id="{{$client->id}}" clientname="{{$client->name}}" lon="{{$client->lon}}" lat="{{$client->lat}} " data-toggle="modal" data-target="#modal-updateclient"><span class="glyphicon glyphicon-pencil"></span></a></td>
									@else
										<td>None</td>
										<td>None</td>
										<td><a id="{{$client->id}}" clientname="{{$client->name}}" lon="None" lat="None" data-toggle="modal" data-target="#modal-updateclient"><span class="glyphicon glyphicon-pencil"></span></a></td>
									@endif
								</tr>
							@endforeach
						</tbody>
					</table>
				</div>
	        </div>
	    </div>
	</div>
</div>

<!-- Modal -->
<div id="modal-updateclient" class="modal fade" role="dialog">
	<div class="modal-dialog">
		<!-- Modal content-->
		<div class="modal-content">
			<div class="modal-header">
				<h4 class="modal-title">Update Client info</h4>
			</div>
			<div class="modal-body">
				<form>
					<div class="form-group">
						<label for="name">Client Name:</label>
						<input type="text" class="form-control" id="name">
					</div>
					<div class="form-group">
						<label for="lon">Longitude:</label>
						<input type="text" class="form-control" id="lon" name="lon">
					</div>
					<div class="form-group">
						<label for="lat">Lattitude:</label>
						<input type="text" class="form-control" id="lat" name="lat">
					</div>
					<button type="button" class="btn btn-primary" id="btn-updateclient" clientid="">Update</button>
				</form>
			</div>
		</div>
	</div>
</div>
<script src="{{url('/js/clientsdetails.js')}}"></script>
<link rel="stylesheet" type="text/css" href="{{url('/css/clientsdetails.css')}}">
@endsection
