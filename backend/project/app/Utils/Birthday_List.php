<?php
namespace App\Utils;
use setasaign\Fpdi\Fpdi;
use App\Utils\RPDF;

class Birthday_List
{
    public static function date_simpl($date)
    {
        $months=array(   "Jan"=>"1" ,
                         "Feb"=>"2" ,
                         "Mar"=>"3" ,
                         "Apr"=>"4" ,
                         "May"=>"5" ,
                         "June"=>"6" ,
                         "July"=>"7" ,
                         "Aug"=>"8" ,
                         "Sept"=>"9" ,
                         "Oct"=>"10" ,
                         "Nov"=>"11" ,
                         "Dec"=>"12" );

        $det=explode("-",$date);
        return $det[0]."-".$months[$det[1]]."-".$det[2];
    }
    public static function generateList($data)
    {
        try {
            $pdf=new \FPDF();
		$pdf->SetMargins(16,16);
		$pdf->AddPage('P','A4');
		$pdf->SetFont('Arial','B',32);
		$pdf->Cell(0,0,RPDF::normalize($data['title']),0,1,'C');
		$x=$pdf->GetX();
		$y=$pdf->GetY();
		$pdf->SetXY($x,$y+15);
		$pdf->SetFont('Arial','',10);
        $i=1;
		foreach ($data['students'] as $student)
		{
			$pdf->Cell(10,7,$i+1,1,0,"C");
			$pdf->Cell(135,7,RPDF::normalize($student['name']),1,0,"L");
			$pdf->Cell(40,7,RPDF::normalize(self::date_simpl($student['Birthday'])),1,1,"C");
            $i++;
		}
        } catch (\Exception $th) {
            return $th;
        }


		return $pdf->Output("S");
    }
}
?>