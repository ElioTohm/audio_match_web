<?php

namespace App\Http\Controllers;

use App\Http\Requests;

use Illuminate\Http\Request;

use App\Record;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('home');
    }


    public function getData(Request $request)
    {
        $data = json_decode($request->getContent(),true);

        $time = time();
        $data = json_decode($request->getContent(),true);
        $records = Record::where('channel_name', 'exists', true)->get();
        return $records;
    }
}