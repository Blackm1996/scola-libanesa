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
  Route::get('/student/{id}','App\Http\Controllers\StudentController@studentInfo');

  Route::get('/student/{limit}/{search}/{orderBy}/{sort}/{year}/{gradeId}/{sectionId}','App\Http\Controllers\StudentController@index');

  Route::get('/student/{id}/{School_Year}','App\Http\Controllers\StudentController@show');
  
  Route::post('/student','App\Http\Controllers\StudentController@store');
  
  Route::post('/student/{id}','App\Http\Controllers\StudentController@update');
  
  Route::delete('/student/{id}','App\Http\Controllers\StudentController@destroy');
  

// Student Inscription

  Route::post('/studentFileYear','App\Http\Controllers\StudentInscriptionController@store');
  Route::put('/studentFileYear/{id_student}/{School_Year}','App\Http\Controllers\StudentInscriptionController@update');
  Route::get('/studentFileYear/{School_Year}','App\Http\Controllers\StudentInscriptionController@index');
  Route::get('/studentFileYear/{id}/{School_Year}','App\Http\Controllers\StudentInscriptionController@show');
  Route::delete('/studentFileYear/{id}/{School_Year}','App\Http\Controllers\StudentInscriptionController@destroy');
  Route::get('/missingStudent/{id_grade}/{School_Year}','App\Http\Controllers\StudentInscriptionController@missingStudents');




  // options
Route::post('/options','App\Http\Controllers\OptionsController@store');
Route::put('/options/{id}','App\Http\Controllers\OptionsController@update');
Route::post('/addTrimster','App\Http\Controllers\OptionsController@addTrimster');
Route::get('/getSemsters','App\Http\Controllers\OptionsController@getSemesters');
Route::get("startmonth","App\Http\Controllers\OptionsController@startMonth");
Route::get("endmonth","App\Http\Controllers\OptionsController@endMonth");
Route::get("schoolYear","App\Http\Controllers\OptionsController@schoolYear");
Route::get("registrationYear","App\Http\Controllers\OptionsController@registrationYear");
Route::get("semesterdetails","App\Http\Controllers\OptionsController@semesterdetails");

Route::post("startmonth","App\Http\Controllers\OptionsController@addstartmonth");
Route::post("endmonth","App\Http\Controllers\OptionsController@addendmonth");
Route::post("schoolYear","App\Http\Controllers\OptionsController@addSchoolYear");
Route::post("registrationYear","App\Http\Controllers\OptionsController@addregistrationYear");
Route::post("semesterdetails","App\Http\Controllers\OptionsController@addsemesterdetails");


//Grades
Route::get('printGrade/{idGrade}/{School_Year}','App\Http\Controllers\gradeController@studentGrade');
Route::post('/grade','App\Http\Controllers\gradeController@store');
Route::put('/grade/{id}','App\Http\Controllers\gradeController@update');
Route::get('/grade','App\Http\Controllers\gradeController@index');
Route::get('grade/{id}','App\Http\Controllers\gradeController@show');
Route::delete('grade/{id}','App\Http\Controllers\gradeController@destroy');
Route::get('gradeStats/{id}','App\Http\Controllers\gradeController@getstats');

Route::get('cutOut','App\Http\Controllers\gradeController@cutOut');

//Expenses
Route::post('Expenses','App\Http\Controllers\ExpensesController@addExpenses');
Route::get('Expenses/{month}','App\Http\Controllers\ExpensesController@getExpenses');
Route::get('getTotalExpenses/{month}','App\Http\Controllers\ExpensesController@getTotalExpenses');


// Bills

Route::get('sectionBills/{id_classroom}/{School_Year}','App\Http\Controllers\BillsController@sectionBills');
Route::get('/notPayedstudent/{month}/{School_Year}/{search}/{orderBy}/{sort}','App\Http\Controllers\BillsController@studentNotpayed');
Route::get('/billsMonth/{id}/{School_Year}','App\Http\Controllers\BillsController@allMonths');
Route::get('/bills/{id}/{School_Year}','App\Http\Controllers\BillsController@allBills');
Route::get('/billsRest/{id}/{School_Year}/{month}','App\Http\Controllers\BillsController@Rest');
Route::get('/bills/{id}/{month}/{School_Year}','App\Http\Controllers\BillsController@show');
Route::post('/bills','App\Http\Controllers\BillsController@store');
Route::get('/billsYear/{id}','App\Http\Controllers\BillsController@showYears');
Route::get('printBill/{id}/{School_Year}','App\Http\Controllers\BillsController@showPrinter');
Route::get('/allMonthBills/{month}/{School_Year}','App\Http\Controllers\BillsController@allMonthBills');

// Books
Route::delete('books/{id}','App\Http\Controllers\BooksController@destroy');
Route::get('book/{id}','App\Http\Controllers\BooksController@show');
Route::put('book/{id}','App\Http\Controllers\BooksController@update');


//Course
Route::delete('course/{id}','App\Http\Controllers\CourseController@destroy');
Route::get('course/{id}','App\Http\Controllers\CourseController@show');
Route::put('course/{id}','App\Http\Controllers\CourseController@update');
Route::get('gradeCourses/{id_grade}','App\Http\Controllers\CourseController@allcourses');



//Classrooms
Route::post('section','App\Http\Controllers\SectionController@store');

Route::get('section/{School_Year}','App\Http\Controllers\SectionController@index');

Route::get('section/{idGrade}/{School_Year}','App\Http\Controllers\SectionController@gradeStudents');

Route::get('sectionStudents/{idSection}/{School_Year}','App\Http\Controllers\SectionController@sectionStudents');

Route::put('section/{id}','App\Http\Controllers\SectionController@update');

Route::get('missingStudents/{id}','App\Http\Controllers\SectionController@missingStudents');

Route::delete('section/{id}','App\Http\Controllers\SectionController@destroy');

Route::get('classStats/{id_section}','App\Http\Controllers\SectionController@classStats');

Route::get('classInfos/{id_section}','App\Http\Controllers\SectionController@classinfos');

Route::get('sectionCourses/{idSection}','App\Http\Controllers\SectionController@coursesForadmin');

// Users

Route::post('user','App\Http\Controllers\UsersController@store');

Route::put('user/{id}','App\Http\Controllers\UsersController@update');

Route::get('teachersInfos','App\Http\Controllers\UsersController@teachersInfos');

Route::get('usersInfos','App\Http\Controllers\UsersController@usersInfos');

Route::put('updateUser/{id}','App\Http\Controllers\UsersController@updateUser');

Route::delete('deleteUser/{id}','App\Http\Controllers\UsersController@deleteUser');

//score_types
Route::get('semsters/{School_Year}/{id_classroom}/{semester}/{type}','App\Http\Controllers\scoreTypeController@index');
Route::get('scoresStatus/{id_classroom}/{id_course}','App\Http\Controllers\scoreTypeController@getStatus');


// Instructor 
Route::post('instructor','App\Http\Controllers\InstructorController@store');
Route::get('instructor/{id}','App\Http\Controllers\InstructorController@classTeachers');
Route::get('instructor/{id}/{School_Year}','App\Http\Controllers\InstructorController@teacherCoursesupdate');
Route::get('instructorCourses/{id}/{School_Year}','App\Http\Controllers\InstructorController@allTeachercourses');
Route::delete('deleteInstructor/{id}','App\Http\Controllers\InstructorController@deleteInstructor');



//scores
Route::post('score','App\Http\Controllers\scoresController@save');
Route::put('score/{idSection}/{idCourse}','App\Http\Controllers\scoresController@update');
Route::get('classAverage/{id_section}','App\Http\Controllers\scoresController@getfirstgrade');
Route::post('privelegeScore','App\Http\Controllers\scoresController@adminSave');
Route::get('totalScores/{idStudent}','App\Http\Controllers\scoresController@totalScores');
Route::get('classScores/{idSection}','App\Http\Controllers\scoresController@classScores');




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