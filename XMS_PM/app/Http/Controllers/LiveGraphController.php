<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Record;

class LiveGraphController extends Controller
{
    public function index()
    {
        return view('livegraph.livegraph');
    }

    public function getData()
    {
    	$time = time();
        $records = Record::whereBetween('timestamp', [$time - 5*60 , $time] )
                            ->where('confidence', '>', 20)
                            ->get();
        return $records;
    }
}
