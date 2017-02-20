@extends('layouts.app')

@section('content')
<div class="main">
	<div class="container">
	    <div class="row">
	        <div class="col-md-12 ">
	            <div class="panel panel-default">
	                <div id="container" style="width:100%; height:400px;"></div>
	            </div>
	        </div>
	    </div>
	</div>	
</div>

<script src="{{url('/js/graph.js')}}"></script>
@endsection
