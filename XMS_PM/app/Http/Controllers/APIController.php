<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Events\ClientUpload;

use App\Events\ServerUpload;


class APIController extends Controller
{
    public function clientUpload (Request $request)
	{
		// takes client_record[] as an array
		if ($request->hasFile('client_record')) {
			$filename = array();
	        $files = $request->file('client_record');

	        // loop in each file and push it in an array
		    foreach($files as $file){
	    		array_push($filename, $file->getClientOriginalName());	
		    }

		    // return the names in an array to the listener
            return event(new ClientUpload($filename));
        }
	}

	public function serverUpload (Request $request)
	{
		return event(new ServerUpload($request));
	}
}
