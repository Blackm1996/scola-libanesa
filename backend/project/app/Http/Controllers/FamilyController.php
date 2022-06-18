<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use setasaign\Fpdi\Fpdi;
use App\models\Family;
use App\models\Student_Profile;
use App\models\Student_inscription;
use App\models\Grades;
use App\models\Options;
use App\models\Phone_fam;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Collection;

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
        $School_Year=Options::where('option_name','School_Year')->get(['option_value']);
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
                        "is_Whats" =>'requireds'
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
            return response()->json($family, 404);
        } 
        catch (Exception $e) {
            return response()->json($family, 404);
        }
        $pdf =base64_encode(self::familyIdCard($family->id));
        return response()->json(['status'=>'data insereted successflly','id'=>$family->id,'pdf'=>$pdf],201);
    }

}