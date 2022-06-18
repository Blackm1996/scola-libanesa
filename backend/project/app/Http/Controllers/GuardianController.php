<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use setasaign\Fpdi\Fpdi;
use App\models\Guardian;
use App\models\Phone_guar;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Collection;

class GuardianController extends Controller
{
    public function __construct(){}

    public function guardianIdCard($id)
    {
        $pdf = new \setasign\Fpdi\Fpdi();
		$pagecount = $pdf->setSourceFile(dirname(__DIR__, 3).'\storage\Templates\Guardian_Card.pdf');

		$tpl = $pdf->importPage(1);
		$pdf->AddPage('L','A5');

		
		$pdf->useTemplate($tpl);
		$pdf->SetFont('Arial','B',28);
		//Recpnb 1
		$pdf->SetXY(73,70);
		$pdf->Cell(0,0,"guar_".$id);
		
		return $pdf->Output('S');
    }


    public function store(Request $request)
    {
        //return response()->json(['request'=>$request],200);
        try {
            
            $validation=$request->validate([
                "Name" => 'required',
                "Profession" => 'required',
                "Address" => 'required',
                "Comm_Phone" => 'required|numeric',
                "is_Whats" => 'required'
            ]);
            $data=Guardian::where([
                ['Name','=',$request->input('Name')]
            ])->orWhere([
                ['Comm_Phone','=',$request->input('Comm_Phone')]
            ])->get();
            if (!$data->isEmpty()) {
                return response()->json("data alreay exist", 200);
            }

            $temp=new Guardian;
            $temp->Name=$request->input('Name');
            $temp->Profession=$request->input('Profession');
            $temp->Address=$request->input('Address');
            $temp->Comm_Phone=$request->input('Comm_Phone');
            $temp->is_Whats=boolval($request->input('is_Whats'))? 1 : 0;
            $guardian = Guardian::Create($temp->toArray());
            if(isset($request->phones)){
                foreach ($request->phones as $phone){
                    $validation=Validator::make($phone,[
                        "Phone_Nb" =>'required|numeric',
                        "is_Whats" =>'requireds'
                    ]);
                    $tempPh=new Phone_guar;
                    $tempPh->id_Owner=$guardian->id;
                    $tempPh->Phone_Nb=$phone['Phone_Nb'];
                    $tempPh->is_Whats=boolval($phone['is_Whats'])? 1 : 0;
                    $newPh=Phone_guar::firstOrCreate($tempPh->toArray());
                }
            }
        }catch(TypeError $e){
            return response()->json($guardian, 404);
        } 
        catch (Exception $e) {
            return response()->json($guardian, 404);
        }
        //$pdf =base64_encode(self::guardianIdCard($guardian->id));
        return response()->json(['status'=>'data insereted successflly','id'=>$guardian->id],201);
    }

    public function getAll()
    {
        try {
            $guardians=Guardian::select('id','Name','Comm_Phone')->get();
        } catch (Exception $e) {
            return response()->json('something went wrong', 404);
       }
       return json_encode($guardians);
    }

}