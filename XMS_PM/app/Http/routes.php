<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::post('/report', 'ReportController@getReportData');	

Route::auth();

Route::group(['middleware' => ['auth']], function()
{
	//home route
	Route::get('/home', 'HomeController@index');
	Route::post('/homegraph' , 'HomeController@getData');

	//graph route
	Route::get('/livegraphs', 'LiveGraphController@index');
	Route::post('/getdata', 'LiveGraphController@getData');

	//map route
	Route::get('/livemap', 'LiveMapController@index');
	Route::get('/livemapgd', 'LiveMapController@getData');
	Route::get('/livemapdr', 'LiveMapController@refreshData');

	//clients details
	Route::get('/clientsdetails', 'ClientsDetailsController@index');
    Route::post('/updateclient', 'ClientsDetailsController@updateClient');

    //report page
    Route::get('/report', 'ReportController@index');

});
