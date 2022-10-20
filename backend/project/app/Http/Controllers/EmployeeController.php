<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Employees;
use App\Models\Instructor;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

use DB;
class EmployeeController extends Controller
{
    public function store(Request $request)
    {
        try {
            if($request->input('userName') != "")
            {
                if(User::where('email',$request->input('userName'))->exists())
                    return response()->json(['status'=>'userName already exists'],400);
            }
            $temp=new Employees;
            $temp->First_Name = $request->input('First_Name');
            $temp->Last_Name = $request->input('Last_Name');
            $temp->Birthday = $request->input('Birthday');
            $temp->Address = $request->input('Address');
            $temp->Nationality = $request->input('Nationality');
            $temp->Tel = $request->input('Tel');
            $temp->Type = $request->input('Type');
            $temp->position = $request->input('position');
            $temp->base_salary = $request->input('base_salary');
            $employee=Employees::create($temp->toArray());
            if($employee->id !=null)
            {
                if($request->input('isInstructor'))
                {
                    $instructor=new Instructor;
                    $instructor->id_employee=$employee->id;
                    $instructor->Major=$request->input('Major');
                    $instructor=Instructor::create($instructor->toArray());
                }

                if($request->input('userName') != "")
                {
                    $user = new User;
                    $user->id_employee=$employee->id;
                    $user->email=$request->input('userName');
                    $user->password=Hash::make($request->input('password'));
                    $user->role=$request->input('role');
                    $user = User::create($user->toArray());
                }
            }
        } catch (\Exception $e) {
            return response()->json($e, 404);
        }
        return response()->json(['status' => 'data insereted successflly', 'id' => $employee->id], 201);
        
    }


    public function update(Request $request,$id)
    {

    
    }
}
