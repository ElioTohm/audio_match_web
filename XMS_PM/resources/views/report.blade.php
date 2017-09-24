@extends('layouts.app')

@section('content')
<div class="inner-main container">
	<div class="row">
		<div class="row">
			<h3>filtering</h3>
			<form class="form-inline">
				<div class="input-group">
					<span class="input-group-addon">
						<i class="glyphicon glyphicon-calendar"></i>
					</span>
					<input id="from_date" type="date" class="form-control" name="from_date" placeholder="From Date">
				</div>
				<div class="input-group">
					<span class="input-group-addon">
						<i class="glyphicon glyphicon-calendar"></i>
					</span>
					<input id="to_date" type="date" class="form-control" name="to_date" placeholder="To Date">
				</div>
				<div class="input-group">
					<button type="button" id="submit_time" class="btn btn-primary" >submit</button>
				</div>
			</form>
		</div>
		<br>
		<table class='table table-striped'>
			<thead>
				<tr>
					<th></th>
					<th>Info</th>
					<th></th>
					<th>Duration</th>
					<th></th>
				</tr>
				<tr>
					<th>Channel Name</th>
					<th>Device ID</th>
					<th>Hours</th>
					<th>Minutes</th>
					<th>Seconds</th>
				</tr>
			</thead>
			<tbody>
				
			</tbody>
		</table>
	</div>
</div>

<!-- <script src="{{url('/js/lodash.min.js')}}"></script> -->
<script src="{{url('/js/report.js')}}"></script>

@endsection
