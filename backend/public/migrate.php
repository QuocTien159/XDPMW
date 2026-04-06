<?php
// File này dùng để chạy migration từ trình duyệt
use Illuminate\Support\Facades\Artisan;

// Load Laravel
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

echo "<h1>Đang thực hiện Migration...</h1>";

try {
    Artisan::call('migrate', ["--force" => true]);
    echo "<pre>" . Artisan::output() . "</pre>";
    echo "<h2 style='color:green'>Thành công!</h2>";
} catch (\Exception $e) {
    echo "<h2 style='color:red'>Lỗi:</h2>";
    echo "<pre>" . $e->getMessage() . "</pre>";
}
