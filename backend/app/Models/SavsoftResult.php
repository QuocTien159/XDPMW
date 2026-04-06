<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SavsoftResult extends Model
{
    protected $table = 'savsoft_results';

    public $timestamps = false;

    protected $fillable = [
        'uid',
        'exam_id',
        'total_score',
        'percentage',
        'status',
        'start_time',
        'end_time'
    ];

    public function exam()
    {
        return $this->belongsTo(SavsoftExam::class, 'exam_id', 'id');
    }
}
