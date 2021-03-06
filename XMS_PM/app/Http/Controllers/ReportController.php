<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Record;

use App\Client;

class ReportController extends Controller
{
    //
    public function index () 
    {
    	return view('report');
    }

    public function getReportData (Request $request)
    {
      //get data from json
      $data = json_decode($request->getContent(),true);

      $from_date = $data['from_data'];
      $to_date = $data['to_data'] + 86400;

      $condition = array(
                    array( 
                        '$group' => array( 
                            '_id' => array(
                                'channel_name' => array(
                                    'channel_name' => array(
                                        '$cond'=> [ array( '$gt'=> [ '$confidence', 200 ] ), '$channel_name', 'Other' ]
                                    )
                                    ),
                                'client_id' => '$client_id',
                            ), 
                            'timestamp'=> array( 
                                '$addToSet' => '$timestamp' 
                            )
                        )
                    ), 
                    array( 
                        '$group' => array(
                            '_id' => '$_id.channel_name', 
                            'clients' => array(
                                '$addToSet' => array(
                                    'client_id' => '$_id.client_id', 
                                    'timestamp' => array(
                                        '$size' => '$timestamp'
                                    )
                                )
                            )    
                        )
                    ),
                    array(
                        '$redact' => array(
                            '$cond'=> [array( '$eq'=> [ '$_id.channel_name', 'Muted' ] ),'$$PRUNE','$$KEEP']
                        )
                    )
                  );

      if (!is_null($from_date) && ($to_date > 86400)) {
        array_unshift($condition, array( 
          '$match' => array(
            'timestamp' => array(
                '$gte' =>  $from_date,
                '$lt' => $to_date
              )
            )
          )
        );
      } elseif (!is_null($from_date)) {
        array_unshift($condition, array( 
          '$match' => array(
            'timestamp' => array(
                '$gte' =>  $from_date,
              )
            )
          )
        );
      } elseif ($to_date > 86400) {
        array_unshift($condition, array( 
          '$match' => array(
            'timestamp' => array(
                '$lt' => $to_date,
              )
            )
          )
        );
      }
      
      //aggregate data to count the timestamp when the client watched a channel
      $result = Record::raw(function($collection) use ($condition)
                {
                    return $collection->aggregate($condition);
                });
      
      return $result;
    }

}
