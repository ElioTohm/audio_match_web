<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Record;

class GraphController extends Controller
{
    public function index()
    {
        return view('graph.graph');
    }

    public function getData()
    {
        $records = Record::where('confidence', '>', 900)->get();
        return $records;
    }
}
