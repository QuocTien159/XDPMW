<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/users', [UserController::class, 'index']);
Route::get('/users/{id}', [UserController::class, 'show']);
Route::post('/users', [UserController::class, 'store']);
Route::put('/users/{id}/block', [UserController::class, 'block']);
Route::put('/users/{id}/profile', [UserController::class, 'updateProfile']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);
Route::post('/login', [UserController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [UserController::class, 'logout']);

use App\Http\Controllers\Api\ExamController;
Route::get('/exams', [ExamController::class, 'index']);
Route::post('/exams', [ExamController::class, 'store']);
Route::get('/exams/{id}/check-attempt', [ExamController::class, 'checkAttempt']);
Route::post('/exams/{id}/submit', [ExamController::class, 'submitExam']);
Route::put('/exams/{id}', [ExamController::class, 'update']);
Route::delete('/exams/{id}', [ExamController::class, 'destroy']);
Route::get('/results', [ExamController::class, 'allResults']);

use App\Http\Controllers\Api\QuestionController;
Route::get('/exams/{exam_id}/questions', [QuestionController::class, 'index']);
Route::post('/exams/{exam_id}/questions', [QuestionController::class, 'store']);
Route::delete('/questions/{question_id}', [QuestionController::class, 'destroy']);