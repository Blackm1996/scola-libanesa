<?php

namespace App\Http\Controllers;
use Illuminate\Support\Arr;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Student_Inscription;
use App\Models\Grades;
use App\Models\Bills;
use App\Models\Classroom;

class StudentInscriptionController extends Controller
{

    /*
    public function __construct(){

        $this->middleware('auth');
    }*/


    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($School_Year)
    {
        try{
          //get the current School_Year
       
        $allgrades=Grades::all();
        $allclasses=Classroom::where('School_Year',$School_Year)->orderBy('id_grade')->get();
        $oldGradeid=0;
        $tempresponse["grades"]=array();
        $e = array();
        $i=0;
        $f=array();
        foreach($allgrades as $grade){
            if(!$allclasses->contains('id_grade',$grade->id))
            {
                $e["id"]=$grade->id;
                $e["name"]=$grade->Name;
                $e["sections"]=array();
                array_push($tempresponse["grades"],$e);   
            }else{
             $gradeClasses = $allclasses->where('id_grade',$grade->id)->all();       
             $e["id"]=$grade->id;
             $e["name"]=$grade->Name;
             $e["sections"]=array();
             $f= array();
             foreach($gradeClasses as $classes){
             $f["id"]=$classes->id;
             $f["name"]=$classes->Name;
             array_push($e["sections"],$f);}
             array_push($tempresponse["grades"],$e);  
           
       }
    
    }
       return json_encode($tempresponse);}
       catch(\Exception $e)
       {
         return response("something wrong happend",404);
       }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

        
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        
         // Data validation
      //  try{
        $validation = $request->validate([
            'id_student' =>  'required|numeric',
            'id_grade'=>'required|numeric',
            'School_Year'=>'required',
            'Inscription_Tax' => 'required|numeric',
            'Books/Uniform_total'=>'required|numeric',
            'Monthly_Total'=>'required|numeric',
            'Month_Start'=>'required|numeric',
            'Discount'=>'required|numeric|max:15',
           
        ]);
       // check if the data was inserted before
        $data = Student_inscription::where([
            ['id_student','=',$request->input('id_student')],
            ['id_grade','=',$request->input('id_grade')],
            ['School_Year','=',$request->input('School_Year')],
            ])->get();
        if(!$data->isEmpty()){
            echo response()->json("data is alreay exist",200);
        }
        // if not inserted then save it
        else{
            // append the School Year to the request data
        $student=Student_inscription::create($request->all());
        return response()->json(['status'=>'data insereted successflly'],201);}
      //  }
     //  catch(\Exception $e) {
      //      return response()->json("something went wrong",404);
      //  }
    }

    
    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id,$School_Year)
    {
      try{ 
          $student = Student_Inscription::select('Inscription_Tax',
          'Books/Uniform_total As booksUniformtotal',
          'Monthly_Total',
          'id_classroom',
         'Month_Start','id_grade','Discount')->where("id_student",$id)->where("School_Year",$School_Year)->first();

         //$grade = Grades::select('Name as gradeName')->where('id',$student->id_grade)->first();
         $sectionID=null;
         if(Classroom::select('id as sectionId')->where('id_grade',$student->id_grade)->where('School_year',$School_Year)->exists()){
         $section = Classroom::select('id as sectionId')->where('id_grade',$student->id_grade)->where('School_year',$School_Year)->first();
         $sectionID=$section->sectionId;
         }
        // if(Empty($section->sectionId)){$sectionId=null;}else{$sectionId=$section->sectionId;}
             return response()->json(['Inscription_Tax'=> $student->Inscription_Tax,
             'Books/Uniform_total'=>$student->booksUniformtotal,
             'Monthly_Total'=>$student->Monthly_Total,
             'Month_Start'=>$student->Month_Start,
             'gradeId'=>$student->id_grade,
             'sectionId'=>$student->id_classroom,
             'Discount'=>$student->Discount,
             ],200);
      }
      catch(\Exception $e)
      {
          return response()->json(["status"=>"student is not found"],404);
      }
    }



    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

        /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id_student,$School_Year)
    {
          if(Bills::where('id_student',$id_student)->where('School_Year',$School_Year)->exists()){
                return response()->json(['status'=>'you can\'t edit this student'],400);
        } 
        try{
        /*$currentHour = date('H');
        $timeInserted= Student_inscription::select('created_at')->where('id_student',$id_student)->where('School_Year',$School_Year)->first();
        $date = new \DateTime($timeInserted['created_at']); 
        $hourString = $date->format('H');
        if($currentHour!=$hourString){
        return response()->json('time for update student inscription has passed you can\'t update student data',400);
        }*/
        $validation = $request->validate([
            'id_student' =>  'required|numeric',
            'id_grade'=>'required|numeric',
            'School_Year' => 'required',
            'Inscription_Tax' => 'required|numeric',
            'Books/Uniform_total'=>'required|numeric',
            'Monthly_Total'=>'required|numeric',
            'Month_Start'=>'required|numeric',
            'Discount'=>'required|numeric|max:15',
        ]);
        if(Student_inscription::where('id_student',$id_student)->where('School_Year',$School_Year)->exists())
        {
            $object =Student_inscription::where('id_student',$id_student)->where('School_Year',$School_Year)->update($request->all());
            return response()->json(['status'=>'data updated successflly'],200);
        }
         else {  return response()->json(['status'=>'student informations doesn\'t exist'],200); }
    } 
    catch(\Exception $e){
      return response()->json("something went wrong",404);}
    }



 /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id,$School_Year)
    {
       try{
         if(Bills::where('id_student',$id)->where('School_Year',$School_Year)->exists()){
           return response()->json(['status'=>'you can\'t delete the student'],400);
         }
         
         else{  
        Student_inscription::where('id_student',$id)->where('School_Year',$School_Year)->delete();}
         }
         catch(\Exception $e)
        {
         return response()->json(null,204);
        }
    }


    public function missingStudents($id_grade,$School_Year)
    {
        try{
        $students_id=Student_Inscription::join('student_profiles','student_profiles.id','=','student_inscriptions.id_student')->where('student_inscriptions.id_grade',$id_grade)->where('student_inscriptions.School_Year',$School_Year)->where('student_inscriptions.id_classroom',null)->get(
        ['student_profiles.id','student_profiles.First_Name','student_profiles.Last_Name'
        ]);
    }catch(\Exception $e){return json_encode($e);}
        return json_encode($students_id);
    }












}
