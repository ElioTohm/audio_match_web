@extends('layouts.app')

@section('content')
<nav id='filter-group' class='filter-group'></nav>
<div id="map"></div>              

<script src='https://api.tiles.mapbox.com/mapbox-gl-js/v0.34.0/mapbox-gl.js'></script>
<link href='https://api.tiles.mapbox.com/mapbox-gl-js/v0.34.0/mapbox-gl.css' rel='stylesheet' />
<link rel="stylesheet" type="text/css" href="{{url('/css/livemap.css')}}">
<script src="{{url('/js/livemap.js')}}"></script>

@endsection
