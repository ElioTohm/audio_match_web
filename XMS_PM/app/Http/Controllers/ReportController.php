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
      $result = Record::raw(function($collection)
                {
                    return $collection->aggregate(
                      array(
                        array( 
                          '$group' => array( 
                            '_id' => array(
                              'channel_name' => '$channel_name', 
                              'client_id' => '$client_id',
                            ), 
                            'timestamp'=> array( 
                              '$addToSet' => '$timestamp' 
                            ) 
                          )
                        ), 
                        array( 
                          '$group' => array(
                            '_id' => array(
                              'channel_name' => '$_id.channel_name'
                            ), 
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
                    ));
                });
      
      return $result;
    }

}
