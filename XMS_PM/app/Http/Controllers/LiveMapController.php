<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Record;

use App\Client;

class LiveMapController extends Controller
{
    public function index()
    {
        return view('livegraph.livemap');
    }

    /*
    *  getData returns the json object required for Mapbox with channels realted colors
    */
    public function getData()
    {
        //return json object $result
        $result = array(
            "channelcolor" => Record::$COLOR_ARRAY,
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
                        ->groupBy('client_id')
                        ->get(['client_id', 'channel_name','confidence']);

        $features = array();

        foreach ($records as $record) {
            // get client information from clients collection
            $clientid = (int)$record->client_id;
            $client = Client::find($clientid);

            array_push($clients_list, $clientid);
            $color = '';
            $channel_name = '';

            if (sizeof($client) > 0){
                $color = Record::$COLOR_ARRAY['Muted'];
                $channel_name = 'Muted';
                if ($record->confidence >= 50) {
                    $color = Record::$COLOR_ARRAY[$record->channel_name];
                    $channel_name = $record->channel_name;
                } elseif ($record->confidence > 5) {
                    $color = Record::$COLOR_ARRAY['Other'];
                    $channel_name = 'Other';
                }

                array_push($features,
                    array(
                        "type"=> "Feature",
                        "properties"=> array(
                            "icon"=> $channel_name,
                            "icon-color"=> $color,
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
                            "icon-color"=> Record::$COLOR_ARRAY['Offline'],
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
