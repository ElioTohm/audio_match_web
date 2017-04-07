<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Record;

use App\Client;

class LiveMapController extends Controller
{
    // Array for colors associated with each channel
    private $COLOR_ARRAY = array('LBCI'=>'#25e200','MTV'=>'#e20000','OTV'=>'#faaa00','NBN'=>'#a702b1','ALJADEED'=>'#000000','TL'=>'#d1d1bd','MANAR'=>'#faf500','FUTURE'=>'#0090ed');
               

    public function index()
    {
        return view('map.livemap');
    }

    /*
    *  getData returns the json object required for Mapbox 
    */
    public function getData()
    {
        /*
        * get all records group by client_id aggregated with $last
        * IOW: get last watched channel by user
        */
        $records = Record::where('confidence', '>', 5)
                        ->groupBy('client_id')
                        ->get(['client_id','channel_name','timestamp']);

        $features = array();

        foreach ($records as $record) {
            // get client information from clients collection 
            $client = Client::find((int)$record->client_id);

            if (sizeof($client) > 0){
                array_push($features, array(
                        "type"=> "Feature",
                        "properties"=> array(
                            "icon"=> $record->channel_name,
                            "icon-color"=> $this->COLOR_ARRAY[$record->channel_name],
                            "description"=> $client->name
                        ),
                        "geometry"=> array(
                            "type"=> "Point",
                            "coordinates"=> [$client->lon, $client->lat]
                        )
                    )
                );   
            }    
        }

        //return json object $result 
        $result = array(
            "type" => "FeatureCollection",
            "features" => $features
        );
       	
        return $result;
    }
}
