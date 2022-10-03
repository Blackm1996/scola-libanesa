<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Grades;
use App\Models\Books;
use App\Models\Student_Inscription;
use App\Models\Bills;
use App\Models\Student_Profile;
use App\Models\Course_Info;
use App\Models\Options;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Collection;
use App\Models\Score_Type;
use App\Utils\Birthday_List;
use DB;

class gradeController extends Controller
{


    /*
    public function __construct(){

        $this->middleware('auth');
    }*/


     /** 
     * Display a listing of the resource. 
     * @return \Illuminate\Http\Response 
     */  
public function index()  
{  
   return json_encode(Grades::select('id','Name')->get());
}  
/** 
     * Show the form for creating a new resource. 
     * @return \Illuminate\Http\Response 
       
*/  
 public function create()  
{  
          
//  
      
} 

public function birthDayList($idGrade)
{
    $School_Year=(Options::select('option_value')->where('option_name','School_Year')->first())['option_value'];
    try{
        $students = Student_Profile::select(DB::raw("CONCAT(First_Name,' ',Last_Name) AS name"),'Birthday')
        ->join('student_inscriptions','student_inscriptions.id_student','=','student_profiles.id')
      ->where('student_inscriptions.School_Year',$School_Year)
      ->where('student_inscriptions.id_grade',$idGrade)->get();
        $title=(Grades::select("Name")->where("id",$idGrade)->first())["Name"];
        $data=array("title"=>$title,"students"=>$students);
        $pdf=base64_encode(Birthday_List::generateList($data));
        }
        catch(\Exception $e)
        {
            return response()->json($e,400);
        }
        return json_encode($pdf);
}


public function studentGrade($idGrade,$School_Year)
{
    try{
        $response = Student_Profile::join('student_inscriptions','student_inscriptions.id_student','=','student_profiles.id')
      ->join('grades','grades.id','=','student_inscriptions.id_grade')->where('student_inscriptions.School_Year',$School_Year)
      ->where('student_inscriptions.id_grade',$idGrade)->get(['First_Name','Last_Name','grades.Name as grade','Inscription_Tax','Books_Uniform_total']);
      return json_encode($response);
        }
        catch(\Exception $e)
        {
            return response()->json($e,400);
        }
}



/** 
     * Store a newly created resource in storage. 
     * 
     * @param  \Illuminate\Http\Request   $request 
     * @return \Illuminate\Http\Response 
     */  
public function store(Request $request)  
{  


    try{  
    
    $validation = $request->validate([
        'Name' =>  'required',
        'Default_Inscription_tax'=>'required|numeric',
        'Default_Monthly_pay' => 'required|numeric',
        'Default_Books_Uniform_total' => 'required|numeric',
    ]);
        if(Grades::where('Name',$request->input('Name'))->exists())
        {
            return response()->json(["status"=>"data is already exist"],400);
        }
        $temp = new Grades;
        $temp->Name = $request->input('Name');
        $temp->Default_Inscription_tax =  $request->input('Default_Inscription_tax');
        $temp->Default_Monthly_pay =  $request->input('Default_Monthly_pay');
        $temp->Default_Books_Uniform_total = $request->input('Default_Books_Uniform_total');
        $grade=Grades::firstOrCreate($temp->toArray());
        if(isset($request->courses)){
        foreach($request->courses as $course){

          $validation =Validator::make($course ,[
              'course.name' =>'required',
              'course.score' =>'required|numeric',
          ]);
              
             $tempCourse= new Course_Info;
             $tempCourse->Name=$course['name'];
             $tempCourse->id_grade= "$grade->id";
             $tempCourse->score=$course['score'];
           $myCourse=  Course_Info::firstOrCreate($tempCourse->toArray());

        }}
        if(isset($request->books)){
        foreach($request->books as $book){

            $validation =Validator::make($book ,[
                'book.name' =>'required',
            ]);
               $tempBook = new Books;
               $tempBook->Name=$book['name'];
               $tempBook->id_grade=$grade->id; 
             $MyBook=Books::firstOrCreate($tempBook->toArray());
          }
      
        }
    
   }
      catch(\Exception $e){
        return response()->json(['status'=>'data validation error']);
    }
  
      return response()->json(['status'=>'data insereted successflly','id'=>$grade->id],201);

} 




/** 
     * Display the specified resource. 
     * @param  int  $id 
     * @return \Illuminate\Http\Response 
     */  
public function show($id)  
{  
try{
    $grade = Grades::findOrFail($id);
    $id=Arr::pull($grade,'id'); 
    return response()->json($grade,200);
}
catch(\Exception $e)
{
  return response()->json("the grade you looking for is not found");
}
}  
/** 
     * Show the form for editing the specified resource. 
     * @param  int  $id 
     * @return  \Illuminate\Http\Response 
     */  
 public function edit($id)  
      
{  
          
//  
      
}  
/** 
     * Update the specified resource in storage. 
     * @param  \Illuminate\Http\Request   $request 
     * @param  int  $id 
     * @return \Illuminate\Http\Response 
     */  
 public function update(Request $request, $id)  
{
    try{  
        $validation = $request->validate([
            'Name' =>  'required',
            'Default_Inscription_tax'=>'required|numeric',
            'Default_Books_Uniform_total' => 'required|numeric',
            'Default_Monthly_pay' => 'required|numeric',
             ]);
    $grade = new Grades;
    $grade =Grades::findOrFail($id);
    $grade->update($request->toArray());
   }
   catch(\Exception $e){
    return response()->json(null, 204);
   }
     return response()->json("data updated succesfully",200); 
}  
/** 
     * Remove the specified resource from storage. 
     * @param  int  $id 
     * @return  \Illuminate\Http\Response 
     */  
 public function destroy($id)  
 {
    try{
        Grades::where('id',$id)->delete();
    }
    catch(\Exception $e){
        return response()->json('Error,something happend',500);
    }

    return response()->json(null, 204);

 }

public function getstats($id)
{
$grade=Grades::where('id',$id)->get(['Name'
,'Default_Inscription_tax'
,'Default_Monthly_pay'
,'Default_Books_Uniform_total'
]);
$courses['courses']=Course_Info::where('id_grade',$id)->get(['Name','score']);
$response=$grade->toArray();
array_push($response,$courses);
///array_push($response,$courses);
return json_encode($response);
}


}
