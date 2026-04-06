<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SavsoftExam extends Model
{
    protected $table = 'savsoft_exams';

    public $timestamps = false; // Based on schema.json, no timestamps by default

    protected $fillable = [
        'title',
        'description',
        'num_questions',
        'status',
        'categoryid',
        'duration_minutes',
        'pass_percentage',
        'max_attempts',
        'start_date',
        'end_date',
        'created_by'
    ];

    /**
     * Check nếu user (uid) còn quyền thi bài thi này không.
     * @param int $uid
     * @return bool
     */
    public function canUserAttempt(int $uid): bool
    {
        $attemptCount = $this->results()->where('uid', $uid)->count();
        return $attemptCount < $this->max_attempts;
    }

    public function results()
    {
        return $this->hasMany(SavsoftResult::class, 'exam_id', 'id');
    }
}
