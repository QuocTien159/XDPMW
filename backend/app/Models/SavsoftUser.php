<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class SavsoftUser extends Model
{
    use HasApiTokens;
    protected $table = 'savsoft_users';

   
    protected $primaryKey = 'uid'; 

    
    public $timestamps = false; 

    protected $fillable = [
        'studentid', 'first_name', 'last_name', 'password', 'email', 'role', 'status', 'facultyid', 'classid',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }
}