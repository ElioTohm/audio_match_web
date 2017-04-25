<?php

namespace App\Http\Controllers;

use App\Http\Requests;

use Illuminate\Http\Request;

use App\Record;

use App\Role;
use App\Permission;
use App\User;

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
        // $records = Record::where('timestamp', '>', $time - 7*24*60*60  )
        //                 ->where('confidence', '>', 5)
        //                 ->get(['channel_name','timestamp','confidence']);


        $records = Record::where('confidence', '>', 5)
                        ->get(['channel_name','timestamp','confidence']);

        $records = Record::raw(function ($collection) {
            return $collection->aggregate(
                [
                    [
                        '$match' => [
                            'confidence' => ['$gt' => 5]
                        ],
                    ],
                    [
                        '$group' => [
                            '_id' => ['timestamp' => '$timestamp', 'channel' => '$channel_name'],
                            'count' => [
                                '$sum' => 1
                            ],
                        ]
                    ],
                    [
                        '$group' => [
                            '_id' => '$_id.channel',
                            'timestamps' => [
                                '$push' => [
                                    'timestamp' => '$_id.timestamp' ,
                                    'count' => '$count'
                                ],
                            ]
                        ]
                    ]
                ]
            );
        });

        return array ('records' => $records, "channel_color" => Record::$COLOR_ARRAY);
    }

}
