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
        $records = Record::where('timestamp', '>', $time - 7*24*60*60  )
                        ->where('confidence', '>', 5)
                        ->get(['channel_name','timestamp','confidence']);
        
        $condition = array(
            array( 
                '$match' => array(
                    'timestamp' => array(
                        '$gte' =>  $from_date,
                        '$lt' => $to_date
                    ),
                    'confidence'=> array(
                        '$gte' =>  5,
                    )
                )
            ),
            array( 
                '$group'=> array( 
                    '_id'=> array(
                        'timestamp'=> '$timestamp',
                        'channel_name'=> array(
                                '$cond'=> [ array( '$gt'=> [ '$confidence', 200 ] ), '$channel_name', 'Other' ]
                            )
                    ), 
                    'client_id'=> array( 
                        '$addToSet'=> '$client_id' 
                    )
                )
            ),
            array(
                $project=> array(
                    'client_id'=> 1,
                    'watchedcount'=> array( $size=> "$client_id" )
                )
            ),
            array(
                '$redact' => array(
                    '$cond'=> [array( '$eq'=> [ '$_id.channel_name', 'Muted' ] ),'$$PRUNE','$$KEEP']
                )
            )
        );

        return $records;
    }

}
