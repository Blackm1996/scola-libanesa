<?php


namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student_Profile;
use App\Models\Options;
use App\Models\Student_Inscription;
use App\Models\Medical;
use App\Models\Medicine;
use App\Models\Family;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Arr;
use App\Models\Grades;
use App\Models\Classroom;

class StudentController extends Controller
{


    public function __construct(){
        
		
       // $this->middleware('jwt.verify');
	  //  $this->middleware('jwt.xauth');
    }


     
      
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($limit,$search,$orderBy,$sort,$year,$gradeId,$sectionId)
    {
    
        try {
            $allStudent = Student_Profile::select('id','First_Name','Last_Name')->join('student_inscriptions','student_inscriptions.id_student','=','student_profiles.id')->
            Where('student_inscriptions.School_Year',$year)->
            where(
                function($q) use($search) {
                    if($search!='^'){
          $q->where('student_profiles.id','LIKE', '%' . $search .'%')
            ->orWhere('student_profiles.First_Name','LIKE','%' .$search .'%')
            ->orWhere('student_profiles.Last_Name','LIKE','%' .$search .'%');}
            else{
             $q->where('student_profiles.id','>',0);    
            }
      })
      ->where(
           function($q) use($gradeId) {
               if($gradeId>0){
             $q->where('student_inscriptions.id_grade',$gradeId);
             }
    })->where(
           function($q) use($sectionId) {
               if($sectionId>0){
             $q->where('student_inscriptions.id_classroom',$sectionId);
             }
    })
    ->orderBy('student_profiles.'.$orderBy,$sort)->paginate($limit);
       
        } catch (\Exception $e) {
            return response()->json('something went wrong', 404);
       }
        return response()->json($allStudent, 206);
    }

    public function indexAll($limit,$search,$orderBy,$sort)
    {
    
        try {
            $allStudent = Student_Profile::select('id','First_Name','Last_Name')
            ->where(
                function($q) use($search) {
                    if($search!='^'){
          $q->where('student_profiles.id','LIKE', '%' . $search .'%')
            ->orWhere('student_profiles.First_Name','LIKE','%' .$search .'%')
            ->orWhere('student_profiles.Last_Name','LIKE','%' .$search .'%');}
            else{
             $q->where('student_profiles.id','>',0);    
            }
      })
      
    ->orderBy('student_profiles.'.$orderBy,$sort)->paginate($limit);
       
        } catch (\Exception $e) {
            return response()->json('something went wrong', 404);
       }
        return response()->json($allStudent, 206);
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
        try {
            $validation = $request->validate([
                'ID_URL' =>  'file|image|mimes:jpeg,png,gif,jpg|max:2048',
                'Vaccine_URL' => 'file|image|mimes:jpeg,png,gif,jpg|max:2048',
                'First_Name' => 'required',
                'Last_Name' => 'required',
                'id_family' => 'required',
            ]);
            // check if the data was inserted before
            $data = Student_Profile::where([
                ['First_Name', '=', $request->input('First_Name')],
                ['Last_Name', '=', $request->input('Last_Name')],
                ['id_family', '=', $request->input('id_family')],
                ['id_guardian', '=', $request->input('id_guardian')],
            ])->get();
    
            if (!$data->isEmpty()) {
                return response()->json("data alreay exist", 200);
            }
            // if not inserted then save it
            else {
                $temp = new Student_Profile;
                $temp->First_Name = $request->input('First_Name');
                $temp->Last_Name =  $request->input('Last_Name');
                $temp->Birthday =  $request->input('Birthday');
                $temp->Birthplace = $request->input('Birthplace');
                $temp->Nationality = $request->input('Nationality');
                $temp->id_family = $request->input('id_family');
                $temp->Sex = $request->input('Sex');
                $temp->id_guardian = $request->input('id_guardian');
                if(isset($_FILES['ID_URL'])){
                $temp->ID_URL = Storage::put('public/ID_URL', $request->file('ID_URL'));}
                
                if(isset($_FILES['Vaccine_URL'])){
                $temp->Vaccine_URL = Storage::put('public/Vaccine_URL', $request->file('Vaccine_URL'));}
                $student = Student_Profile::create($temp->toArray());
                if(isset($request->medical)){
                    foreach ($request->medical as $casem){
                        $ttm=new Medical;
                        $ttm->Name=$casem['Name'];
                        $ttm->Description=$casem['Description'];
                        $ttm->id_student=$student->id;
                        $med=Medical::Create($ttm->toArray());
                    }
                }
                if(isset($request->medicine)){
                    foreach ($request->medicine as $casec){
                        $ttc=new Medicine;
                        $ttc->Name=$casec;
                        $ttc->id_student=$student->id;
                        $medc=Medicine::Create($ttc->toArray());
                    }
                }
            }
        } catch (\Exception $e) {
            return response()->json($e, 404);
        }
        return response()->json(['status' => 'data insereted successflly', 'id' => $student->id], 201);
    }


     /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id,$School_Year)
    {
      //  try {
            $student = Student_Profile::join('student_inscriptions','id','id_student')->where('student_inscriptions.School_Year',$School_Year)->where('id',$id)->get([
                'student_profiles.id','student_profiles.First_Name','student_profiles.Last_Name','student_inscriptions.Monthly_Total','student_inscriptions.id_grade']);
           //     $student = $student->toArray();
          //$price = Arr::pull($student,'student_inscriptions.id_grade');
          //echo $student[0]['id_grade'];
                $grade = Grades::select('Name as gradeName')->where('id',$student[0]['id_grade'])->first();
                $section = Classroom::select('Name as sectionName')->where('id_grade',$student[0]['id_grade'])->where('School_year',$School_Year)->first();
                if(Empty($grade->gradeName)){$gradeName=null;}else{$gradeName=$grade->gradeName;}
                if(Empty($section->sectionName)){$sectionName=null;}else{$sectionName=$section->sectionName;}
               
                //echo $inscription;

      //  } catch (\Exception $e) {
       //     return response()->json(['status' => 'data is not found']);
    //    }
        return  response()->json(['id'=> $student[0]['id'],
             'First_Name'=>$student[0]['First_Name'],
             'Monthly_Total'=>$student[0]['Monthly_Total'],
             'Last_Name'=>$student[0]['Last_Name'],
             'gradeName'=>$gradeName,
             'sectionName'=>$sectionName
             ],200);
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
    public function update(Request $request, $id)
    {
        
        try {
            $validation = $request->validate([
                'ID_URL' =>  'file|image|mimes:jpeg,png,gif,jpg|max:2048',
                'Vaccine_URL' => 'file|image|mimes:jpeg,png,gif,jpg|max:2048',
                'First_Name' => 'required|max:500',
                'Last_Name' => 'required|max:500',
            ]);
            //echo $request;
            $object = Student_Profile::findOrFail($id);
            //     echo asset($object->ID_URL)."             ".$object->Vaccine_URL;
            $object->First_Name = $request->input('First_Name');
            $object->Last_Name =  $request->input('Last_Name');
            $object->Birthday =  $request->input('Birthday');
            $object->Birthplace = $request->input('Birthplace');
            $object->Nationality = $request->input('Nationality');
            $object->id_family = $request->input('id_family');
            $object->Sex = $request->input('Sex');
            $object->id_guardian = $request->input('id_guardian');
            if(isset($_FILES["ID_URL"])){

                Storage::delete($object->ID_URL);
                $object->ID_URL = Storage::put('public/ID_URL', $request->file('ID_URL'));
            }
            if(isset($_FILES["Vaccine_URL"])){
                Storage::delete($object->Vaccine_URL);
                $object->Vaccine_URL = Storage::put('public/Vaccine_URL', $request->file('Vaccine_URL'));
            }
              
            $object->save();

            if(isset($request->medical)){
                $newn=array();
                foreach ($request->medical as $casem){
                    $newn[]=$casem['Name'];
                    $old=Medical::where('id_student',$id)->where("Name",$casem['Name'])->get();
                    if($old->isEmpty())
                    {
                        $ttm=new Medical;
                        $ttm->Name=$casem['Name'];
                        $ttm->Description=$casem['Description'];
                        $ttm->id_student=$id;
                        $med=Medical::Create($ttm->toArray());
                    }
                }
                Medical::where('id_student',$id)->whereNotIn("Name",$newn)->delete();
            }
            else
                Medical::where('id_student',$id)->delete();
            
            
            if(isset($request->medicine)){
                $newt=array();
                foreach ($request->medicine as $casec){
                    $newt[]=$casec;
                    $old=Medicine::where('id_student',$id)->where("Name",$casec)->get();
                    if($old->isEmpty())
                    {
                        $ttm=new Medicine;
                        $ttm->Name=$casec;
                        $ttm->id_student=$id;
                        $med=Medicine::Create($ttm->toArray());
                    }
                }
                Medicine::where('id_student',$id)->whereNotIn("Name",$newt)->delete();
            }
            else
                Medicine::where('id_student',$id)->delete();
            
        } catch (\Exception $e) {
            return response()->json($e, 404);
        }

        return response()->json(['status' => 'data updated successflly'], 200);
    }


    
   public function studentInfo($id){
    try{
        $student = Student_Profile::findOrFail($id);
        $medical=Medical::select("Name","Description")->where('id_student',$id)->get();
        $medicine=Medicine::select("Name")->where('id_student',$id)->get();
        $phone_number=null;
        if($student->id_family!=null)
        {
            $phone_number=(Family::select("Comm_Phone")->where('id',$student->id_family)->first())["Comm_Phone"];
        }
        $student["phone_number"]=$phone_number;
        $student["medical"]=$medical;
        $student["medicine"]=$medicine;
    }
    catch(\Exception $e)
    {
        return response()->json('student is not found',404);
    }
    return json_encode($student);
   }

   public function medicalHistory($id)
   {
        try {
            $medical=Medical::select("Name","Description")->where('id_student',$id)->get();
            $medicine=Medicine::select("Name")->where('id_student',$id)->get();
        } catch(\Exception $e)
        {
            return response()->json($e,404);
        }
        return response()->json(["medical"=>$medical,"medicine"=>$medicine],200);
   }



    
      
    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
    
        try {
            $student = Student_Profile::findOrFail($id);
            if($student['ID_URL']!=null) Storage::delete($student['ID_URL']);
            if($student['Vaccine_URL']!=null) Storage::delete($student['Vaccine_URL']);
            Medicine::where('id_student',$id)->delete();
            Medical::where('id_student',$id)->delete();
            $family=$student->id_family;
            $siblings=Student_Profile::where("id_family",$family)->whereNot("id",$student->id)->get();
            $student->delete();
            if($siblings->isEmpty())
            {
                $fam=Family::findOrFail($family);
                $fam->delete();
            }

        } catch (\Exception $e) {
            return response()->json($e, 404);
        }
        return response(['status' => 'student is deleted'], 204);
    }
}
