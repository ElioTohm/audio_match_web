<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Record;

use App\Client;

class LiveMapController extends Controller
{
    // Array for colors associated with each channel
    private $COLOR_ARRAY = array('LBCI'=>'#25e200','MTV'=>'#e20000','OTV'=>'#faaa00','NBN'=>'#a702b1','ALJADEED'=>'#000000','TL'=>'#9370DB','MANAR'=>'#faf500','FUTURE'=>'#0090ed', 'Offline'=>'#808080');
               

    public function index()
    {
        return view('map.livemap');
    }

    /*
    *  getData returns the json object required for Mapbox with channels realted colors
    */
    public function getData()
    {
        //return json object $result 
        $result = array(
            "channelcolor" => $this->COLOR_ARRAY,
            "clientdata" => array(
            "type" => "FeatureCollection",
            "features" => $this->mapBoxData()
            )
        );
       	
        return $result;
    }

    /*
    * Refresh function for mapbox map
    */
    public function refreshData () 
    {
        //return json object $result 
        $result = array(
            "type" => "FeatureCollection",
            "features" => $this->mapBoxData()
        );
        
        return $result;
    }

    /*
    * Get map data from Mongo and set them as objects
    */
    private function mapBoxData ()
    {
        /*
        * get all records group by client_id aggregated with $last
        * IOW: get last watched channel by user
        */
        $clients_list = [];
        $records = Record::where('timestamp', '>', time() - 5*60  )
                        ->where('confidence', '>', 5)
                        ->groupBy('client_id')
                        ->get(['client_id', 'channel_name']);

        $features = array();

        foreach ($records as $record) {
            // get client information from clients collection
            $clientid = (int)$record->client_id; 
            $client = Client::find($clientid);
            
            array_push($clients_list, $clientid);

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
        
        $clients = Client::whereNotIn('_id', $clients_list)->get(['name','lon', 'lat']);
        foreach ($clients as $client) {
            if (isset($client['lon']) && isset($client['lat'])) {
                array_push($features, array(
                        "type"=> "Feature",
                        "properties"=> array(
                            "icon"=> 'Offline',
                            "icon-color"=> $this->COLOR_ARRAY['Offline'],
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

        return $features;
    }


}
