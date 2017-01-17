<?php

namespace App;

use Jenssegers\Mongodb\Eloquent\Model as Moloquent;

class Record extends Moloquent
{
    //
    protected $connection = 'mongodb';

    protected $collection = 'records';
}
