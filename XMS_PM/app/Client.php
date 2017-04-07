<?php

namespace App;

use Jenssegers\Mongodb\Eloquent\Model as Moloquent;

class Client extends Moloquent
{
    //
    protected $connection = 'mongodb';
    protected $collection = 'clients';
    
}
