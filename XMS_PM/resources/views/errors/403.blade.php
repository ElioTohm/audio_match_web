@extends('layouts.app')

@section('content')
<div class="inner-main container-fluid">
    <div class="row">
        <div class="col-md-12 message">
            	You don't have to permission to proceed
            </div>
        </div>
    </div>
</div>

<link rel="stylesheet" type="text/css" href="{{url('/css/error.css')}}">
@endsection