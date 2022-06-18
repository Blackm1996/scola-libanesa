<?php
namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use DB;
class UsersController extends Controller
{
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
    
    }

    public function deleteUser($id)
    {
        try{
                 if(User::findOrFail($id)->delete()){ 
                return response()->json(["status"=>"true"],200);
                }
        }
        catch(\Exception $e)
        {
            return response()->json(["status"=>"false"],400);
        }
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
            $validator = Validator::make($request->all(), [
                'role' => 'required|string|max:255',
                'email' => 'required|string|max:255|unique:users',
                'password' => 'required|string',
            ]);
        if(User::where('email',$request->input('userName'))->exists())
        {
            return response()->json(['status'=>'userName is already exist'],400);
        }else
        {
           $user = new User;
           $user->email=$request->input('userName');
           $user->password=Hash::make($request->input('password'));
           $user->role=$request->input('role');
           $user = User::create($user->toArray());
        }
    }
    catch(\Exception $e)
    {
        return json_encode($e);
    }
    return response()->json(['status'=>'user added succesfully'],200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function teachersInfos()
    {
       // try{
       $teachers=User::join('instructors','instructors.id_user','users.id')->where('role','instructor')->orderBy('First_Name','asc')
       ->get([db::raw("CONCAT(instructors.First_Name,' ',instructors.Last_Name) AS full_name"),"users.email as userName","instructors.id","users.id as idUser","users.role","instructors.Tel","instructors.Email"]);
       return $teachers;
      //  }
      //  catch(\Exception $e)
      //  {
        //    return response()->json(['status'=>$e],400);
       // }
    }

    public function usersInfos()
    {
        try{
       $teachers=User::where('role','!=','instructor')
       ->where('role','!=','admin')
       ->get(["users.role","users.email as userName","users.id"]);
       return $teachers;
        }
        catch(\Exception $e)
        {
            return response()->json(['status'=>$e],400);
        }
    }

    public function greet()
    {
        return response()->json(['message'=>'Hello'], 200);
    }

   public function updateUser(Request $request,$id)
  {
      try{
        
         $user = User::findOrFail($id);
         $user->update(['password'=>hash::make($request->input('newPassword'))]);
         Auth::logoutOtherDevices($request->input('oldPass'));
         return response()->json(['status'=>'password has changed'],200);
         }
      catch(\Exception $e)
      {
        return response()->json(['status'=>$e],400);
      }
  }
  /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request,$id)
    {
    //try{
    
       $user = User::findOrFail($id);
       //if(!password_verify($request->input('oldPass'),$user->password))
       //{
         //  return response()->json(['status'=>'your old password is not correct'],400);
      // }else{
         $user->update(['password'=>hash::make($request->input('newPassword'))]);
        // Auth::logoutOtherDevices($request->input('oldPass'));
         return response()->json(['status'=>'password has changed'],200);
         
        //}
   // }
   // catch(\Exception $e)
   // {
     //   return json_encode($e);
        //return response()->json(['status'=>'ERROR'],500);
   // }
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
