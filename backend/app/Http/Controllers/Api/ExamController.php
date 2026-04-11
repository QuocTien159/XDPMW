<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SavsoftExam;
use App\Models\SavsoftResult;

class ExamController extends Controller
{
    public function index()
    {
        $exams = SavsoftExam::withCount('results')->get();
        // Add a has_results boolean to each exam
        $exams->map(function ($exam) {
            $exam->has_results = $exam->results_count > 0;
            return $exam;
        });

        return response()->json([
            'status' => 'success',
            'data' => $exams
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'duration_minutes' => 'required|integer',
            'num_questions' => 'required|integer',
            'status' => 'required|string',
            'categoryid' => 'required|integer',
            'pass_percentage' => 'required|numeric',
            'max_attempts' => 'required|integer|min:1',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        $exam = SavsoftExam::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? '',
            'duration_minutes' => $validated['duration_minutes'],
            'num_questions' => $validated['num_questions'],
            'status' => $validated['status'],
            'categoryid' => $validated['categoryid'],
            'pass_percentage' => $validated['pass_percentage'],
            'max_attempts' => $validated['max_attempts'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'created_by' => 0
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Bài thi đã được tạo thành công!',
            'data' => $exam
        ]);
    }

    /**
     * Kiểm tra xem user có thể thi bài thi này không.
     * GET /exams/{id}/check-attempt?uid={uid}
     */
    public function checkAttempt(Request $request, $id)
    {
        $uid = $request->query('uid');
        if (!$uid) {
            return response()->json(['status' => 'error', 'message' => 'Thiếu thông tin người dùng'], 400);
        }

        $exam = SavsoftExam::find($id);
        if (!$exam) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy bài thi'], 404);
        }

        // Kiểm tra thời gian thi hợp lệ
        $now = now();
        if ($exam->start_date && $now->lt(\Carbon\Carbon::parse($exam->start_date))) {
            return response()->json([
                'status' => 'success',
                'can_attempt' => false,
                'reason' => 'not_started',
                'message' => 'Bài thi chưa bắt đầu! Thời gian mở thi: ' . \Carbon\Carbon::parse($exam->start_date)->format('d/m/Y H:i')
            ]);
        }

        if ($exam->end_date && $now->gt(\Carbon\Carbon::parse($exam->end_date))) {
            return response()->json([
                'status' => 'success',
                'can_attempt' => false,
                'reason' => 'expired',
                'message' => 'Bài thi đã kết thúc vào lúc: ' . \Carbon\Carbon::parse($exam->end_date)->format('d/m/Y H:i')
            ]);
        }

        // Kiểm tra số lần thi
        $attemptCount = $exam->results()->where('uid', $uid)->count();
        $canAttempt = $attemptCount < $exam->max_attempts;

        return response()->json([
            'status' => 'success',
            'can_attempt' => $canAttempt,
            'attempts_used' => $attemptCount,
            'max_attempts' => $exam->max_attempts,
            'remaining_attempts' => max(0, $exam->max_attempts - $attemptCount),
            'reason' => $canAttempt ? 'ok' : 'max_reached',
            'message' => $canAttempt
                ? "Bạn còn " . ($exam->max_attempts - $attemptCount) . " lượt thi."
                : "Bạn đã dùng hết " . $exam->max_attempts . " lượt thi của bài này!"
        ]);
    }

    public function update(Request $request, $id)
    {
        $exam = SavsoftExam::find($id);

        if (!$exam) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy bài thi'], 404);
        }

        if ($exam->results()->exists()) {
            return response()->json(['status' => 'error', 'message' => 'Không thể sửa bài thi đã có thí sinh tham gia!'], 400);
        }

        $exam->title = $request->input('title', $exam->title);
        $exam->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật thành công!',
            'data' => $exam
        ]);
    }

    public function destroy($id)
    {
        $exam = SavsoftExam::find($id);

        if (!$exam) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy bài thi'], 404);
        }

        // Even if results exist, allow destruction based on new requirement.
        // It's checked and warned at the frontend before hitting this API.
        
        $exam->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Xoá bài thi thành công!'
        ]);
    }

    /**
     * Nộp bài thi — tính điểm và lưu vào savsoft_results + savsoft_user_answers
     * POST /exams/{id}/submit
     * Body: { uid, answers: { question_id: selected_option_id, ... } }
     */
    public function submitExam(Request $request, $id)
    {
        $uid = $request->input('uid');
        $answers = $request->input('answers', []);

        $exam = SavsoftExam::find($id);
        if (!$exam) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy bài thi'], 404);
        }

        // Kiểm tra lượt thi còn không
        $attemptCount = $exam->results()->where('uid', $uid)->count();
        if ($attemptCount >= $exam->max_attempts) {
            return response()->json(['status' => 'error', 'message' => 'Bạn đã hết lượt thi!'], 403);
        }

        // Lấy tất cả câu hỏi + đáp án đúng
        $questions = \DB::table('savsoft_questions')->where('exam_id', $id)->get();
        $totalScore = 0;
        $maxScore = 0;

        foreach ($questions as $q) {
            $marks = $q->marks > 0 ? $q->marks : 1; // Mặc định 1 điểm nếu chưa có điểm
            $maxScore += $marks;
            
            $selectedOptionId = $answers[$q->id] ?? null;
            if ($selectedOptionId) {
                $opt = \DB::table('savsoft_questions_options')
                    ->where('id', $selectedOptionId)
                    ->first();
                if ($opt && $opt->is_correct) {
                    $totalScore += $marks;
                }
            }
        }

        $percentage = $maxScore > 0 ? round(($totalScore / $maxScore) * 100, 2) : 0;
        
        // Ép kiểu float để so sánh chính xác
        $passPercentage = (float) $exam->pass_percentage;
        $status = ((float)$percentage >= $passPercentage) ? 'pass' : 'fail';

        // Lưu kết quả
        $resultId = \DB::table('savsoft_results')->insertGetId([
            'uid' => $uid,
            'exam_id' => $id,
            'total_score' => $totalScore,
            'percentage' => $percentage,
            'status' => $status,
            'start_time' => now()->subMinutes($exam->duration_minutes),
            'end_time' => now(),
        ]);

        // Lưu các lượt chọn
        foreach ($answers as $questionId => $optionId) {
            \DB::table('savsoft_user_answers')->insert([
                'result_id' => $resultId,
                'question_id' => $questionId,
                'selected_option_id' => $optionId,
            ]);
        }

        return response()->json([
            'status' => 'success',
            'result_id' => $resultId,
            'total_score' => $totalScore,
            'max_score' => $maxScore,
            'percentage' => $percentage,
            'exam_status' => $status,
            'message' => $status === 'pass' ? 'Chúc mừng bạn đã qua bài thi!' : 'Bạn chưa đạt điểm tối thiểu!',
        ]);
    }

    /**
     * Lấy tất cả kết quả thi (dành cho admin)
     * GET /results
     */
    public function allResults(Request $request)
    {
        $exam_id = $request->query('exam_id');

        $query = \DB::table('savsoft_results as r')
            ->join('savsoft_users as u', 'r.uid', '=', 'u.uid')
            ->join('savsoft_exams as e', 'r.exam_id', '=', 'e.id')
            ->select(
                'r.id as result_id',
                'u.studentid',
                'u.first_name',
                'u.last_name',
                'e.title as exam_title',
                'e.pass_percentage',
                'r.total_score',
                'r.percentage',
                'r.status',
                'r.end_time'
            )
            ->orderBy('r.end_time', 'desc');

        if ($exam_id) {
            $query->where('r.exam_id', $exam_id);
        }

        $results = $query->get();

        return response()->json([
            'status' => 'success',
            'data' => $results
        ]);
    }
   public function getUserResults($userId)
{
    try {
       
        $results = \App\Models\SavsoftResult::where('uid', $userId)
            ->join('savsoft_exams', 'savsoft_results.quid', '=', 'savsoft_exams.quid')
            ->select(
                'savsoft_results.rid', 
                'savsoft_results.score_obtain',
                'savsoft_exams.exam_name', 
                'savsoft_results.created_at'
            )
            ->orderBy('savsoft_results.created_at', 'desc')
            ->get();

        return response()->json($results, 200);

    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Có lỗi xảy ra khi lấy kết quả bài thi.',
            'error' => $e->getMessage()
        ], 500);
    }
}
}
