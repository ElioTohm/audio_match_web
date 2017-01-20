<?php

namespace App\Listeners;
use App\Http\Requests;
use App\Events\ClientUpload;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Client;
use App\Record;

class EventListener_Match
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  ClientUpload  $request
     * @return 
     */
    public function handle(ClientUpload $clientupload)
    {
        //sends post request to python server with names of files in an array
        $client = new Client();
        $response = $client->request('POST', 'http://10.0.2.15:8000/matching/match/', 
            [
               'auth' => [
                    'elio', 
                    '201092elio'
                ],
               'json' => [
                    'records' => 
                        $clientupload->request
               ]
            ]);
        // //save the response to mongo
        $result = json_decode($response->getBody(), true);
        if(sizeof($result) > 1) {
            foreach ($result as $key => $value) {
                $record = new Record;
                $record->timestamp = $value['timestamp'];
                $record->client_id = $value['client_id'];
                $record->confidence = $value['confidence'];
                $record->file_sha1 = $value['file_sha1'];
                $record->offset_seconds = $value['offset_seconds'];
                $record->channel_id = $value['channel_id'];
                $record->match_time = $value['match_time'];
                $record->offset = $value['offset'];
                $record->server_record_id = $value['record_id'];
                $record->save();
            }
            
            return $response->getStatusCode();    
        } else {
            return 500;
        }
        
    }
}
