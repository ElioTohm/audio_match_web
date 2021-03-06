@extends('layouts.app')

@section('content')
<div class="inner-main container">
	<div class="row">
		<div class="col-md-12 ">
			<div class="panel panel-default">
				<div id="container" style="width:100%; height:400px;"></div>
			</div>
			<div class="panel panel-default">
				<nav id="menu"></nav>
				<div id="map"></div>
			</div>
			<div class="panel panel-default">
					<table class="table table-bordered">
					<thead>
						<tr>
						<th>client id</th>
						<th>channel watched</th>
						</tr>
					</thead>
					<tbody>

					</tbody>
					</table>
			</div>
		</div>
	</div>
</div>

<script src="{{url('/js/lodash.min.js')}}"></script>
<script src="{{url('/js/livegraph.js')}}"></script>
@endsection
