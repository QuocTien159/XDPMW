<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SavsoftUser; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
   
    public function index()
    {
        
        $users = SavsoftUser::all(); 
        
        return response()->json([
            'status' => 'success',
            'data' => $users
        ], 200);
    }

   
    public function show($id)
    {
        
      $user = SavsoftUser::find($id);

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy sinh viên này'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $user
        ], 200);
    }
   public function login(Request $request)
    {
        $request->validate([
            'mssv' => 'required',
            'password' => 'required'
        ]);

      
        $user = SavsoftUser::where('studentid', $request->mssv)->first();

        $isValidPassword = false;
        if ($user) {
            if ($user->password === md5($request->password) || $user->password === $request->password) {
                $isValidPassword = true;
            } else {
                try {
                    $isValidPassword = Hash::check($request->password, $user->password);
                } catch (\Exception $e) {
                    
                    $isValidPassword = false;
                }
            }
        }

        if (!$user || !$isValidPassword) {
            return response()->json([
                'status' => 'error',
                'message' => 'Sai tài khoản hoặc mật khẩu'
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Đăng nhập thành công',
            'data' => $user,
            'token' => $token
        ], 200);
    }
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'đăng xuất thành công'
        ], 200);
    }

    /** Thêm sinh viên mới */
    public function store(Request $request)
    {
        $request->validate([
            'studentid' => 'required|string|unique:savsoft_users,studentid',
            'first_name' => 'required|string',
            'last_name'  => 'required|string',
            'email'      => 'required|email|unique:savsoft_users,email',
            'password'   => 'required|string|min:6',
            'facultyid'  => 'required|integer',
            'classid'    => 'required|integer',
        ]);

        $user = SavsoftUser::create([
            'studentid'  => $request->studentid,
            'first_name' => $request->first_name,
            'last_name'  => $request->last_name,
            'email'      => $request->email,
            'password'   => Hash::make($request->password),
            'role'       => 'student',
            'facultyid'  => $request->facultyid ? (int)$request->facultyid : null,
            'classid'    => $request->classid ? (int)$request->classid : null,
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Thêm sinh viên thành công!',
            'data'    => $user,
        ]);
    }

    /** Chặn / Bỏ chặn sinh viên (toggle trạng thái blocked) */
    public function block($id)
    {
        $user = SavsoftUser::find($id);
        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy sinh viên'], 404);
        }

        // Dùng cột `status` nếu có, nếu chưa có ta tạm thời dùng role
        $currentStatus = $user->status ?? 'active';
        $newStatus = $currentStatus === 'blocked' ? 'active' : 'blocked';
        \DB::table('savsoft_users')->where('uid', $id)->update(['status' => $newStatus]);

        return response()->json([
            'status'     => 'success',
            'new_status' => $newStatus,
            'message'    => $newStatus === 'blocked' ? 'Đã chặn sinh viên!' : 'Đã bỏ chặn sinh viên!',
        ]);
    }

    /** Xóa sinh viên */
    public function destroy($id)
    {
        $user = SavsoftUser::find($id);
        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy sinh viên'], 404);
        }

        $user->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Đã xóa sinh viên!',
        ]);
    }

    public function updateProfile(\Illuminate\Http\Request $request, $id)
    {
        $user = \App\Models\SavsoftUser::find($id);
        if (!$user) {
            return response()->json(["status" => "error", "message" => "Khong tim thay"], 404);
        }
        $request->validate([
            "first_name"   => "required|string",
            "last_name"    => "required|string",
            "email"        => "required|email|unique:savsoft_users,email," . $id . ",uid",
            "new_password" => "nullable|string|min:6",
        ]);
        $user->first_name = $request->first_name;
        $user->last_name  = $request->last_name;
        $user->email      = $request->email;
        if ($request->filled("new_password")) {
            $user->password = \Illuminate\Support\Facades\Hash::make($request->new_password);
        }
        $user->save();
        return response()->json([
            "status" => "success",
            "message" => "Cap nhat thanh cong!",
            "data" => $user,
        ]);
    }
}
