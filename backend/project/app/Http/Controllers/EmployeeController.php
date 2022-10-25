<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Employees;
use App\Models\Instructor;
use App\Models\User;
use App\Models\EmployeeHourlyAttendance;
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
            return response()->json($e, 404);
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
       return response(['status' => 'employee deleted'], 204);
    }

    public function HourlyAttendanceDaily($date)
    {
        try {
            $hourly=Employees::leftJoin('attendance_hourly',function ($join) use($date){
                $join->on('attendance_hourly.id_employee','=','employees.id')
                ->where('attendance_hourly.for_day',$date);
            })
        ->where('employees.start_position','<=',$date)
        ->where( function ($q) use($date){
            $q->whereNull('employees.end_position')
                ->orWhere('employees.end_position','>=',$date);
        })
        ->where('employees.Type','hourly')
        ->get(['employees.id',DB::raw("CONCAT(employees.First_Name,' ',employees.Last_Name) AS name"),
        DB::raw('IFNULL(attendance_hourly.hours,0) as hours'),DB::raw('IFNULL(attendance_hourly.minutes,0) as minutes')]);
        } catch (\Exception $e) {
            return response()->json($e, 404);
       }
       return json_encode($hourly);
    }

    public function updateDailyAttendance(Request $request)
    {
        try {
            $date=$request->input('date');
            $data=$request->input('data');
            foreach ($data as $input) {
                if(EmployeeHourlyAttendance::where('id_employee',$input['id'])
                    ->where('for_day',$date)->exists())
                    {
                        EmployeeHourlyAttendance::where('id_employee',$input['id'])
                        ->where('for_day',$date)
                        ->update(['hours'=>$input['hours'],'minutes'=>$input['minutes']]);
                    }
                    else
                    {
                        $temp= new EmployeeHourlyAttendance;
                        $temp->id_employee=$input['id'];
                        $temp->for_day=$date;
                        $temp->hours=$input['hours'];
                        $temp->minutes=$input['minutes'];
                        $temp=EmployeeHourlyAttendance::create($temp->toArray());
                    }
            }
            
        }  catch (\Exception $e) {
            return response()->json($e, 404);
       }
       return response(['status' => 'saved succefully'], 201);
    }
}
