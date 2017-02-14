<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Events\ClientUpload;

use App\Events\ServerUpload;

/*
 * Controller used as an API for the client and the server to upload
 * their files to be matched/fingerprinted by the Python framework
 */
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

		    	// push the name of the multiple files uploaded
	    		array_push($filename, $file->getClientOriginalName());
				
				// each file uploaded will be moved to the client_records dir   		
	    		$client_record_name = $file->getClientOriginalName();
	    		$file->move(public_path('client_records'), $client_record_name);
		    }

		    // return the names in an array to the listener
            return event(new ClientUpload($filename));
        }
	}

	public function serverUpload (Request $request)
	{
 		//fire event
		return event(new ServerUpload($request));
	}
}
