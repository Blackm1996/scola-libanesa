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

            $validation = $request->validate([
                'First_Name' => 'required|max:500',
                'Last_Name' => 'required|max:500',
                'Tel' => 'required',
            ]);

            if($request->input('userName') != "")
            {
                if(User::where('email',$request->input('userName'))->exists())
                    return response()->json(['status'=>'userName already exists'],400);
            }

            if(Employees::where('Tel',$request->input('Tel'))->exists())
                return response()->json(['status'=>'userName already exists'],400);
            
            $temp=new Employees;
            $temp->First_Name = $request->input('First_Name');
            $temp->Last_Name = $request->input('Last_Name');
            $temp->Birthday = $request->input('Birthday');
            $temp->Address = $request->input('Address');
            $temp->Nationality = $request->input('Nationality');
            $temp->Tel = $request->input('Tel');
            $temp->debt_pay_perMonth = $request->input('debt_pay_perMonth');
            $temp->start_position = $request->input('start_position');
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
            return response()->json(["Message"=>$e,"HAHA"=>date('YY"-"MM"-"DD',strtotime($request->input('start_position')))], 404);
        }
        return response()->json(['status' => 'data insereted successflly', 'id' => $employee->id], 201);
        
    }

    public function index($limit,$search,$type,$position,$orderBy,$sort)
    {
        try {
            $employees=Employees::select('id',DB::raw("CONCAT(First_Name,' ',Last_Name) AS name"),'Tel','position','Type');
            if($search!='^')
            {
                $employees=$employees->where('id','LIKE', '%' . $search .'%')
                ->orWhere('First_Name','LIKE','%' .$search .'%')
                ->orWhere('Last_Name','LIKE','%' .$search .'%');
            }
            if($type!='^')
                $employees=$employees->where('Type',$type);

            if($position!='^')
                $employees=$employees->where('position',$position);
            
            $result=$employees->orderBy($orderBy,$sort)->paginate($limit);
            
        } catch (\Exception $e) {
            return response()->json($e, 404);
       }
       return response()->json($result, 200);
    }
  
    public function show($id)
    {
        try {
            $employee=Employees::findOrFail($id);
        } catch (\Exception $e) {
            return response()->json($e, 404);
       }
       return json_encode($employee);
    }

    public function allInfo($id)
    {
        try {
            $employee=Employees::findOrFail($id);
            if(Instructor::where('id_employee',$id)->exists())
            {
                $instructor=Instructor::select('Major')->where('id_employee',$id)->first();
                $employee->isInstructor=true;
                $employee->Major=$instructor->Major;
            }
            else
            {
                $employee->isInstructor=false;
            }
            
            if(User::where('id_employee',$id)->exists())
            {
                $user=User::select('email as userName','role')->where('id_employee',$id)->first();
                $employee->userName=$user->userName;
                $employee->role=$user->role;
            }
        } catch (\Exception $e) {
            return response()->json($e, 404);
       }
       return json_encode($employee);
    }

    public function update(Request $request,$id)
    {
        try {
            
            $validation = $request->validate([
                'First_Name' => 'required|max:500',
                'Last_Name' => 'required|max:500',
                'Tel' => 'required',
            ]);

            if($request->input('userName') != "")
            {
                if(User::where('email',$request->input('userName'))->where('id_employee','!=',$id)->exists())
                    return response()->json(['status'=>'userName already exists'],400);
            }

            if(Employees::where('Tel',$request->input('Tel'))->where('id','!=',$id)->exists())
                return response()->json(['status'=>'userName already exists'],400);
            
            $temp=Employees::findOrFail($id);
            $temp->First_Name = $request->input('First_Name');
            $temp->Last_Name = $request->input('Last_Name');
            $temp->Birthday = $request->input('Birthday');
            $temp->Address = $request->input('Address');
            $temp->Nationality = $request->input('Nationality');
            $temp->Tel = $request->input('Tel');
            $temp->Type = $request->input('Type');
            $temp->position = $request->input('position');
            $temp->base_salary = $request->input('base_salary');
            $temp->save();

            if($request->input('isInstructor'))
            {
                if(Instructor::where('id_employee',$id)->exists())
                {
                    $instructor=Instructor::where('id_employee',$id)->first();
                    $instructor->Major=$request->input('Major');
                    $instructor->save();
                }
                else
                {
                    $instructor=new Instructor;
                    $instructor->id_employee=$id;
                    $instructor->Major=$request->input('Major');
                    $instructor=Instructor::create($instructor->toArray());
                }  
            }

            if($request->input('userName') != "")
            {
                if(User::where('id_employee',$id)->exists())
                {
                    $user=User::where('id_employee',$id)->first();
                    $user->email=$request->input('userName');
                    $user->password=Hash::make($request->input('password'));
                    $user->role=$request->input('role');
                    $user->save();
                }
                else
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
    }

    public function delete($id)
    {
        try {
            $temp=Employees::findOrFail($id);
            if(Instructor::where('id_employee',$id)->exists())
            {
                $instructor=Instructor::where('id_employee',$id)->first();
                $instructor->delete();
            }
            if(User::where('id_employee',$id)->exists())
            {
                $user=User::where('id_employee',$id)->first();
                $user->delete();
                
            }
            $employee->delete();
        } catch (\Exception $e) {
            return response()->json($e, 404);
       }
    }
}
