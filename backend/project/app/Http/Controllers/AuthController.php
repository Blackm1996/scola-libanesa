<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Options;
use App\Models\Instructor;

class AuthController extends Controller
{

    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('jwt.verify', ['except' => ['login', 'register']]);
	    $this->middleware('jwt.xauth', ['except' => ['login', 'register', 'refresh']]);
	    $this->middleware('jwt.xrefresh', ['only' => ['refresh']]);
    }

     /**
     * Register new user
     *
     * @param  string $name, $email, $password, password_confirmation
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request){
    	
        $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|string|max:255|unique:users',
                'password' => 'required|string|min:6|confirmed',
            ]);
            
        if($validator->fails()){
                return response()->json([
                    'status' => 'error',
                    'success' => false,
                    'error' =>
                    $validator->errors()->toArray()
                ], 400);
            }
            
        $user = User::create([
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'password' => Hash::make($request->input('password')),
            ]);
            
        return response()->json([
            'message' => 'User created.',
                'user' => $user
            ]);	
        }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    { $id=0;
      $credentials = request(['email', 'password']);
      $user=User::where('email',$request['email'])->first();
      if($user->role=="instructor")
      {
        $idInstructor=Instructor::select('id')->where("id_user",$user->id)->first();
        $id=$idInstructor->id;
        
      }

    if (! $access_token = auth()->claims(['xtype' => 'auth','r'=>$user['role']])->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
	
      //  Slave::setConnection($user['databaseUsername'],$user['databasePassword'],$user['databaseHost']);
        return $this->respondWithToken($access_token,$user['role'],$id);
    }


    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        return response()->json(auth()->user());
    }


    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth()->logout();


        return response()->json(['message' => 'Successfully logged out']);
    }


    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        $access_token = auth()->claims(['xtype' => 'auth'])->refresh(true,true);
        auth()->setToken($access_token); 
    
        return $this->respondWithToken($access_token);
      }


     /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
 protected function respondWithToken($access_token,$role,$id)
    {
       if($id==0){       
        return response()->json([
        'role'=>$role,
        'access_token' => $access_token,
        'token_type' => 'bearer',
        'access_expires_in' => auth()->factory()->getTTL() * 60,
        'refresh_token' => auth()
    ->claims([
        'xtype' => 'refresh',
        'xpair' => auth()->payload()->get('jti')
        ])
        ->setTTL(auth()->factory()->getTTL() * 3)
        ->tokenById(auth()->user()->id), 
    'refresh_expires_in' => auth()->factory()->getTTL() * 60,
    
    ]);
    }
  else
  {
    return response()->json([
    'id_instructor'=>$id,
    'role'=>$role,
    'access_token' => $access_token,
    'token_type' => 'bearer',
    'access_expires_in' => auth()->factory()->getTTL() * 60,
    'refresh_token' => auth()
->claims([
    'xtype' => 'refresh',
    'xpair' => auth()->payload()->get('jti')
    ])
    ->setTTL(auth()->factory()->getTTL() * 3)
    ->tokenById(auth()->user()->id), 
'refresh_expires_in' => auth()->factory()->getTTL() * 60,

]);


  }
}
}
