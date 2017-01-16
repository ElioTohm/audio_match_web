<?php

namespace App\Listeners;
use App\Http\Requests;
use App\Events\ClientUpload;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Client;

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
        $response = $client->request('POST', 'http://httpbin.org/post', [
            'form_params' => [
                    'records' => $clientupload->request
                ]
            ]);

        return $response;
    }
}
