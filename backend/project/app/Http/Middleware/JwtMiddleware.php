<?php

namespace App\Http\Middleware;

use Closure;
use JWTAuth;
use Exception;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Http\Middleware\BaseMiddleware;
use App\Exceptions\Handler;
use Illuminate\Support\Facades\Config;
use DB;


use App\Models\Student_Profile;
use App\Models\Options;
use App\Models\Student_Inscription;
use App\Models\Grades;
use App\Models\Classroom;
use App\Models\Bills;
use App\Models\Books;
use App\Models\Course_Info;

class JwtMiddleware extends BaseMiddleware
{
  
	/**
	 * Handle an incoming request.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  \Closure  $next
	 * @return mixed
	 */
	public function handle($request, Closure $next)
	{  
		    		      
	  	try {
            
			$payload = JWTAuth::parseToken()->getPayload();
		    $role=$payload->get('r');
			//$model=new Student_profile;   
		//	$model::setCsetConnection('mysql2');
        Config::set('database.connections.mysql.username','pvgqfatm_mohamad');
        Config::set('database.connections.mysql.password','3)K+++94x+XM,rtx3X');
         DB::purge('mysql');
         DB::reconnect('mysql');


          //  config('default' => env('DB_CONNECTION', 'mysql'));
	   /*
			$model=new Student_Inscription;
			$model->setConnection('mysql2');
	  
		   $model =new Options;
		   $model->setConnection('mysql2');
	   
		   $model=new Grades;
		   $model->setConnection('mysql2');
	   
		   $model=new Bills;
		   $model->setConnection('mysql2');
	 
		   $model=new Books;
		   $model->setConnection('mysql2');
	   
		   $model= new Course_Info;
		   $model->setConnection('mysql2');
	   
		   $model=new Classroom;
		   $model->setConnection('mysql2');  */  
		 $user = JWTAuth::parseToken()->authenticate();
 		} catch (Exception $e) {
        	  if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenInvalidException){
		    return response()->json(['status' => 'Token is Invalid'], 403);
		  }else if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenExpiredException){
			return response()->json(['status' => 'Token is Expired'], 401);
		  }else if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenBlacklistedException){
			return response()->json(['status' => 'Token is Blacklisted'], 400);
		  }else{
		        return response()->json(['status' => 'Authorization Token not found'], 404);
		  }
		}
		
            return $next($request);
	}
}
