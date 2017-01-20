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
        // You can add auth headers to every request of a client
        // $client->setDefaultOption('auth', array('elio', '123123'));
        
        $response = $client->request('POST', 'http://10.0.2.15:8000/matching/fingerprint/',
            [
                'auth' => [
                    'elio', 
                    '201092elio'
            ],
            ]);
        
        return $response->getStatusCode();
    }
}
