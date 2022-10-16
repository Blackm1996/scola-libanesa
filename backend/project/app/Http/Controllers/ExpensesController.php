<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Expenses;
use App\Models\Options;
use DB;
class ExpensesController extends Controller
{
    public function addExpenses(Request $request)
    {
        try{
           
           Expenses::Create($request->all());
        }
        catch(\Exception $e)
        {
            return response()->json(['status'=>$e],400);
        }
        return response()->json(['status'=>'data insereted successflly','success'=>'true'],201);
    }

    public function getExpenses($from,$to,$transaction,$category,$limit)
    {
    try{
      $response=Expenses::select(DB::raw('DATE(created_at) as Date'),'Amount','Category','Description');
     if($to=="null"){
        $response=$response->where(DB::raw('DATE(created_at)'),$from);
       }
     else{
        $response=$response->whereBetween(DB::raw('DATE(created_at)'),[$from,$to]);
       }
       if($transaction!='^')
        $response=$response->where("Transaction_type",$transaction);
       if($category!='^')
        $response=$response->where('Category',$category);
        $response=$response->orderBy('created_at','desc');
       $total=$response->sum("Amount");
       $data=$response->paginate($limit);
       return response()->json(['data'=>$data,"total"=>$total],200);
    }
    catch(\Exception $e)
    {
        return response()->json(['status'=>$e],400);
    }
    }

  public function getTotalExpenses($month)
    {
    try{
      $School_Year= Options::where('option_name','=','School_Year')->first();
     if($month=="null"){
        $response=Expenses::where('School_Year',$School_Year->option_value)
        ->sum('Amount');
        return $response;
       }
     else{
        $response=Expenses::whereMonth('Date',$month)
        ->where('School_Year',$School_Year->option_value)
        ->sum('Amount');
        return $response;
       }
    }
    catch(\Exception $e)
    {
        return response()->json(['status'=>$e],400);
    }
    }


}
