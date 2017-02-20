@extends('layouts.app')

@section('content')
<div class="container-fluid">
    <div class="row">
        <div class="col-md-6">
            <div class="well">
                <div class="panel panel-default">
                    <div id="graph1h" style="width:100%; height:400px;"></div>
                </div>    
            </div>
        </div>
        <div class="col-md-6">
            <div class="well">
                <div class="panel panel-default">
                    <div id="graph24h" style="width:100%; height:400px;"></div>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="{{url('/js/home.js')}}"></script>
@endsection
