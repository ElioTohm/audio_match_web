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
        $records = Record::where('confidence', '>', 200)->get();
        return $records;
    }
}
