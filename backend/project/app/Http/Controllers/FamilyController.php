<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use setasaign\Fpdi\Fpdi;
use App\models\Family;
use App\models\Student_Profile;
use App\models\Student_inscription;
use App\models\Grades;
use App\Models\Bills;
use App\models\Options;
use App\models\Phone_fam;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Collection;
use DB;

class FamilyController extends Controller
{
    public function __construct(){}

    public function familyIdCard($id)
    {
        $pdf = new \setasign\Fpdi\Fpdi();
		$pagecount = $pdf->setSourceFile(dirname(__DIR__, 3).'\storage\Templates\Family_Card.pdf');

		$tpl = $pdf->importPage(1);
		$pdf->AddPage('L','A5');

		
		$pdf->useTemplate($tpl);
		$pdf->SetFont('Arial','B',28);
		//Recpnb 1
		$pdf->SetXY(73,70);
		$pdf->Cell(0,0,"fam_".$id);
		
		return $pdf->Output('S');
    }

    public function getStudents($id_family)
    {
        $School_Year=Options::where('option_name','registration_year')->get(['option_value']);
        $student = Student_Profile::join('student_inscriptions','student_inscriptions.id_student','=','student_profiles.id')
        ->join('grades','grades.id','=','student_inscriptions.id_grade')
        ->where('student_inscriptions.School_Year','=',$School_Year[0]->option_value)
        ->where('id_family',$id_family)
        ->get(['student_profiles.id','student_profiles.First_Name','student_profiles.Last_Name','grades.Name as Grade_Name']);
        if($student->count()==0)
        {
            return response()->json([],204);
        }
        
        return  response()->json($student,200);
    }

    public function getStudentsFinance($School_Year,$id_family)
    {
        try {
        $students = Student_Profile::join('student_inscriptions','student_inscriptions.id_student','=','student_profiles.id')
        ->join('grades','grades.id','=','student_inscriptions.id_grade')
        ->where('student_inscriptions.School_Year','=',$School_Year)
        ->where('student_inscriptions.Attending',1)
        ->where('id_family',$id_family)
        ->get(['student_profiles.id','student_profiles.First_Name','student_profiles.Last_Name','grades.Name as Grade_Name'
                ,'student_inscriptions.Inscription_Tax','student_inscriptions.Monthly_Total','student_inscriptions.Month_Start','student_inscriptions.Books/Uniform_total']);
        if($students->count()==0)
        {
            return response()->json([],204);
        }
        $students->transform(function($student,$key) use($School_Year){
            $inscription=Bills::where('id_student',$student->id)->where('School_Year',$School_Year)->where('Type','Inscription')->sum('Amount');
            $boouni=Bills::where('id_student',$student->id)->where('School_Year',$School_Year)->where('Type','BooksUniforms')->sum('Amount');
            $student['Inscription_Rest']=(int)$student['Inscription_Tax']-$inscription;
            $student['Books/Uniform_Rest']=(int)$student['Books/Uniform_total']-$boouni;
            //return  response()->json(['Rest'=>(int)$total['Monthly_Total'] -$bills],200);
            $mybills = Bills::where('id_student',$student->id)->where('School_Year',$School_Year)->where('Type','Monthly')->orderBy('created_at','desc')->get();
    
  
        // $tempMonth =(int)Options::select('option_value')->where('option_name','start_month')->first();
        $tempMonth= (int)$student['Month_Start'];
        $option = Options::select('option_value')->where('option_name','end_month')->first();
        $endMonth = (int)$option['option_value'];
        while (true) {
            if($tempMonth==$endMonth){
                if($mybills->contains('Month',$endMonth)){
                    $totalPayed = $mybills->where('Month',$endMonth)->sum('Amount');
                    //  echo $bill->sum('Amount');}//shila d8re 
                    $rest = (int)$student['Monthly_Total'] - $totalPayed;
                    $student['Pay_Start']=$tempMonth;
                    $student['Rest']=$rest<=0 ? 0 : $rest;
                }else{
                    $student['Pay_Start']=$tempMonth;
                    $student['Rest']=$student['Monthly_Total'];
                }
              break;
            }
        if($mybills->contains('Month',$tempMonth)){
            $totalPayed = $mybills->where('Month',$tempMonth)->sum('Amount');
             //  echo $bill->sum('Amount');}//shila d8re 
            $rest = (int)$student['Monthly_Total'] - $totalPayed;
            if($rest>0){
                    $student['Pay_Start']=$tempMonth;
                    $student['Rest']=$rest;
                    break;
                 }
               }else{
                   $student['Pay_Start']=$tempMonth;
                   $student['Rest']=$student['Monthly_Total'];
                   break;
          }
          $mybills=$mybills->where('Month','!=',$tempMonth);
          //echo json_encode($mybills->count().'     ');
          if($tempMonth!=$endMonth){
          $tempMonth++;}
          if($tempMonth > 12){$tempMonth=1;}
        } //End While
          return $student;
        });
        return  response()->json($students,200);

        } catch (Exception $e) {
            return response()->json($family, 404);
        }
        
    }
    public function store(Request $request)
    {
        //return response()->json(['request'=>$request],200);
        try {
            
            $validation=$request->validate([
                "Father_Name" => 'required',
                "Father_Profession" => 'required',
                "Father_Address" => 'required',
                "Mother_Name" => 'required',
                "Mother_Profession" => 'required',
                "Mother_Address" => 'required',
                "Comm_Phone" => 'required|numeric',
                "Comm_Owner" => 'required',
                "is_Whats" => 'required'
            ]);
            $data=Family::where([
                ['Father_Name','=',$request->input('Father_Name')]
            ])->orWhere([
                ['Mother_Name','=',$request->input('Mother_Name')]
            ])->orWhere([
                ['Comm_Phone','=',$request->input('Comm_Phone')]
            ])->get();
            if (!$data->isEmpty()) {
                return response()->json("data alreay exist", 200);
            }

            $temp=new Family;
            $temp->Father_Name=$request->input('Father_Name');
            $temp->Father_Profession=$request->input('Father_Profession');
            $temp->Father_Address=$request->input('Father_Address');
            $temp->Mother_Name=$request->input('Mother_Name');
            $temp->Mother_Profession=$request->input('Mother_Profession');
            $temp->Mother_Address=$request->input('Mother_Address');
            $temp->Comm_Phone=$request->input('Comm_Phone');
            $temp->Comm_Owner=$request->input('Comm_Owner');
            $temp->is_Whats=boolval($request->input('is_Whats'))? 1 : 0;
            $family = Family::Create($temp->toArray());
            if(isset($request->phones)){
                foreach ($request->phones as $phone){
                    $validation=Validator::make($phone,[
                        "Phone_Nb" =>'required|numeric',
                        "Owner_Type" =>'required',
                        "is_Whats" =>'required'
                    ]);
                    $tempPh=new Phone_fam;
                    $tempPh->id_Owner=$family->id;
                    $tempPh->Phone_Nb=$phone['Phone_Nb'];
                    $tempPh->Owner_Type=$phone['Owner_Type'];
                    $tempPh->is_Whats=boolval($phone['is_Whats'])? 1 : 0;
                    $newPh=Phone_fam::firstOrCreate($tempPh->toArray());
                }
            }
        }catch(TypeError $e){
            return response()->json($e, 404);
        } 
        catch (Exception $e) {
            return response()->json($e, 404);
        }
        $pdf =base64_encode(self::familyIdCard($family->id));
        return response()->json(['status'=>'data insereted successflly','id'=>$family->id,'pdf'=>$pdf],201);
    }

    public function index($limit,$search,$orderBy,$sort)
    {
    
        try {
            $allFamilies = Family::select('family.id','Comm_Phone','Father_Name','Mother_Name',DB::raw("count(*) AS Members"))
            ->where(
                function($q) use($search) {
                    if($search!='^'){
                        $q->where('family.id','LIKE', '%' . $search .'%')
                        ->orWhere('family.Comm_Phone','LIKE',$search .'%')
                        ->orWhere('family.Father_Name','LIKE','%' .$search .'%')
                        ->orWhere('family.Mother_Name','LIKE','%' .$search .'%');}
                    else{
                        $q->where('family.id','>',0);    
                    }
                })
            ->join("student_profiles",'family.id','=', 'student_profiles.id_family')
            ->groupBy('student_profiles.id_family','family.id','Comm_Phone','Father_Name','Mother_Name')
            ->orderBy('family.'.$orderBy,$sort)->paginate($limit);
       
        } catch (\Exception $e) {
            return response()->json($e, 404);
       }
        return response()->json($allFamilies, 206);
    }
    public function show($id_family)
    {
        try {
            $results=Family::where("id",$id_family)->first();
            if($results == null)
                return response()->json("No Family Found",204);
        $phoneNbs=Phone_fam::where("id_Owner",$id_family)->get();
        $results["phones"]=$phoneNbs;
        $members=Student_Profile::join('student_inscriptions','student_inscriptions.id_student','=','student_profiles.id')
        ->join('grades','grades.id','=','student_inscriptions.id_grade')
        ->where('id_family',$id_family)
        ->get(['student_profiles.id','student_profiles.First_Name','student_profiles.Last_Name','grades.Name as Grade_Name']);
        $results["members"]=$members;
        } catch (\Exception $th) {
            return response()->json($e, 404);
        }
        $pdf =base64_encode(self::familyIdCard($id_family));
        return response()->json(['data'=>$results,'pdf'=>$pdf],200);
    }

}