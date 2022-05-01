<?php

namespace App\Http\Controllers;
use App\Models\Books;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BooksController extends Controller
{


/*
    public function __construct(){

        $this->middleware('auth');
    }*/




     /** 
     * Display a listing of the resource. 
     * @return \Illuminate\Http\Response 
     */  
public function index()  
{  
          
//  
      
}  
/** 
     * Show the form for creating a new resource. 
     * @return \Illuminate\Http\Response 
       
*/  
 public function create()  
{  
          
//  
      
}  
/** 
     * Store a newly created resource in storage. 
     * 
     * @param  \Illuminate\Http\Request   $request 
     * @return \Illuminate\Http\Response 
     */  
public function store(Request $request)  
{  
          
//  
      
}  
/** 
     * Display the specified resource. 
     * @param  int  $id 
     * @return \Illuminate\Http\Response 
     */  
public function show($id)  
{  
    try{
        $book= Books::select('id','Name')->where('id_grade',$id)->get();
        }
        catch(\Exception $e){
            return response()->json('the books you looking for is not found',404);
        }
        return response()->json($book,200);
      
    
}  
/** 
     * Show the form for editing the specified resource. 
     * @param  int  $id 
     * @return  \Illuminate\Http\Response 
     */  
 public function edit($id)  
      
{  
          
//  
      
}  

/** 
     * Update the specified resource in storage. 
     * @param  \Illuminate\Http\Request   $request 
     * @param  int  $id 
     * @return \Illuminate\Http\Response 
     */  
 public function update(Request $request, $id)  
{    

    try{
      if(isset($request->addedBooks)){
     foreach($request->addedBooks as $books){
        $validation = Validator::make($books,[
            'books.Name' => 'required'
        ]);
         //  add a new book    
         $newbook= new Books;
         $newbook->Name=$books['Name'];
         $newbook->id_grade=$id;
         $MyBook=Books::firstOrCreate($newbook->toArray());
      }}




    if(isset($request->deletedBooks))
    {
     foreach($request->deletedBooks as $deleted){
      $validation = Validator::make($request->deletedBooks,[
          '$deleted'=>'required|numeric'
      ]);
      // delete the old book 
      Books::where('id',$deleted)->delete();        
        
    }}
}
catch(\Exception $e){
    return response()->json(null, 204);
   }
   return response()->json("data updated succesfully",200); 
    
} 


/** 
     * Remove the specified resource from storage. 
     * @param  int  $id 
     * @return  \Illuminate\Http\Response 
     */  
 public function destroy($id)  
 {  
     try{
         Books::where('id',$id)->delete();
     }
     catch(\Exception $e){
         return response()->json('Error,something happend',500);
     }

     return response()->json(null, 204);

    }  





}
