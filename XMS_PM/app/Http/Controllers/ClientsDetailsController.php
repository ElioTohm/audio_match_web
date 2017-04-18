<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Client;

class ClientsDetailsController extends Controller
{
    /*
    * @return clients detials page
    */
    public function index ()
    {
    	$clients = Client::all()->sortBy('id');

    	return view('clients.clientsdetails')->with('clients', $clients);
    }

    /*
    * @Update client
    */
    public function updateClient (Request $request)
    {
        $data = json_decode($request->getContent(),true);

        $client = Client::find((int)$data['client_id']);
        $client->name = $data['name'];
        $client->lon = $data['lon'];
        $client->lat = $data['lat'];

        $client->save();

        return array('reponse' => $client);
    }
}
