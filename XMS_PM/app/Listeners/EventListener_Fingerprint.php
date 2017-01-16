<?php

namespace App\Listeners;

use App\Events\ServerUpload;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use GuzzleHttp\Client;

class EventListener_Fingerprint
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
     * @param  ServerUpload  $event
     * @return void
     */
    public function handle(ServerUpload $event)
    {
        $client = new Client();
        $response = $client->post('http://127.0.0.3:8000/matching/fingerprint/');
        
        return $response;
    }
}
