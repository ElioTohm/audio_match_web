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
		if ($request->hasFile('client_record') && $request->file('client_record')->isValid()) {
            return event(new ClientUpload($request->file('client_record')->getClientOriginalName()));
        }
	}

	public function serverUpload (Request $request)
	{
		return event(new ServerUpload($request));
	}
}
