@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-10 col-md-offset-1">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <b>
                        Welcome
                    </b>
                </div>

                <div class="panel-body">
                    Your Application's Landing Page.
                </div>
            </div>
        </div>
    </div>
</div>

<link rel="stylesheet" type="text/css" href="{{url('/css/welcome.css')}}">

@endsection
