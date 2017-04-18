<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Record;

use App\Client;

class LiveGraphController extends Controller
{
    public function index()
    {
        return view('livegraph.livegraph');
    }

    public function getData()
    {
    	$time = time();
        $records = Record::where('timestamp', '>', $time - 5*60  )
                        ->groupBy('client_id')
                        ->get(['client_id', 'timestamp', 'channel_name', 'confidence'])->sortBy('client_id');

        $clientresult = [];
        $result = [];
        foreach ($records as $record) {
            // get client information from clients collection
            $client = Client::find((int)$record->client_id);
            $color = '';
            $channel_name = '';

            if (sizeof($client) > 0){
                if ($record->confidence >= 50) {
                    $color = Record::$COLOR_ARRAY[$record->channel_name];
                    $channel_name = $record->channel_name;
                } elseif ($record->confidence >= 10 && $record->confidence < 50) {
                    $color = Record::$COLOR_ARRAY['Other'];
                    $channel_name = 'Other';
                } elseif ($record->confidence <= 10 && $record->confidence > 0) {
                    $color = Record::$COLOR_ARRAY['Low volume/unclear'];
                    $channel_name = 'Low volume/unclear';
                } else {
                    $color = Record::$COLOR_ARRAY['Low volume/unclear'];
                    $channel_name = 'Muted';
                }

                array_push($clientresult, array(
                            "channel_name" => $channel_name,
                            "client_id" => $record->client_id,
                            "client_name" => $client->name,
                            "timestamp" => $record->timestamp
                        )
                );
            }
        }

        return array("channel_color" => Record::$COLOR_ARRAY, "clients"=>$clientresult);
    }
}
