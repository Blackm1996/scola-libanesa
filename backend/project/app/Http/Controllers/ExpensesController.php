<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Expenses;
use App\Models\Options;
class ExpensesController extends Controller
{
    public function addExpenses(Request $request)
    {
        try{
           $School_Year= Options::where('option_name','=','School_Year')->first();
           $newobject= new Expenses;
           $newobject->Amount=$request->input('Amount');
           $newobject->Date=$request->input('Date');
           $newobject->Description=$request->input('Description');
           $newobject->transaction_type=$request->input('transaction_type');
           $newobject->School_Year=$School_Year->option_value;
           Expenses::firstOrCreate($newobject->toArray());
        }
        catch(\Exception $e)
        {
            return response()->json(['status'=>$e],400);
        }
    }

    public function getExpenses($month)
    {
    try{
      $School_Year= Options::where('option_name','=','School_Year')->first();
     if($month=="null"){
        $response=Expenses::where('School_Year',$School_Year->option_value)
        ->get();
        return $response;
       }
     else{
        $response=Expenses::whereMonth('Date',$month)
        ->where('School_Year',$School_Year->option_value)
        ->get();
        return $response;
       }
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
