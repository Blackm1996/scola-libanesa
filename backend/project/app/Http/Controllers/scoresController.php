<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Score_Type;
use App\Models\Student_Profile;
use App\Models\Score;
use App\Models\Course_Info;
use App\Models\Course;
use App\Models\Options;
use App\Models\Bills;
use App\Models\Classroom;
use App\Models\Student_Inscription;
use App\Utils\RPDF;

class scoresController extends Controller
{

private function scoreSheet($student)
{
   $path=dirname(__DIR__, 3).'\storage\images\\';
   $pdf=new RPDF();
	$pdf->SetMargins(16.6,24.3);
	$pdf->AddPage('P','A4');
	$pdf->SetFont('Arial','B',8);
	$x=$pdf->GetX();
	$y=$pdf->GetY();
	$pdf->MultiCell(56,33,$pdf->Image($path."logo.png",$pdf->GetX()+5, $pdf->GetY()+8,17),1,'C');
	$pdf->SetXY($x+25,$y+9);
	$pdf->MultiCell(25,5,"Escola \nLibanesa \nInternacional",0,'J');

	$pdf->SetXY($x+56,$y);

        $x=$pdf->GetX();
        $y=$pdf->GetY();
        $pdf->Cell(62,23,"",1,2,'C');
        $pdf->Cell(62,10,"Class: ".RPDF::normalize($student["studentDetails"]["gradeName"]." - ".$student["studentDetails"]["sectionName"]),1,0,'L');
        $pdf->SetXY($x+10,$y);
        $name=$student["studentDetails"]["First_Name"]." ".$student["studentDetails"]["Last_Name"];
        $pdf->MultiCell(42,5,RPDF::normalize("Nome/Apelido\nNom et Prénom:\n").RPDF::normalize($name),0,'C');

        $pdf->SetXY($x+62,$y);
        $x=$pdf->GetX();
        $y=$pdf->GetY();
        $pdf->Cell(60,17,"",1,2,'C');
        $pdf->SetXY($x,$y);
        $pdf->MultiCell(60,5,RPDF::normalize("Ano Letivo\nAnnée Scolaire:\n").RPDF::normalize($student["studentDetails"]["School_Year"]),0,"C");
        $pdf->SetXY($x,$y+17);
        $pdf->Cell(60,6,"ID: ".$student["studentDetails"]["id"],1,2,'L');
        $pdf->Cell(60,10,"",1,1,'C');
        $x=$pdf->GetX();
        $y=$pdf->GetY();
        $pdf->MultiCell(56,5.125,"\nDISCIPLINES/\nDISCIPLINA\n ",1,'C');
        $pdf->SetXY($x+56,$y);
        $pdf->Cell(8,20.5,"",1,0,'J');
        $pdf->TextWithDirection($x+61,$y+18.5,'Notation sur','U');
        $x=$pdf->GetX();
        $y=$pdf->GetY();
        $pdf->Cell(33,15,"Trimestre 1",1,2,'C');
        $pdf->Cell(16.5,5.5,RPDF::normalize("1⁰P"),1,0,'C');
        $pdf->Cell(16.5,5.5,RPDF::normalize("2⁰P"),1,0,'C');
        $pdf->SetXY($x+33,$y);
        $x=$pdf->GetX();
        $y=$pdf->GetY();
        $pdf->Cell(33,15,"Trimestre 2",1,2,'C');
        $pdf->Cell(16.5,5.5,RPDF::normalize("1⁰P"),1,0,'C');
        $pdf->Cell(16.5,5.5,RPDF::normalize("2⁰P"),1,0,'C');
        $pdf->SetXY($x+33,$y);
        $x=$pdf->GetX();
        $y=$pdf->GetY();
        $pdf->Cell(33,15,"Trimestre 2",1,2,'C');
        $pdf->Cell(16.5,5.5,RPDF::normalize("1⁰P"),1,0,'C');
        $pdf->Cell(16.5,5.5,RPDF::normalize("2⁰P"),1,1,'C');
        
       $present=array_fill(0, 6, false);
        foreach ($student["langScores"] as $matiere) {
            $pdf->Cell(56,7,RPDF::normalize($matiere["langName"]),1,0,'C');
            $pdf->Cell(8,7,$matiere["coefficient"],1,0,'C');
            for ($j=0;$j<count($matiere["scores"])-1;$j++) {
                $value=$matiere["scores"][$j];
                $present[$j]=$present[$j] || $value!=null;
                $pdf->Cell(16.5,7,$value!=null?$value:"",1,0,'C');
            }
            $value=$matiere["scores"][count($matiere["scores"])-1];
            $present[count($matiere["scores"])-1]=$present[count($matiere["scores"])-1] || $value!=null;
            $pdf->Cell(16.5,7,$value!=null?$value:"",1,1,'C');
            
        }
       
        for ($i=20; $i >count($student["langScores"]) ; $i--) { 
            $pdf->Cell(56,7,"",1,0,'C');
            $pdf->Cell(8,7,"",1,0,'C');
            $pdf->Cell(16.5,7,"",1,0,'C');
            $pdf->Cell(16.5,7,"",1,0,'C');
            $pdf->Cell(16.5,7,"",1,0,'C');
            $pdf->Cell(16.5,7,"",1,0,'C');
            $pdf->Cell(16.5,7,"",1,0,'C');
            $pdf->Cell(16.5,7,"",1,1,'C');
        }

        $matiere=$student["total"];
        $pdf->Cell(56,7,"Total",1,0,'C');
        $pdf->Cell(8,7,$matiere["coefficient"],1,0,'C');
            for ($j=0;$j<count($matiere["scores"])-1;$j++) {
                $value=$matiere["scores"][$j];
                $pdf->Cell(16.5,7,$present[$j]?$value:"",1,0,'C');
            }
            $value=$matiere["scores"][count($matiere["scores"])-1];
            $pdf->Cell(16.5,7,$present[count($matiere["scores"])-1]?$value:"",1,1,'C');


        $pdf->SetXY($x+33,$y);
        $pdf->Cell(15,167.5,"",1,1,'C');

        $x=$pdf->GetX();
        $y=$pdf->GetY();
        $pdf->MultiCell(56,5,RPDF::normalize("Media Geral\nMoyen Général"),1,'C');
        $pdf->SetXY($x+56,$y);
        $matiere=$student["moyenne"];
        $pdf->Cell(8,10,$matiere["coefficient"],1,0,'C');
            for ($j=0;$j<count($matiere["scores"]);$j++) {
                $value=$matiere["scores"][$j];
                $pdf->Cell(16.5,10,$present[$j]?$value:"",1,0,'C');
            }
            $value=$student["Totalmoyen"];
            $pdf->Cell(15,10,$value!=null?$value:"",1,1,'C');

        $x=$pdf->GetX();
        $y=$pdf->GetY();
        $pdf->MultiCell(56,3.75,RPDF::normalize("\nObservação\nObservation\n "),1,'C');
        $pdf->SetXY($x+56,$y);
        $pdf->Cell(8,15,"",1,0,'C');

        $message="\n";
        $isLast=strcmp((Options::where("option_name","isLast")->first())->option_value , "true") ==0;
        $currentYear=(Options::where("option_name","School_Year")->first())->option_value;
        $lastYear=strcmp($currentYear , $student["studentDetails"]["School_Year"])==0;
        
        if($isLast || !$lastYear)
        {
            if($student["Totalmoyen"]>=10)
                $message=RPDF::normalize("Passe en classe supérieure.\nAprovado pelo nível a seguir.");
        }
        $x=$pdf->GetX();
        $y=$pdf->GetY();
        $pdf->SetFont('Arial','B',12);
        $pdf->MultiCell(99,3.75,"\n".$message."\n ",1,'C');
        $pdf->SetXY($x+99,$y);
        $pdf->Cell(15,15,"",1,1,'C');

        $pdf->Cell(89,20,"",1,0,'C');
        $x=$pdf->GetX();
        $y=$pdf->GetY();
        $pdf->Cell(89,20,"",1,1,'C');

	$pdf->Image($path."Stamp.png",$x+45, $y-10,30);
	$pdf->Image($path."Sign.png",$x+27, $y-1,30);

	return $pdf->Output('S');
}
public function classScores($idSection)
{
    $response =array();
    $School_Year=Options::where('option_name','School_Year')->get(['option_value']);
    $students=Student_Inscription::where('School_Year',$School_Year[0]->option_value)
    ->where('id_classroom',$idSection)->where('Attending',1)->get(['id_student']);
    foreach($students as $student){
        $month = date('m');
        $day = date('d');
        if($day<20)
            $month-=1;
        $rest = Bills::where('id_student',$student->id_student)->where('School_Year',$School_Year[0]->option_value)
            ->where('Type','Monthly')->where("Month",$month)->sum("Amount");
        $total = (int)((Student_Inscription::where('School_Year',$School_Year[0]->option_value)
                    ->where('id_student',$student->id_student)->get("Monthly_Total"))[0]->Monthly_Total);
        if($total - $rest <=0)
        {
            $content= scoresController::totalScores($student->id_student);
            //$content=file_get_contents($content);
            $array = json_decode($content, true);
            //$id= $array['Status'];
            if(isset($array['Status'])){
                array_push($response,null);     
            }
            array_push($response,$array);
        }
    }
    usort($response,function ($a,$b){
            if ( $a['Totalmoyen'] == $b['Totalmoyen'])
              return 0;
            return ($a['Totalmoyen'] < $b['Totalmoyen']) ? 1 : -1;
          });
    return $response; 
}

public  function totalScores($idStudent)
{
   $n=0;
      
    $semester_number=Options::where('option_name','semester_number')->get(['option_value']);
      
    $semester_type=Options::where('option_name','semester_type')->get(['option_value']);
 
  $semestersType= DB::table('score_types')->distinct('Name')->get('Name');
     $semesters = DB::table('score_types')->distinct('semester')->count('semester');
    
    $School_Year=Options::where('option_name','School_Year')->get(['option_value']);
    
    $studentInfo=Student_Inscription::join('student_profiles','student_profiles.id','student_inscriptions.id_student')
    ->join('grades','grades.id','student_inscriptions.id_grade')
    ->join('classrooms','classrooms.id','student_inscriptions.id_classroom')
    ->where('student_inscriptions.id_student',$idStudent)
    ->where('student_inscriptions.School_Year',$School_Year[0]->option_value)
    ->get(['student_profiles.id','student_profiles.First_Name','student_profiles.Last_Name','student_inscriptions.School_Year',
    'grades.Name as gradeName','classrooms.Name as sectionName']);
   
    $studentcourses=Student_Inscription::join('course_infos','course_infos.id_grade','student_inscriptions.id_grade')
    ->where('student_inscriptions.id_student',$idStudent)
    ->where('course_infos.included',1)
    ->where('student_inscriptions.School_Year',$School_Year[0]->option_value)
    ->get(['course_infos.id','course_infos.Name','course_infos.score']);
 
    $scores=array(count($studentcourses));
    $coursesCount = count($studentcourses);
    $response = array();
    $response['studentDetails']=$studentInfo[0]->toArray();
    
     /*  $tempsemester=Score_Type::select()
           ->where('semester','1')
           ->where('Name','1⁰P')->first();
       return $tempsemester;*/

    $courseDetails=array();
    $max=0;
    $response['langScores']=array();
      // return $semesters;
    for($i=0;$i<$coursesCount;$i++)
    {
     $scores[$i]=array();
     $max+=$studentcourses[$i]->score;
    for($semester=1;$semester<=$semesters;$semester++){
        foreach($semestersType as $type)
        {
         $tempsemester=Score_Type::select()
           ->where('semester',$semester)
           ->where('Name',$type->Name)->first();

        if(!Student_Inscription::leftjoin('scores','scores.id_student','student_inscriptions.id_student')
           ->leftjoin('course_infos','course_infos.id','scores.id_course')
           ->where('student_inscriptions.id_student',$idStudent)
           ->where('scores.id_course',$studentcourses[$i]->id)
           ->where('course_infos.included',1)
           ->where('student_inscriptions.School_Year',$School_Year[0]->option_value)
           ->where('scores.id_score_type',$tempsemester->id)->exists())
        {
         //$n++;
         array_push($scores[$i],null);
         // return response()->json(["response"=>false],401);
        }else
           {
           $trimsterScores=Student_Inscription::leftjoin('scores','scores.id_student','student_inscriptions.id_student')
           ->leftjoin('course_infos','course_infos.id','scores.id_course')
           ->where('student_inscriptions.id_student',$idStudent)
           ->where('course_infos.included',1)
           ->where('scores.id_course',$studentcourses[$i]->id)
           ->where('student_inscriptions.School_Year',$School_Year[0]->option_value)
           ->where('scores.id_score_type',$tempsemester->id)->get([
               'scores.score as score']);
               array_push($scores[$i],$trimsterScores[0]->score);
           // return json_encode($trimsterScores[0]);
          // return $scores[0];
           }
        }
       }
    $courseDetails['langName']=$studentcourses[$i]->Name;
    $courseDetails['coefficient']=$studentcourses[$i]->score;
    $courseDetails['scores']=$scores[$i];
    array_push($response['langScores'],$courseDetails);
    }

    $total=array(count($scores[0]));
    $moyen=array(count($scores[0]));
    $coefficient=$max;
    /*for($i=0;$i<count($scores[0]);$i++)
    {
        if($i<$coursesCount){
        $coefficient+=$studentcourses[$i]->score;}
    }*/
    $tempTotal=0;
    $moyenTotal=0;
    $examsNumber=0;
    for($i=0;$i<count($scores[0]);$i++)
    {
        foreach($scores as $score)
        {
        $tempTotal+= $score[$i];
        }
        if($tempTotal!=0){$examsNumber++;}
        $total[$i]=$tempTotal;
        $moyen[$i]=(20*$tempTotal)/$coefficient;
        $moyen[$i]=number_format($moyen[$i],2);
        $moyenTotal+=$moyen[$i];
        $tempTotal=0;
    }
    $moyenCoefficient=$coefficient/$coursesCount;
    if($examsNumber==0){$moyenTotal=0;}else{
        $moyenTotal=($moyenTotal)/$examsNumber;
        $moyenTotal=number_format($moyenTotal,2);}
      
    $response['total']['coefficient']=$coefficient;
    $response['total']['scores']=$total;
    $response['moyenne']['coefficient']=20;
    $response['moyenne']['scores']=$moyen;
    $response['Totalmoyen']=$moyenTotal;
    return json_encode($response);
}
 
public function studentScores($idStudent,$School_Year)
{
  $n=0;

 $semestersType= DB::table('score_types')->distinct('Name')->get('Name');
    $semesters = DB::table('score_types')->distinct('semester')->count('semester');
   
   
   
   $studentInfo=Student_Inscription::join('student_profiles','student_profiles.id','student_inscriptions.id_student')
   ->join('grades','grades.id','student_inscriptions.id_grade')
   ->join('classrooms','classrooms.id','student_inscriptions.id_classroom')
   ->where('student_inscriptions.id_student',$idStudent)
   ->where('student_inscriptions.School_Year',$School_Year)
   ->get(['student_profiles.id','student_profiles.First_Name','student_profiles.Last_Name','student_inscriptions.School_Year',
   'grades.Name as gradeName','classrooms.Name as sectionName']);
  
   $studentcourses=Student_Inscription::join('course_infos','course_infos.id_grade','student_inscriptions.id_grade')
   ->where('student_inscriptions.id_student',$idStudent)
   ->where('course_infos.included',1)
   ->where('student_inscriptions.School_Year',$School_Year)
   ->get(['course_infos.id','course_infos.Name','course_infos.score']);

   $scores=array(count($studentcourses));
   $coursesCount = count($studentcourses);
   $response = array();
   $response['studentDetails']=$studentInfo[0]->toArray();
   
    /*  $tempsemester=Score_Type::select()
          ->where('semester','1')
          ->where('Name','1⁰P')->first();
      return $tempsemester;*/

   $courseDetails=array();
   $max=0;
   $response['langScores']=array();
     // return $semesters;
   for($i=0;$i<$coursesCount;$i++)
   {
    $scores[$i]=array();
    $max+=$studentcourses[$i]->score;
   for($semester=1;$semester<=$semesters;$semester++){
       foreach($semestersType as $type)
       {
        $tempsemester=Score_Type::select()
          ->where('semester',$semester)
          ->where('Name',$type->Name)->first();

       if(!Student_Inscription::leftjoin('scores','scores.id_student','student_inscriptions.id_student')
          ->leftjoin('course_infos','course_infos.id','scores.id_course')
          ->where('student_inscriptions.id_student',$idStudent)
          ->where('scores.id_course',$studentcourses[$i]->id)
          ->where('course_infos.included',1)
          ->where('student_inscriptions.School_Year',$School_Year)
          ->where('scores.id_score_type',$tempsemester->id)->exists())
       {
        //$n++;
        array_push($scores[$i],null);
        // return response()->json(["response"=>false],401);
       }else
          {
          $trimsterScores=Student_Inscription::leftjoin('scores','scores.id_student','student_inscriptions.id_student')
          ->leftjoin('course_infos','course_infos.id','scores.id_course')
          ->where('student_inscriptions.id_student',$idStudent)
          ->where('course_infos.included',1)
          ->where('scores.id_course',$studentcourses[$i]->id)
          ->where('student_inscriptions.School_Year',$School_Year)
          ->where('scores.id_score_type',$tempsemester->id)->get([
              'scores.score as score']);
              array_push($scores[$i],$trimsterScores[0]->score);
          // return json_encode($trimsterScores[0]);
         // return $scores[0];
          }
       }
      }
   $courseDetails['langName']=$studentcourses[$i]->Name;
   $courseDetails['coefficient']=$studentcourses[$i]->score;
   $courseDetails['scores']=$scores[$i];
   array_push($response['langScores'],$courseDetails);
   }

    $total=array(count($scores[0]));
    $moyen=array(count($scores[0]));
    $coefficient=$max;
    /*for($i=0;$i<count($scores[0]);$i++)
    {
        if($i<$coursesCount){
        $coefficient+=$studentcourses[$i]->score;}
    }*/
    $tempTotal=0;
    $moyenTotal=0;
    $examsNumber=0;
    for($i=0;$i<count($scores[0]);$i++)
    {
        foreach($scores as $score)
        {
        $tempTotal+= $score[$i];
        }
        if($tempTotal!=0){$examsNumber++;}
        $total[$i]=$tempTotal;
        $moyen[$i]=(20*$tempTotal)/$coefficient;
        $moyen[$i]=number_format($moyen[$i],2);
        $moyenTotal+=$moyen[$i];
        $tempTotal=0;
    }
    $moyenCoefficient=$coefficient/$coursesCount;
    if($examsNumber==0){$moyenTotal=0;}else{
        $moyenTotal=($moyenTotal)/$examsNumber;
        $moyenTotal=number_format($moyenTotal,2);}
      
    $response['total']['coefficient']=$coefficient;
    $response['total']['scores']=$total;
    $response['moyenne']['coefficient']=20;
    $response['moyenne']['scores']=$moyen;
    $response['Totalmoyen']=$moyenTotal;

    $pdf=base64_encode(self::scoreSheet($response));
    return json_encode(["student"=>$response,"pdf"=>$pdf]);
}
    
public function adminSave(Request $request)
    {
        try{
    if(Score::where('id_score_type',$request->input('id_score_type'))
      ->where('id_student',$request->input('id_student'))
      ->where('id_course',$request->input('id_course'))
      ->where('School_Year',$request->input('School_Year'))
      ->exists())
      {
        Score::where('id_score_type',$request->input('id_score_type'))
      ->where('id_student',$request->input('id_student'))
      ->where('id_course',$request->input('id_course'))
      ->where('School_Year',$request->input('School_Year'))
      ->update(["score"=>$request->score,"final"=>"1"]);
      }
else{
      Score::create($request->all());}
      }
        catch(\Exception $e)
        {
            return response()->json($e,404);
        }
       return response()->json(["status"=>"Data inserted succefully"],200);
    }







    public function getfirstgrade($idSection)
    {
        $studentsCount= Student_Inscription::where('id_classroom',$idSection)->count();
        $semester_number=Options::select('option_value')->where('option_name','semester_number')->first();
        $semester_type=Options::select('option_value')->where('option_name','semester_type')->first();
    
        $id_score_type= Score::select(['scores.id_score_type',DB::raw("SUM(score)/$studentsCount as total_points")])->
        join('student_inscriptions','student_inscriptions.id_student','scores.id_student')
        ->where('student_inscriptions.id_classroom',$idSection)->groupBy('scores.id_score_type');

       $average= DB::table( DB::raw("({$id_score_type->toSql()}) as sub") )->mergeBindings($id_score_type->getQuery())
        ->select(DB::raw("SUM(total_points) as average"))->get()->toArray();
         $response = array();
         $response['studentsCount']=$studentsCount;
         $response['lastTrimesterAVerage']=$average[0]->average;
         array_push($average,$studentsCount);
        return json_encode($response);
    }

    public function save(Request $request)
    {
        try{
    if(Score::where('id_score_type',$request->input('id_score_type'))
      ->where('id_student',$request->input('id_student'))
      ->where('id_course',$request->input('id_course'))
      ->where('School_Year',$request->input('School_Year'))
      ->where('scores.final','1')
      ->exists())
       {
          return response()->json(["status"=>"you can't modify this score anymore"],400);
       }
    if(Score::where('id_score_type',$request->input('id_score_type'))
      ->where('id_student',$request->input('id_student'))
      ->where('id_course',$request->input('id_course'))
      ->where('School_Year',$request->input('School_Year'))
      ->exists())
      {
        Score::where('id_score_type',$request->input('id_score_type'))
      ->where('id_student',$request->input('id_student'))
      ->where('id_course',$request->input('id_course'))
      ->where('School_Year',$request->input('School_Year'))
      ->update(["score"=>$request->score]);
      }
else{
      Score::create($request->all());}
    
      }
        catch(\Exception $e)
        {
            return response()->json($e,404);
        }
       return response()->json(["status"=>"Data inserted succefully"],200);
    }

      public function update($idSection,$idCourse)
    {

       
        $semester_number=Options::where('option_name','semester_number')->get(['option_value']);
      
        $semester_type=Options::where('option_name','semester_type')->get(['option_value']);

         $scoreType=Score_Type::select()
           ->where('semester',$semester_number[0]->option_value)
           ->where('Name',$semester_type[0]->option_value)->first();
            

       $allStudent=Student_Inscription::where('id_classroom',$idSection)->count();
       $currentSubmitted=Score::join('student_inscriptions','student_inscriptions.id_student','scores.id_student')
       ->where('student_inscriptions.id_classroom',$idSection)
       ->where('scores.id_course',$idCourse)
       ->where('scores.id_score_type',$scoreType->id)
       ->count();
       if($allStudent!=$currentSubmitted)
       {
           return response()->json(["status"=>"you haven't added all student scores"],400);
       }
       else{
           Score::join('student_inscriptions','student_inscriptions.id_student','scores.id_student')
           ->where('student_inscriptions.id_classroom',$idSection)
           ->where('scores.id_course',$idCourse)
           ->where('scores.id_score_type',$scoreType->id)
           ->update(["final"=>"1"]);
           return json_encode("data updated succefully");
       }
    }
  
}
