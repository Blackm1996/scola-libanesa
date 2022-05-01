<?php


namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student_Profile;
use App\Models\Options;
use App\Models\Student_Inscription;
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
          $q->where('student_profiles.id','LIKE', $search .'%')
            ->orWhere('student_profiles.First_Name','LIKE',$search .'%')
            ->orWhere('student_profiles.Last_Name','LIKE',$search .'%');}
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
            ]);
            // check if the data was inserted before
            $data = Student_Profile::where([
                ['First_Name', '=', $request->input('First_Name')],
                ['Last_Name', '=', $request->input('Last_Name')],
                ['Birthday', '=', $request->input('Birthday')],
                ['Birthplace', '=', $request->input('Birthplace')],
                ['Tel', '=', $request->input('Tel')],
                ['Sex', '=', $request->input('Sex')],
                ['Teuteur', '=', $request->input('Teuteur')],
            ])->get();
    
            if (!$data->isEmpty()) {
                return response()->json("data is alreay exist", 200);
            }
            // if not inserted then save it
            else {
                $temp = new Student_Profile;
                $temp->First_Name = $request->input('First_Name');
                $temp->Last_Name =  $request->input('Last_Name');
                $temp->Birthday =  $request->input('Birthday');
                $temp->Birthplace = $request->input('Birthplace');
                $temp->Tel = $request->input('Tel');
                $temp->Sex = $request->input('Sex');
                $temp->Teuteur = $request->input('Teuteur');
                if(isset($_FILES['ID_URL'])){
                $temp->ID_URL = Storage::put('public/ID_URL', $request->file('ID_URL'));}
                
                if(isset($_FILES['Vaccine_URL'])){
                $temp->Vaccine_URL = Storage::put('public/Vaccine_URL', $request->file('Vaccine_URL'));}

                $student = Student_Profile::create($temp->toArray());
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
                'student_profiles.id','student_profiles.First_Name','student_profiles.Last_Name','student_profiles.Teuteur','student_inscriptions.Monthly_Total','student_inscriptions.id_grade']);
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
             'Teuteur'=>$student[0]['Teuteur'],
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
            $temp = new Student_Profile;
            $temp->First_Name = $request->input('First_Name');
            $temp->Last_Name =  $request->input('Last_Name');
            $temp->Birthday =  $request->input('Birthday');
            $temp->Birthplace = $request->input('Birthplace');
            $temp->Tel = $request->input('Tel');
            $temp->Sex = $request->input('Sex');
            $temp->Teuteur = $request->input('Teuteur');
            $ID_URL=$request->input('ID_URL');
            if(isset($_FILES["ID_URL"])){

                Storage::delete($object->ID_URL);
                $temp->ID_URL = Storage::put('public/ID_URL', $request->file('ID_URL'));
            }
            if(isset($_FILES["Vaccine_URL"])){
                Storage::delete($object->Vaccine_URL);
                $temp->Vaccine_URL = Storage::put('public/Vaccine_URL', $request->file('Vaccine_URL'));
            }
            $object->update($temp->toArray());
        } catch (\Exception $e) {
            return response()->json('can\'t update the data', 404);
        }

        return response()->json(['status' => 'data updated successflly'], 200);
    }


    
   public function studentInfo($id){
    try{
    $student = Student_Profile::findOrFail($id);
    }
    catch(\Exception $e)
    {
        return response()->json('student is not found',404);
    }
    return json_encode($student);
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
            Storage::delete($student['ID_URL']);
            Storage::delete($student['Vaccine_URL']);
            $student->delete();
        } catch (\Exception $e) {
            return response()->json('data can\'t be updated', 404);
        }
        return response(['status' => 'student is deleted'], 204);
    }
}
