<?php

namespace App;

use Jenssegers\Mongodb\Eloquent\Model as Moloquent;

class Record extends Moloquent
{
	// Array for colors associated with each channel
    static public $COLOR_ARRAY = array('LBCI'=>'#25e200','MTV'=>'#e20000','OTV'=>'#faaa00','NBN'=>'#a702b1','ALJADEED'=>'#000000','TL'=>'#9370DB','MANAR'=>'#faf500','FUTURE'=>'#0090ed', 'Offline'=>'#808080', 'Other'=>'#730028', 'Muted'=>'#eeeaaa');

    protected $connection = 'mongodb';
    protected $collection = 'records';

}
