<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\SavsoftExam;

class QuestionController extends Controller
{
    /**
     * Lấy danh sách câu hỏi (kèm đáp án) của một bài thi
     * GET /exams/{exam_id}/questions
     */
    public function index($exam_id)
    {
        $exam = SavsoftExam::find($exam_id);
        if (!$exam) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy bài thi'], 404);
        }

        $questions = DB::table('savsoft_questions')
            ->where('exam_id', $exam_id)
            ->orderBy('id', 'asc')
            ->get();

        foreach ($questions as $q) {
            $q->options = DB::table('savsoft_questions_options')
                ->where('question_id', $q->id)
                ->get();
        }

        return response()->json([
            'status' => 'success',
            'exam_title' => $exam->title,
            'data' => $questions
        ]);
    }

    /**
     * Thêm câu hỏi + đáp án vào bài thi
     * POST /exams/{exam_id}/questions
     * Body: {
     *   question_text: "...",
     *   marks: 1,
     *   options: [
     *     { option_text: "...", is_correct: 1 },
     *     { option_text: "...", is_correct: 0 },
     *     ...
     *   ]
     * }
     */
    public function store(Request $request, $exam_id)
    {
        $exam = SavsoftExam::find($exam_id);
        if (!$exam) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy bài thi'], 404);
        }

        $request->validate([
            'question_text' => 'required|string',
            'marks' => 'required|numeric|min:0',
            'options' => 'required|array|min:2',
            'options.*.option_text' => 'required|string',
            'options.*.is_correct' => 'required|in:0,1',
        ]);

        // Kiểm tra đúng có ít nhất 1 đáp án đúng
        $hasCorrect = collect($request->options)->contains(fn($o) => (int)$o['is_correct'] === 1);
        if (!$hasCorrect) {
            return response()->json(['status' => 'error', 'message' => 'Phải có ít nhất 1 đáp án đúng!'], 400);
        }

        $questionId = DB::table('savsoft_questions')->insertGetId([
            'exam_id' => $exam_id,
            'question_text' => $request->question_text,
            'marks' => $request->marks,
        ]);

        foreach ($request->options as $option) {
            DB::table('savsoft_questions_options')->insert([
                'question_id' => $questionId,
                'option_text' => $option['option_text'],
                'is_correct' => $option['is_correct'],
            ]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Thêm câu hỏi thành công!',
            'question_id' => $questionId
        ]);
    }

    /**
     * Xóa câu hỏi (và đáp án liên quan)
     * DELETE /questions/{question_id}
     */
    public function destroy($question_id)
    {
        $question = DB::table('savsoft_questions')->where('id', $question_id)->first();
        if (!$question) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy câu hỏi'], 404);
        }

        DB::table('savsoft_questions_options')->where('question_id', $question_id)->delete();
        DB::table('savsoft_questions')->where('id', $question_id)->delete();

        return response()->json(['status' => 'success', 'message' => 'Đã xóa câu hỏi!']);
    }
}
