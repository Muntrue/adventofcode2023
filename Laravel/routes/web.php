<?php

use App\Http\Controllers\dayFourController;
use App\Http\Controllers\dayOneController;
use App\Http\Controllers\dayThreeController;
use App\Http\Controllers\dayTwoController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});


Route::get('dayone', [DayOneController::class, 'get']);

Route::get('daytwo-1', [DayTwoController::class, 'partOne']);
Route::get('daytwo-2', [DayTwoController::class, 'partTwo']);

Route::get('daythree-1', [DayThreeController::class, 'partOne']);
Route::get('daythree-2', [DayThreeController::class, 'partTwo']);


Route::get('dayfour-1', [DayFourController::class, 'partOne']);
Route::get('dayfour-2', [DayFourController::class, 'partTwo']);
