<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\Student_Inscription;
use App\Models\Bills;
use App\Models\Student_Profile;
use App\Models\Options;
use App\Models\Invoice;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Validator;
use DateInterval;

use DB;
class BillsController extends Controller
{

/*
    public function __construct(){

        $this->middleware('auth');
    }*/ 
                 



  public function sectionBills($id_classroom,$School_Year){
         try{
       $response = Student_Profile::join('student_inscriptions','student_inscriptions.id_student','=','student_profiles.id')
       ->join('grades','grades.id','=','student_inscriptions.id_grade')->where('student_inscriptions.School_Year',$School_Year)
       ->where('student_inscriptions.Attending',1)
       ->where('student_inscriptions.id_classroom',$id_classroom)->get(['student_profiles.id as id','First_Name','Last_Name','grades.Name as grade','Inscription_Tax','Books/Uniform_total']);
       return json_encode($response);
         }
         catch(\Exception $e)
         {
             return response()->json($e,400);
         }
    }


















/*
public function studentNotpayed($month,$School_Year,$search,$limit,$orderBy,$sort){


 //   try{
  // $sub = Bills::select('id_student',\DB::raw("SUM(Amount) as total"))->where('School_Year',$School_Year)->where('Month',$month)->groupBy('id_student')->get();
   /*DB::table(DB::raw("({$sub->toSql()}) as t1"))
    ->mergeBindings($sub)
    ->join('student_inscriptions','t1.id_student','student_inscriptions.id_student')->join('student_profiles','t1.id_student','student_profiles.id')->where('student_inscriptions.School_Year',$School_Year)->where('t1.total','<','student_inscriptions.Monthly_Total');*/
 /*  $student= Student_Profile::select('student_profiles.id','SUM(bills.Amount)')->join('bills','bills.id_student','student_profiles.id')->join('student_inscriptions','student_inscriptions.id_student','student_profiles.id')->where('bills.School_Year',$School_Year)->where('bills.Month',$month)
->where('student_inscriptions.Monthly_Total','!=','sum(\'Amount\')')->groupBy('student_profiles.id')->simplePaginate(15);*/
/*$student= Student_Profile::select('student_profiles.id')->join('bills','bills.id_student','student_profiles.id')->join('student_inscriptions','student_inscriptions.id_student','student_profiles.id')->where('bills.School_Year',$School_Year)->where('bills.Month',$month)
->whereHas('student_inscriptions.Monthly_Total','>',\DB::raw("SUM(Amount) as total"))->groupBy('student_profiles.id')->simplePaginate(15);*/

/*
$PayedStduents= Bills::select('id_student',DB::raw("SUM(Amount)".' AS amount'))->where('bills.School_Year',$School_Year)->where('bills.Month',$month)
             ->groupBy('id_student');





$student=Student_Profile::select('student_profiles.id','student_profiles.Tel','student_inscriptions.id_grade','student_inscriptions.Monthly_Total AS amount','student_inscriptions.id_classroom')->leftjoin('student_inscriptions','student_inscriptions.id_student','student_profiles.id')
->where( function($q) use($month) {

          if($month >=9 && $month <=12){
         $q->whereBetween('student_inscriptions.Month_Start',[9,$month]);
         }
         if($month >=1 && $month <=6)
         {  
             $q->whereBetween('student_inscriptions.Month_Start',[$month,12]);}
         }
             );

/*
$count = DB::table( DB::raw("({$student->toSql()}) as sub") )->mergeBindings($student->getQuery())->select('sub.id','student_profiles.First_Name','student_profiles.Last_Name','sub.Tel','classrooms.Name as className','grades.Name as gradeName')->leftjoin('classrooms','classrooms.id','sub.id_classroom')->leftjoin('grades','grades.id','sub.id_grade')->leftjoin('student_profiles','student_profiles.id','sub.id')
   ->where(
                function($q) use($search) { 
                    if($search!='^'){
          $q->where('sub.id','LIKE','%' .$search .'%')
            ->orWhere('student_profiles.First_Name','LIKE','%' .$search .'%')
            ->orWhere('student_profiles.Last_Name','LIKE','%' .$search .'%');}
      })
   ->where('sub.rest','!=',0)
   ->orWhere(      function($q) use($School_Year,$month) {
           /*  $tempMonths= array();
          list($one, $two) = explode("-",$School_Year,2);
          if($month > 8 and $month <=12){$year=$one;}
          else{$month=$two;}
           $start    = (new \DateTime(CONCAT($one,'student_inscriptions.Month_Start','01'))->modify('first day of this month');
           $end      = (new \DateTime(CONCAT($two,'6','01'))->modify('first day of next month');
           $interval = DateInterval::createFromDateString('1 month');
           $period   = new \DatePeriod($start, $interval, $end);
           foreach ($period as $dt) {
         echo array_push($tempMonths,$dt->format("m"));
           }
          $q->where('sub.School_Year',$School_Year)
            ->whereBetween($month,[9,10,11,12,1,2,3,4,5,6]); 
      })->orderBy($orderBy,$sort)->paginate($limit);// }*/
  //    catch(\Exception $e)
  //    {
     //     return json_encode($e);
   //   }
 /*  return json_encode($student->get());
}*/

public function studentNotpayed($month,$School_Year,$search,$orderBy,$sort){
    try{
$ass=0;
$PayedStduents= Student_Profile::select('student_profiles.id','student_inscriptions.id_grade',DB::raw('(student_inscriptions.Monthly_Total -'.\DB::raw("SUM(Amount)").') AS rest'),'student_inscriptions.id_classroom')
->leftjoin('bills','bills.id_student','student_profiles.id')->join('student_inscriptions','student_inscriptions.id_student','student_profiles.id')
->where('student_inscriptions.School_Year',$School_Year)->where('bills.School_Year',$School_Year)
->where('student_inscriptions.Attending',1)
->where('bills.Month',$month)
->where('bills.Type','Monthly')
->where(
                function($q) use($search) { 
                    if($search!='^'){
          $q->where('student_profiles.id','LIKE','%' .$search .'%')
            ->orWhere('student_profiles.First_Name','LIKE','%' .$search .'%')
            ->orWhere('student_profiles.Last_Name','LIKE','%' .$search .'%');}
      })
             ->groupBy('student_profiles.id','student_inscriptions.id_grade','student_inscriptions.Monthly_Total','student_inscriptions.id_classroom');

$ass++;
$s= DB::table( DB::raw("({$PayedStduents->toSql()}) as sub") )->mergeBindings($PayedStduents->getQuery())->where('rest','>',0);

$ass++;

$student=Student_Profile::select('student_profiles.id','student_inscriptions.id_grade','student_inscriptions.Monthly_Total AS rest','student_inscriptions.id_classroom')->leftjoin('bills',function ($join) use($month,$School_Year) {
            $join->on('bills.id_student', '=', 'student_profiles.id')
                 ->where('bills.Month',$month)->where('bills.Type','Monthly')->where('bills.School_Year',$School_Year);
        })->leftjoin('student_inscriptions','student_inscriptions.id_student','student_profiles.id')->whereNull('bills.id')
        ->where('student_inscriptions.School_Year',$School_Year)
        ->where('student_inscriptions.Attending',1)
        ->where('student_inscriptions.Monthly_Total',"!=",0)
        ->where(
                function($q) use($search) { 
                    if($search!='^'){
          $q->where('student_profiles.id','LIKE','%' .$search .'%')
            ->orWhere('student_profiles.First_Name','LIKE','%' .$search .'%')
            ->orWhere('student_profiles.Last_Name','LIKE','%' .$search .'%');}
      })
        ->where( function($q) use($month) {

          if($month >=9 && $month <=12){
         $q->whereBetween('student_inscriptions.Month_Start',[9,$month]);
         }
         if($month >=1 && $month <=6)
         {  
            $q->whereIn('student_inscriptions.Month_Start',[9,10,11,12])->orWhere('student_inscriptions.Month_Start','<=',$month);}
         }
             )->union($s);
$ass++;
$count = DB::table( DB::raw("({$student->toSql()}) as sub") )->mergeBindings($student->getQuery())
->select('sub.id','student_profiles.First_Name','student_profiles.Last_Name','classrooms.Name as className','grades.Name as gradeName','sub.rest')
->leftjoin('classrooms','classrooms.id','sub.id_classroom')->leftjoin('grades','grades.id','sub.id_grade')
->join('student_profiles','student_profiles.id','sub.id')
   
->orderBy($orderBy,$sort)->get();
$ass++;
      $tot=0;
      foreach($count as $item)
      {
          $tot+=$item->rest;
      }
      $count=$count->concat([array("tot"=>$tot)]);
     }
      catch(\Exception $e)
      {
          return json_encode(["ass"=>$ass,"query"=>$student->toSql()]);
      }
   return json_encode($count);
}


   

public function months()
{
    return array(1,2,3,4);
}




 public function showPrinter($id,$School_Year){
         try{
       $response = Student_Profile::join('student_inscriptions','student_inscriptions.id_student','=','student_profiles.id')
       ->join('grades','grades.id','=','student_inscriptions.id_grade')->where('student_inscriptions.School_Year',$School_Year)
       ->where('student_inscriptions.Attending',1)
       ->where('student_profiles.id',$id)->get(['student_profiles.id as id','First_Name','Last_Name','grades.Name as grade','Inscription_Tax','Books/Uniform_total']);
       return json_encode($response->first());
         }
         catch(\Exception $e)
         {
             return response()->json($e,400);
         }
    }




    static $tempMonth=0;
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
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

    protected function normalize($word)
        {
                   
            $word = str_replace("@","%40",$word);
            $word = str_replace("`","%60",$word);
            $word = str_replace("¢","%A2",$word);
            $word = str_replace("£","%A3",$word);
            $word = str_replace("¥","%A5",$word);
            $word = str_replace("|","%A6",$word);
            $word = str_replace("«","%AB",$word);
            $word = str_replace("¬","%AC",$word);
            $word = str_replace("¯","%AD",$word);
            $word = str_replace("º","%B0",$word);
            $word = str_replace("±","%B1",$word);
            $word = str_replace("ª","%B2",$word);
            $word = str_replace("µ","%B5",$word);
            $word = str_replace("»","%BB",$word);
            $word = str_replace("¼","%BC",$word);
            $word = str_replace("½","%BD",$word);
            $word = str_replace("¿","%BF",$word);
            $word = str_replace("À","%C0",$word);
            $word = str_replace("Á","%C1",$word);
            $word = str_replace("Â","%C2",$word);
            $word = str_replace("Ã","%C3",$word);
            $word = str_replace("Ä","%C4",$word);
            $word = str_replace("Å","%C5",$word);
            $word = str_replace("Æ","%C6",$word);
            $word = str_replace("Ç","%C7",$word);
            $word = str_replace("È","%C8",$word);
            $word = str_replace("É","%C9",$word);
            $word = str_replace("Ê","%CA",$word);
            $word = str_replace("Ë","%CB",$word);
            $word = str_replace("Ì","%CC",$word);
            $word = str_replace("Í","%CD",$word);
            $word = str_replace("Î","%CE",$word);
            $word = str_replace("Ï","%CF",$word);
            $word = str_replace("Ð","%D0",$word);
            $word = str_replace("Ñ","%D1",$word);
            $word = str_replace("Ò","%D2",$word);
            $word = str_replace("Ó","%D3",$word);
            $word = str_replace("Ô","%D4",$word);
            $word = str_replace("Õ","%D5",$word);
            $word = str_replace("Ö","%D6",$word);
            $word = str_replace("Ø","%D8",$word);
            $word = str_replace("Ù","%D9",$word);
            $word = str_replace("Ú","%DA",$word);
            $word = str_replace("Û","%DB",$word);
            $word = str_replace("Ü","%DC",$word);
            $word = str_replace("Ý","%DD",$word);
            $word = str_replace("Þ","%DE",$word);
            $word = str_replace("ß","%DF",$word);
            $word = str_replace("à","%E0",$word);
            $word = str_replace("á","%E1",$word);
            $word = str_replace("â","%E2",$word);
            $word = str_replace("ã","%E3",$word);
            $word = str_replace("ä","%E4",$word);
            $word = str_replace("å","%E5",$word);
            $word = str_replace("æ","%E6",$word);
            $word = str_replace("ç","%E7",$word);
            $word = str_replace("è","%E8",$word);
            $word = str_replace("é","%E9",$word);
            $word = str_replace("ê","%EA",$word);
            $word = str_replace("ë","%EB",$word);
            $word = str_replace("ì","%EC",$word);
            $word = str_replace("í","%ED",$word);
            $word = str_replace("î","%EE",$word);
            $word = str_replace("ï","%EF",$word);
            $word = str_replace("ð","%F0",$word);
            $word = str_replace("ñ","%F1",$word);
            $word = str_replace("ò","%F2",$word);
            $word = str_replace("ó","%F3",$word);
            $word = str_replace("ô","%F4",$word);
            $word = str_replace("õ","%F5",$word);
            $word = str_replace("ö","%F6",$word);
            $word = str_replace("÷","%F7",$word);
            $word = str_replace("ø","%F8",$word);
            $word = str_replace("ù","%F9",$word);
            $word = str_replace("ú","%FA",$word);
            $word = str_replace("û","%FB",$word);
            $word = str_replace("ü","%FC",$word);
            $word = str_replace("ý","%FD",$word);
            $word = str_replace("þ","%FE",$word);
            $word = str_replace("ÿ","%FF",$word);

            return urldecode($word);
        }

    public function generate_Invoice($id)
    {
        $invoice=Invoice::firstWhere("id",$id);

        $pdf = new \setasign\Fpdi\Fpdi();
		$pagecount = $pdf->setSourceFile(dirname(__DIR__, 3).'\storage\Templates\fatura_template.pdf');

		$tpl = $pdf->importPage(1);
		$pdf->AddPage();

		
		$pdf->useTemplate($tpl);
		$pdf->SetFont('Arial','',14);
        $pdf->useTemplate($tpl);
		$pdf->SetFont('Arial','',14);
		//Recpnb 1
		$pdf->SetXY(161,33);
		$pdf->Cell(0,0,self::normalize('ELI_'.$invoice["id"]));
		//Date
		$pdf->SetXY(148,47);
		$pdf->Cell(0,0,date("d/m/Y"));
		//family ID 1
		$pdf->SetXY(50,51);
		$pdf->Cell(0,0,self::normalize('fam_'.$invoice["id_family"]));
		//Student Name 1
		$pdf->SetXY(24,56.4);
		$pdf->MultiCell(175,8.1,self::normalize('                             '.$invoice["Students"]),0,"L");
		//School Year 1
		$pdf->SetXY(52,77);
		$pdf->Cell(0,0,self::normalize($invoice["School_Year"]));

		//Montante 1
		$pdf->SetXY(108,77);
		$pdf->Cell(0,0,self::normalize($invoice['Amount'].' xCFA'));

		//Description 1
		$pdf->SetXY(24,81.5);
		$pdf->MultiCell(175,8.1,self::normalize('                      '.$invoice['Description']),0,"L");

		$pdf->SetFont('Arial','',11);
		//Class
		$pdf->SetXY(40.4,100);
		$pdf->MultiCell(153,6,self::normalize($invoice['Classes']),0,"L");
		$pdf->SetFont('Arial','',14);

		$pdf->Line(0,148.85,210,148.85);


		//Recpnb 2
		$pdf->SetXY(161,177);
		$pdf->Cell(0,0,self::normalize('ELI_'.$invoice["id"]));
		//Date
		$pdf->SetXY(148,191);
		$pdf->Cell(0,0,date("d/m/Y"));
		//family ID 2
		$pdf->SetXY(50,195);
		$pdf->Cell(0,0,self::normalize('fam_'.$invoice["id_family"]));
		//Student Name 2
		$pdf->SetXY(24,200.4);
		$pdf->MultiCell(175,8.1,self::normalize('                             '.$invoice["Students"]),0,"L");
		//School Year 2
		$pdf->SetXY(52,221);
		$pdf->Cell(0,0,self::normalize($invoice["School_Year"]));

		//Montante 2
		$pdf->SetXY(108,221);
		$pdf->Cell(0,0,self::normalize($invoice['Amount'].' xCFA'));

		//Description 2
		$pdf->SetXY(24,225.5);
		$pdf->MultiCell(175,8.1,self::normalize('                      '.$invoice['Description']),0,"L");

		$pdf->SetFont('Arial','',11);
		//Class 2
		$pdf->SetXY(40.4,244);
		$pdf->MultiCell(153,6,self::normalize($invoice['Classes']),0,"L");
		$pdf->SetFont('Arial','',14);
        return $pdf->Output('S');
    }
    public function store_family(Request $request)
    {
        try {
            $invoice=Invoice::Create($request->fatura);
        foreach ($request->data as $payment) {
            $temp=$payment;
            if(strcmp($temp['paymentType'],'pardoned')!=0)
                $temp['id_invoice']=$invoice->id;
            Bills::Create($temp);
        }
        } catch(Exception $e){
            return response()->json($e,400);
        }
        $pdf=base64_encode(self::generate_Invoice($invoice->id));
        return response()->json(['status'=>'data insereted successflly','pdf'=>$pdf],201);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try{
        // Data validation "School_Year","Month","id_student","Amount"  
        $validation = $request->validate([
            'Month'=>'required|numeric|min:1',
            'id_student' => 'required',
            'School_Year'=>'required',
            'Amount' => 'required|numeric|min:1',
            'paymentType' => 'required',
        ]);
        $student=Bills::Create($request->all());}
        catch(\Exception $e){
            return response()->json("something went wrong",400);
        }
        return response()->json(['status'=>'data insereted successflly','success'=>'true'],201);

    }

   
    public function allBills($id,$School_Year){
       try{
        // get the current month
        $currentMonth = (int)date('m');     
       // echo $currentMonth.PHP_EOL;
    $table = Student_inscription::select('Month_Start','Monthly_total','Inscription_Tax','Books/Uniform_total')->where('id_student',$id)->
    where('School_Year',$School_Year)->first();
    $mybills = Bills::where('id_student',$id)->where('School_Year',$School_Year)->where('Type','Monthly')
    ->orderBy('created_at','desc')->get();
    $response = array("startMonth"=>$table['Month_Start'],"bills"=>array(),"other"=>array());
  
   // $tempMonth =(int)Options::select('option_value')->where('option_name','start_month')->first();
    $tempMonth= (int)$table['Month_Start'];
    $option = Options::select('option_value')->where('option_name','end_month')->first();
    $endMonth = (int)$option['option_value'];
    $continue = true;
    while ($tempMonth!=$endMonth || $continue) {
        if($tempMonth==$endMonth){$continue=false;}
        if($mybills->contains('Month',$tempMonth)){
            $totalPayed = $mybills->where('Month',$tempMonth)->where('paymentType','!=',"pardoned")->sum('Amount');
            $pardoned=$mybills->where('Month',$tempMonth)->where('paymentType',"pardoned")->sum('Amount');
             //  echo $bill->sum('Amount');}//shila d8re 
            $rest = $table['Monthly_total'] - $totalPayed-$pardoned;
            if($rest<=0){
             $response['bills'][]=array(
                'month'=>$tempMonth,
                'payed'=>$totalPayed,
                'pardoned'=>$pardoned,
                'totalCost'=>$table['Monthly_total'],
                'theRest' =>$rest,
                'status'=>'true'
            );}
            else{
                $response['bills'][]=array(
                    'month'=>$tempMonth,
                    'payed'=>$totalPayed,
                    'pardoned'=>$pardoned,
                    'totalCost'=>$table['Monthly_total'],
                    'theRest' =>$rest,
                    'status'=>'false'
                ); }
               }else{
                   
                if($table['Monthly_total'] == 0)
                {
                     $response['bills'][]=array(
                     'month'=>$tempMonth,
                     'payed'=>'0',
                     'pardoned'=>'0',
                     'totalCost'=>$table['Monthly_total'],
                     'theRest' =>$table['Monthly_total'],
                     'status'=>'true');
                }
                else
                {
                     $response['bills'][]=array(
                     'month'=>$tempMonth,
                     'payed'=>'0',
                     'pardoned'=>'0',
                     'totalCost'=>$table['Monthly_total'],
                     'theRest' =>$table['Monthly_total'],
                     'status'=>'false');
                }
          }
          $mybills=$mybills->where('Month','!=',$tempMonth);
          //echo json_encode($mybills->count().'     ');
          if($tempMonth!=$endMonth){
          $tempMonth++;}
          if($tempMonth > 12){$tempMonth=1;}}

            $mybills = Bills::where('id_student',$id)->where('School_Year',$School_Year)->where('Type','Inscription')
            ->orderBy('created_at','desc')->get();
            $totalPayed = $mybills->where('paymentType','!=',"pardoned")->sum('Amount');
            $pardoned=$mybills->where('paymentType',"pardoned")->sum('Amount');
             //  echo $bill->sum('Amount');}//shila d8re 
            $rest = $table['Inscription_Tax'] - $totalPayed-$pardoned;
            if($rest<=0){
                $response['other'][]=array(
                   'type'=>"Inscription",
                   'payed'=>$totalPayed,
                   'pardoned'=>$pardoned,
                   'totalCost'=>$table['Inscription_Tax'],
                   'theRest' =>$rest,
                   'status'=>'true'
               );}
               else{
                   $response['other'][]=array(
                    'type'=>"Inscription",
                    'payed'=>$totalPayed,
                    'pardoned'=>$pardoned,
                    'totalCost'=>$table['Inscription_Tax'],
                    'theRest' =>$rest,
                    'status'=>'false'
                   ); }

                   $mybills = Bills::where('id_student',$id)->where('School_Year',$School_Year)->where('Type','BooksUniforms')
            ->orderBy('created_at','desc')->get();
            $totalPayed = $mybills->where('paymentType','!=',"pardoned")->sum('Amount');
            $pardoned=$mybills->where('paymentType',"pardoned")->sum('Amount');
             //  echo $bill->sum('Amount');}//shila d8re 
            $rest = $table['Books/Uniform_total'] - $totalPayed-$pardoned;
            if($rest<=0){
                $response['other'][]=array(
                   'type'=>"BooksUniforms",
                   'payed'=>$totalPayed,
                   'pardoned'=>$pardoned,
                   'totalCost'=>$table['Books/Uniform_total'],
                   'theRest' =>$rest,
                   'status'=>'true'
               );}
               else{
                   $response['other'][]=array(
                    'type'=>"BooksUniforms",
                    'payed'=>$totalPayed,
                    'pardoned'=>$pardoned,
                    'totalCost'=>$table['Books/Uniform_total'],
                    'theRest' =>$rest,
                    'status'=>'false'
                   ); }
            }
            catch(\Exception $e)
            {
                return response()->json($e,404);
            }
           return json_encode($response);

}





public function Rest($id,$School_Year,$month)
{

try{
    $bills =  Bills::where('id_student',$id)->where('School_Year',$School_Year)->where('Type','Monthly')
    ->where('Month',$month)->sum('Amount');
    $total = Student_Inscription::select('Monthly_Total')->where('id_student',$id)->where('School_Year',$School_Year)->first();
    return  response()->json(['Rest'=>(int)$total['Monthly_Total'] -$bills],200);

}
catch(\Exception $e)
{
 return response()->json('somthing wrong happend',404);
}

}

 public function allMonths($id,$School_Year)
  {
    try{
    $startMonth = Student_Inscription::select('Month_Start')->where('id_student',$id)->where('School_Year',$School_Year)->first();
    $tempMonth = $startMonth['Month_Start'];
    $endMonth=Options::select('option_value')->where('option_name','end_month')->first();
    $endMonth=(int)$endMonth['option_value'];
    $months = array();
    while($tempMonth!=$endMonth)
    {
     if($tempMonth>12){$tempMonth=1;}   
     array_push($months,$tempMonth);
     $tempMonth++;
     }
    // pushh the last variable to our array
     array_push($months,$tempMonth);
    return json_encode($months); }
   catch(\Exception $e)
   {
       return response()->json('student is not inscripted',400);
   } 
  }


 public function allMonthBills($month,$School_Year)
 {
//try{
  $response=Bills::join('student_profiles','student_profiles.id','bills.id_student')->where(db::raw("Month(created_at)"),$month)->where('School_Year',$School_Year)->where('Type','Monthly')->
  get(["student_profiles.id",db::raw("CONCAT(student_profiles.First_Name,' ',student_profiles.Last_Name) AS name"),"Amount","bills.Month","bills.paymentType as type"]);
  return json_encode($response);
 //}
//catch(\Exception $e)
//{
//return response()->json(["status"=>"false"],400);
//}
}


 public function showYears($id)
 {
   try{
   $allYears = Student_Inscription::select('School_Year')->where('id_student',$id)->groupBy('School_Year')->get();
   }
   catch(\Exception $e){
     return response()->json(null,204);
   } 
   return json_encode($allYears);
 }






    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id,$month,$School_Year)
    {
        //try{
      $response=Bills::where('id_student',$id)->where('School_Year',$School_Year)->where('bills.Type','Monthly')->where('Month',$month)->get();//}
      //catch(\Exception $e)
        //{
        // return response()->json("something went wrong",404);
    //    }
        if($response->count()>0){return json_encode($response); }
        else   return response()->json(['status'=>'No data found'],204);
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
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
