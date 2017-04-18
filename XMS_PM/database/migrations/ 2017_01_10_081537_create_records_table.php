<?php

use Jenssegers\Mongodb\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRecordsTable extends Migration
{
     /**
     * The name of the database connection to use.
     *
     * @var string
     */
    protected $connection = 'mongodb';

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {        
        Schema::connection($this->connection)
        ->table('records', function (Blueprint $collection) 
        {
            $collection->index('timestamp');

            $collection->integer('client_id');

            $collection->integer('confidence');

            $collection->string('file_sha1');

            $collection->float('offset_seconds');
            
            $collection->integer('channel_id');
            
            $collection->float('match_time');
            
            $collection->integer('offset');
            
            $collection->integer('server_record_id');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::connection($this->connection)
        ->table('records', function (Blueprint $collection) 
        {
            $collection->drop();
        });
    }
}