<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group([
 'middleware'=>'api',
 'prefix'=>'auth'
 ], function($router){
   Route::post('login',[App\Http\Controllers\AuthController::class,'login']);
   Route::post('register',[App\Http\Controllers\AuthController::class,'register']); 
   Route::post('logout',[App\Http\Controllers\AuthController::class,'logout']);
   Route::post('refresh',[App\Http\Controllers\AuthController::class,'refresh']);
   Route::post('me',[App\Http\Controllers\AuthController::class,'me']);
  });

  // student profile
  Route::get('/student/{id}',[App\Http\Controllers\StudentController::class,'studentInfo']);

  Route::get('/student/{limit}/{search}/{orderBy}/{sort}/{year}/{gradeId}/{sectionId}',[App\Http\Controllers\StudentController::class,'index']);

  Route::get('/student/{id}/{School_Year}',[App\Http\Controllers\StudentController::class,'show']);
  
  Route::post('/student',[App\Http\Controllers\StudentController::class,'store']);
  
  Route::post('/student/{id}',[App\Http\Controllers\StudentController::class,'update']);
  
  Route::delete('/student/{id}',[App\Http\Controllers\StudentController::class,'destroy']);
  

// Student Inscription

  Route::post('/studentFileYear',[App\Http\Controllers\StudentInscriptionController::class,'store']);
  Route::put('/studentFileYear/{id_student}/{School_Year}',[App\Http\Controllers\StudentInscriptionController::class,'update']);
  Route::get('/studentFileYear/{School_Year}',[App\Http\Controllers\StudentInscriptionController::class,'index']);
  Route::get('/studentFileYear/{id}/{School_Year}',[App\Http\Controllers\StudentInscriptionController::class,'show']);
  Route::delete('/studentFileYear/{id}/{School_Year}',[App\Http\Controllers\StudentInscriptionController::class,'destroy']);
  Route::get('/missingStudent/{id_grade}/{School_Year}',[App\Http\Controllers\StudentInscriptionController::class,'missingStudents']);
  Route::post('/attendanceChange',[App\Http\Controllers\StudentInscriptionController::class,'attendChange']);
  Route::get('/getAllYears',[App\Http\Controllers\StudentInscriptionController::class,'getAllYears']);



  // options
Route::post('/options',[App\Http\Controllers\OptionsController::class,'store']);
Route::put('/options/{id}',[App\Http\Controllers\OptionsController::class,'update']);
Route::post('/addTrimster',[App\Http\Controllers\OptionsController::class,'addTrimster']);
Route::get('/getSemsters',[App\Http\Controllers\OptionsController::class,'getSemesters']);
Route::get("startmonth",[App\Http\Controllers\OptionsController::class,'startMonth']);
Route::get("endmonth",[App\Http\Controllers\OptionsController::class,'endMonth']);
Route::get("schoolYear",[App\Http\Controllers\OptionsController::class,'schoolYear']);
Route::get("registrationYear",[App\Http\Controllers\OptionsController::class,'registrationYear']);
Route::get("semesterdetails",[App\Http\Controllers\OptionsController::class,"semesterdetails"]);

Route::post("startmonth",[App\Http\Controllers\OptionsController::class,"addstartmonth"]);
Route::post("endmonth",[App\Http\Controllers\OptionsController::class,"addendmonth"]);
Route::post("schoolYear",[App\Http\Controllers\OptionsController::class,"addSchoolYear"]);
Route::post("registrationYear",[App\Http\Controllers\OptionsController::class,"addregistrationYear"]);
Route::post("semesterdetails",[App\Http\Controllers\OptionsController::class,"addsemesterdetails"]);


//Grades
Route::get('printGrade/{idGrade}/{School_Year}',[App\Http\Controllers\gradeController::class,'studentGrade']);
Route::post('/grade',[App\Http\Controllers\gradeController::class,'store']);
Route::put('/grade/{id}',[App\Http\Controllers\gradeController::class,'update']);
Route::get('/grade',[App\Http\Controllers\gradeController::class,'index']);
Route::get('grade/{id}',[App\Http\Controllers\gradeController::class,'show']);
Route::delete('grade/{id}',[App\Http\Controllers\gradeController::class,'destroy']);
Route::get('gradeStats/{id}',[App\Http\Controllers\gradeController::class,'getstats']);

Route::get('cutOut',[App\Http\Controllers\gradeController::class,'cutOut']);

//Expenses
Route::post('Expenses',[App\Http\Controllers\ExpensesController::class,'addExpenses']);
Route::get('Expenses/{month}',[App\Http\Controllers\ExpensesController::class,'getExpenses']);
Route::get('getTotalExpenses/{month}',[App\Http\Controllers\ExpensesController::class,'getTotalExpenses']);


// Bills

Route::get('sectionBills/{id_classroom}/{School_Year}',[App\Http\Controllers\BillsController::class,'sectionBills']);
Route::get('/notPayedstudent/{month}/{School_Year}/{search}/{orderBy}/{sort}',[App\Http\Controllers\BillsController::class,'studentNotpayed']);
Route::get('/billsMonth/{id}/{School_Year}',[App\Http\Controllers\BillsController::class,'allMonths']);
Route::get('/bills/{id}/{School_Year}',[App\Http\Controllers\BillsController::class,'allBills']);
Route::get('/billsRest/{id}/{School_Year}/{month}',[App\Http\Controllers\BillsController::class,'Rest']);
Route::get('/bills/{id}/{month}/{School_Year}',[App\Http\Controllers\BillsController::class,'show']);
Route::post('/bills',[App\Http\Controllers\BillsController::class,'store']);
Route::get('/billsYear/{id}',[App\Http\Controllers\BillsController::class,'showYears']);
Route::get('printBill/{id}/{School_Year}',[App\Http\Controllers\BillsController::class,'showPrinter']);
Route::get('/allMonthBills/{month}/{School_Year}',[App\Http\Controllers\BillsController::class,'allMonthBills']);
Route::post('/familyBill',[App\Http\Controllers\BillsController::class,'store_family']);
// Books
Route::delete('books/{id}',[App\Http\Controllers\BooksController::class,'destroy']);
Route::get('book/{id}',[App\Http\Controllers\BooksController::class,'show']);
Route::put('book/{id}',[App\Http\Controllers\BooksController::class,'update']);


//Course
Route::delete('course/{id}',[App\Http\Controllers\CourseController::class,'destroy']);
Route::get('course/{id}',[App\Http\Controllers\CourseController::class,'show']);
Route::put('course/{id}',[App\Http\Controllers\CourseController::class,'update']);
Route::get('gradeCourses/{id_grade}',[App\Http\Controllers\CourseController::class,'allcourses']);



//Classrooms
Route::post('section',[App\Http\Controllers\SectionController::class,'store']);

Route::get('section/{School_Year}',[App\Http\Controllers\SectionController::class,'index']);

Route::get('section/{idGrade}/{School_Year}',[App\Http\Controllers\SectionController::class,'gradeStudents']);

Route::get('sectionStudents/{idSection}/{School_Year}',[App\Http\Controllers\SectionController::class,'sectionStudents']);

Route::put('section/{id}',[App\Http\Controllers\SectionController::class,'update']);

Route::get('missingStudents/{id}',[App\Http\Controllers\SectionController::class,'missingStudents']);

Route::delete('section/{id}',[App\Http\Controllers\SectionController::class,'destroy']);

Route::get('classStats/{id_section}',[App\Http\Controllers\SectionController::class,'classStats']);

Route::get('classInfos/{id_section}',[App\Http\Controllers\SectionController::class,'classinfos']);

Route::get('sectionCourses/{idSection}',[App\Http\Controllers\SectionController::class,'coursesForadmin']);

// Users

Route::post('user',[App\Http\Controllers\UsersController::class,'store']);

Route::get('user/greet',function(){return "Hello!";});

Route::put('user/{id}',[App\Http\Controllers\UsersController::class,'update']);

Route::get('teachersInfos',[App\Http\Controllers\UsersController::class,'teachersInfos']);

Route::get('usersInfos',[App\Http\Controllers\UsersController::class,'usersInfos']);

Route::put('updateUser/{id}',[App\Http\Controllers\UsersController::class,'updateUser']);

Route::delete('deleteUser/{id}',[App\Http\Controllers\UsersController::class,'deleteUser']);

//score_types
Route::get('semsters/{School_Year}/{id_classroom}/{semester}/{type}',[App\Http\Controllers\scoreTypeController::class,'index']);
Route::get('scoresStatus/{id_classroom}/{id_course}',[App\Http\Controllers\scoreTypeController::class,'getStatus']);


// Instructor 
Route::post('instructor',[App\Http\Controllers\InstructorController::class,'store']);
Route::get('instructor/{id}',[App\Http\Controllers\InstructorController::class,'classTeachers']);
Route::get('instructor/{id}/{School_Year}',[App\Http\Controllers\InstructorController::class,'teacherCoursesupdate']);
Route::get('instructorCourses/{id}/{School_Year}',[App\Http\Controllers\InstructorController::class,'allTeachercourses']);
Route::delete('deleteInstructor/{id}',[App\Http\Controllers\InstructorController::class,'deleteInstructor']);



//scores
Route::post('score',[App\Http\Controllers\scoresController::class,'save']);
Route::put('score/{idSection}/{idCourse}',[App\Http\Controllers\scoresController::class,'update']);
Route::get('classAverage/{id_section}',[App\Http\Controllers\scoresController::class,'getfirstgrade']);
Route::post('privelegeScore',[App\Http\Controllers\scoresController::class,'adminSave']);
Route::get('totalScores/{idStudent}',[App\Http\Controllers\scoresController::class,'totalScores']);
Route::get('classScores/{idSection}',[App\Http\Controllers\scoresController::class,'classScores']);

//family
Route::post('addfamily',[App\Http\Controllers\FamilyController::class,'store']);
Route::get('familyID/{id}',[App\Http\Controllers\FamilyController::class,'family_id_card']);
Route::get('getMembers/{id_family}',[App\Http\Controllers\FamilyController::class,'getStudents']);
Route::get('getFinance/{School_Year}/{id_family}',[App\Http\Controllers\FamilyController::class,'getStudentsFinance']);
Route::get('/families/{limit}/{search}/{orderBy}/{sort}',[App\Http\Controllers\FamilyController::class,'index']);
Route::get('/family/{id}',[App\Http\Controllers\FamilyController::class,'show']);

//guardian
Route::post('addguardian',[App\Http\Controllers\GuardianController::class,'store']);
Route::get('guardians',[App\Http\Controllers\GuardianController::class,'getAll']);
Route::get('guardian/{id}',[App\Http\Controllers\GuardianController::class,'get']);

Route::post('avatar', function(Request $request) {
   //echo 'omak ar3a'; 
 //  $path = $request->file('file')->store('public/files');
   //$path=Storage::put('public',$request->file('file'));
   //echo $path;
 //Storage::delete('file\Nj1sHNQ1GOYwtJujCQIBCUlb5jyr9GhudnYlVEYw.jpg');
   //$path1=Storage::put('public',$request->file('file'));
   Storage::delete('public/F7tusbJMUY9gzuBckkJBdlLLtezHmOmFirEevyFC.jpg');
   //echo $path1;
   
  // echo asset('storage/files/c4ztNFvTcQj2I6iJoEOKcCza2xRQLZufhunSzl3a.jpg');
});