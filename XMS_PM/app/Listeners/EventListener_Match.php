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
        $client = new Client();
        $response = $client->request('POST', 'http://127.0.0.3:8000/matching/match/', [
            'form_params' => [
                    'records' => $clientupload->request
                ]
            ]);
        //save the response to mongo

        // $record = new Record;
        // $record->user_id = 12;
        // $record->save();
        
        return $response->getBody();
    
    }
}
