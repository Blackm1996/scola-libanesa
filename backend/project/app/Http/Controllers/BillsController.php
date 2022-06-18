<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student_Inscription;
use App\Models\Bills;
use App\Models\Student_Profile;
use App\Models\Options;
use Illuminate\Support\Arr;
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
       ->where('student_inscriptions.id_classroom',$id_classroom)->get(['First_Name','Last_Name','grades.Name as grade','Inscription_Tax','Books/Uniform_total']);
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

$PayedStduents= Student_Profile::select('student_profiles.id','student_inscriptions.id_grade',DB::raw('(student_inscriptions.Monthly_Total -'.\DB::raw("SUM(Amount)").') AS rest'),'student_inscriptions.id_classroom')
->leftjoin('bills','bills.id_student','student_profiles.id')->join('student_inscriptions','student_inscriptions.id_student','student_profiles.id')
->where('student_inscriptions.School_Year',$School_Year)->where('bills.School_Year',$School_Year)
->where('bills.Month',$month)
->where(
                function($q) use($search) { 
                    if($search!='^'){
          $q->where('student_profiles.id','LIKE','%' .$search .'%')
            ->orWhere('student_profiles.First_Name','LIKE','%' .$search .'%')
            ->orWhere('student_profiles.Last_Name','LIKE','%' .$search .'%');}
      })
             ->groupBy('student_profiles.id','student_inscriptions.id_grade','student_inscriptions.Monthly_Total','student_inscriptions.id_classroom');

$s= DB::table( DB::raw("({$PayedStduents->toSql()}) as sub") )->mergeBindings($PayedStduents->getQuery())->where('rest','>',0);



$student=Student_Profile::select('student_profiles.id','student_inscriptions.id_grade','student_inscriptions.Monthly_Total AS rest','student_inscriptions.id_classroom')->leftjoin('bills',function ($join) use($month,$School_Year) {
            $join->on('bills.id_student', '=', 'student_profiles.id')
                 ->where('bills.Month',$month)->where('bills.School_Year',$School_Year);
        })->leftjoin('student_inscriptions','student_inscriptions.id_student','student_profiles.id')->whereNull('bills.id')
        ->where('student_inscriptions.School_Year',$School_Year)
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

$count = DB::table( DB::raw("({$student->toSql()}) as sub") )->mergeBindings($student->getQuery())
->select('sub.id','student_profiles.First_Name','student_profiles.Last_Name','classrooms.Name as className','grades.Name as gradeName','sub.rest')
->leftjoin('classrooms','classrooms.id','sub.id_classroom')->leftjoin('grades','grades.id','sub.id_grade')
->join('student_profiles','student_profiles.id','sub.id')
   
   ->orWhere(      function($q) use($School_Year,$month) {/*
             $tempMonths= array();
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
            ->whereBetween($month,[9,10,11,12,1,2,3,4,5,6]);*/ 
      })->orderBy($orderBy,$sort)->get();
      $tot=0;
      foreach($count as $item)
      {
          $tot+=$item->rest;
      }
      $count=$count->concat([array("tot"=>$tot)]);
     }
      catch(\Exception $e)
      {
          return json_encode($e);
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
       ->where('student_profiles.id',$id)->get(['First_Name','Last_Name','grades.Name as grade','Inscription_Tax','Books/Uniform_total']);
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
    $table = Student_inscription::select('Month_Start','Monthly_total')->where('id_student',$id)->
    where('School_Year',$School_Year)->first();
    $mybills = Bills::where('id_student',$id)->where('School_Year',$School_Year)->orderBy('created_at','desc')->get();
    $response = array("startMonth"=>$table['Month_Start'],"bills"=>array());
  
   // $tempMonth =(int)Options::select('option_value')->where('option_name','start_month')->first();
    $tempMonth= (int)$table['Month_Start'];
    $option = Options::select('option_value')->where('option_name','end_month')->first();
    $endMonth = (int)$option['option_value'];
    $continue = true;
    while ($tempMonth!=$endMonth || $continue) {
        if($tempMonth==$endMonth){$continue=false;}
        if($mybills->contains('Month',$tempMonth)){
            $totalPayed = $mybills->where('Month',$tempMonth)->sum('Amount');
             //  echo $bill->sum('Amount');}//shila d8re 
            $rest = $table['Monthly_total'] - $totalPayed;
            if($rest<=0){
             $response['bills'][]=array(
                'month'=>$tempMonth,
                'payed'=>$totalPayed,
                'totalCost'=>$table['Monthly_total'],
                'theRest' =>$rest,
                'status'=>'true'
            );}
            else{
                $response['bills'][]=array(
                    'month'=>$tempMonth,
                    'payed'=>$totalPayed,
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
                     'totalCost'=>$table['Monthly_total'],
                     'theRest' =>$table['Monthly_total'],
                     'status'=>'true');
                }
                else
                {
                     $response['bills'][]=array(
                     'month'=>$tempMonth,
                     'payed'=>'0',
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
            }
            catch(\Exception $e)
            {
                return response()->json("something went wrong",404);
            }
           return json_encode($response);
/*
     $continue=true;
    // continue variable is the variable to let the loop while count the current month and dont stop before it
    $monthstate=true;
    // monthstate boolean variable i set it for the while loop if the current month is equal to the monthstart so the whille loop will count 12 month recusrvily   
    
    
    $tempMonth= (int)$table['Month_Start'];
    if($tempMonth==$currentMonth){$monthstate=false;}
   
  //  while($mybills->count()>0 || $continue){
     // 5od awal shaher balsh ydaf3 fi wshof iza nafs l startmonth iza la2a 7ot sfora ya3ne awal sahher ma dafa3 
     // w iza eh bkoun dafa3 w iza zedna 3an l 12 raje3a 3al wa7d w araka ames
     //echo $tempMonth. PHP_EOL;
    //echo $mybills->count().PHP_EOL;
    if($tempMonth==$currentMonth && $monthstate ){$continue=false;}
    $monthstate=true; 
    if($mybills->contains('Month',$tempMonth)){
    $totalPayed = $mybills->where('Month',$tempMonth)->sum('Amount');
     //  echo $bill->sum('Amount');}//shila d8re 
    $rest = $table['Monthly_total'] - $totalPayed;
    if($rest==0){
     $response['bills'][]=array(
        'month'=>$tempMonth,
        'payed'=>$totalPayed,
        'totalCost'=>$table['Monthly_total'],
        'theRest' =>$rest,
        'status'=>'true'
    );}
    else{
        $response['bills'][]=array(
            'month'=>$tempMonth,
            'payed'=>$totalPayed,
            'totalCost'=>$table['Monthly_total'],
            'theRest' =>$rest,
            'status'=>'false'
        ); }
       }else{
      //   echo $bill->Month.'    '.$table['Month_Start'].PHP_EOL.$currentMonth;
   
  //   echo $a. PHP_EOL;
   
        
            $response['bills'][]=array(
            'month'=>$tempMonth,
            'payed'=>'0',
            'totalCost'=>$table['Monthly_total'],
            'theRest' =>$table['Monthly_total'],
            'status'=>'false'
        );
  }
  $mybills=$mybills->where('Month','!=',$tempMonth);
  //echo json_encode($mybills->count().'     ');
  $tempMonth++;
  if($tempMonth > 12){$tempMonth=1;}}
    }
    catch(\Exception $e)
    {
        return response()->json("something went wrong",404);
    }
   return json_encode($response);}*/
}





public function Rest($id,$School_Year,$month)
{

try{
    $bills =  Bills::where('id_student',$id)->where('School_Year',$School_Year)->where('Month',$month)->sum('Amount');
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
  $response=Bills::join('student_profiles','student_profiles.id','bills.id_student')->where('Month',$month)->where('School_Year',$School_Year)->
  get(["student_profiles.id",db::raw("CONCAT(student_profiles.First_Name,' ',student_profiles.Last_Name) AS name"),"Amount","bills.created_at as date","bills.paymentType as type"]);
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
      $response=Bills::where('id_student',$id)->where('School_Year',$School_Year)->where('Month',$month)->get();//}
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
