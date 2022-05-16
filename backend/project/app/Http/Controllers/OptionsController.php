<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Options;
use App\Models\Score_Type;
use Illuminate\Support\Facades\Storage;

class OptionsController extends Controller
{


    /*
    public function __construct(){

        $this->middleware('auth');
    }*/

public function startMonth()
{
 try{
  $response = Options::where("option_name","start_month")->first();
  return json_encode(["value"=>$response->option_value]);
    }
 catch(\Exception $e)
 {
     return response()->json(["status"=>$e],400);
 }
}

public function endMonth()
{
 try{
  $response = Options::where("option_name","end_month")->first();
  return json_encode(["value"=>$response->option_value]);
    }
 catch(\Exception $e)
 {
     return response()->json(["status"=>$e],400);
 }
}

public function schoolYear()
{
 try{
  $school_year = Options::where("option_name","School_Year")->first();
  $registration_year = Options::where("option_name","registration_year")->first();
  $response['school_year']=$school_year->option_value;
  $response['registration_year']=$registration_year->option_value;
  
  return json_encode($response);
    }
 catch(\Exception $e)
 {
     return response()->json(["status"=>$e],400);
 }

}

public function registrationYear()
{
 try{
  $response = Options::where("option_name","registration_year")->first();
  return json_encode(["value"=>$response->option_value]);
    }
 catch(\Exception $e)
 {
     return response()->json(["status"=>$e],400);
 }

}

public function semesterdetails()
{
    
 try{
  $response = Options::where("option_name","semester_number")->first();
  $response1 = Options::where("option_name","semester_type")->first();
  return json_encode(["semester_number"=>$response->option_value,"semester_type"=>$response1->option_value]);
    }
 catch(\Exception $e)
 {
     return response()->json(["status"=>$e],400);
 }

}

public function addstartmonth(Request $request)
{
try{
$object = Options::where("option_name","start_month")->update(["option_value"=>$request->startMonth]);
return json_encode("true");
}
catch(\Exception $e)
{
return response()->json(["status"=>$e],400);
}

}


public function addTrimster(Request $request)
{
    try{
     for($i=1;$i<=$request->input('trimestersCount');$i++)
     {
        foreach($request->input('trimesters') as $trimseter){
        $trimsterName = Score_Type::firstOrNew(["semester"=>$i,"Name"=>$trimseter['name']]);
        $trimsterName->Name=$trimseter['name'];
        $trimsterName->coefficient=$trimseter['coefficient'];
        $trimsterName->save();
        }
      }  
     return response()->json(["status"=>"true"],200); 
    }
    catch(\Exception $e)
    {
        return response()->json(["status"=>"false"],400);
    }
}

public function addendmonth(Request $request)
{
try{
$object = Options::where("option_name","end_month")->update(["option_value"=>$request->endMonth]);
return json_encode("true");
}
catch(\Exception $e)
{
return response()->json(["status"=>$e],400);
}

}


public function getSemesters()
{
   return Score_Type::orderBy('semester')->get();
}




public function addSchoolYear(Request $request)
{
try{
$object = Options::where("option_name","School_Year")->update(["option_value"=>$request->schoolyear]);
return json_encode("true");   
}
catch(\Exception $e)
{
return response()->json(["status"=>$e],400);
}

}



public function addregistrationYear(Request $request)
{
try{
$object = Options::where("option_name","registration_year")->update(["option_value"=>$request->schoolyear]);
return json_encode("true");   
}
catch(\Exception $e)
{
return response()->json(["status"=>$e],400);
}
}


public function addsemesterdetails(Request $request)
{
try{
$object = Options::where("option_name","semester_number")->update(["option_value"=>$request->semester_number]);
$object = Options::where("option_name","semester_type")->update(["option_value"=>$request->semester_type]);
return json_encode("true");   
}
catch(\Exception $e)
{
return response()->json(["status"=>$e],400);
}
}




    // this function returns the School year variable value
    public function getSchoolYear()
    {
        $temp= Options::where('option_name','=','School_Year')->first();
        return $temp->option_value;
    
    }

public function store(Request $request)
{
    
    $validation = $request->validate([
        'option_name'=>'required',
        'option_value' =>  'required',
    ]);

   // check if the data was inserted before
    $data = Options::where([
        ['option_name','=',$request->input('option_name')],
        ['option_value','=',$request->input('option_value')],
        ])->get();
    if(!$data->isEmpty()){
        echo response()->json("data is alreay exist",200);
    }
    // if not inserted then save it
    else{
        $temp = new Options;
        $temp->option_name = $request->input('option_name');
        $temp->option_value =  $request->input('option_value');
        $option=Options::create($temp->toArray());
      // echo $temp->all();
    return response()->json(['status'=>'data insereted successflly'],201);}

}


public function update(Request $request,$id)
{
    $validation = $request->validate([
        'option_name'=>'required',
        'option_value' =>  'required',
    ]);

   // check if the data was inserted before
   $option = Options::findOrFail('1');
   $option->update($request->all());
   return response()->json(['status'=>'data Updated succesfully'],201);
    
}






}
