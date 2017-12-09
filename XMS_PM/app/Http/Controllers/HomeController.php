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
        
        $condition = array(
            array( 
                '$match' => array(
                    'timestamp' => array(
                        '$gte' =>  $time - 7*24*60*60,
                    ),
                    'confidence'=> array(
                        '$gte' =>  5,
                    )
                )
            ),
            array(
                '$redact' => array(
                    '$cond'=> [array( '$eq'=> [ '$channel_name', 'Muted' ] ),'$$PRUNE','$$KEEP']
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
                    'channel_pie_score'=>array(
                        '$sum'=> 1
                    ),
                    'client_id'=> array( 
                        '$addToSet'=> '$client_id' 
                    )
                )
            ),
            array(
                '$group'=> array(
                    '_id'=> '$_id.channel_name',
                    'watched_per_ts'=> array(
                        '$push'=>array(
                            'timestamp'=> '$_id.timestamp',
                            'counter'=> array(
                                '$size'=>'$client_id'
                            )
                        )
                    )         
                )
            ),
            array(
                '$sort'=> array('watched_per_ts.timestamp'=> 1)
            ),
        );

        //aggregate data to count the timestamp when the client watched a channel
        $result = Record::raw(function($collection) use ($condition)
        {
            return $collection->aggregate($condition);
        });
        
        $result['channel_color'] = Record::$COLOR_ARRAY;
        
        return $result;
    }

}
