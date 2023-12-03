<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;

class dayThreeController extends Controller
{
    private array $specialCharacters = [];

    private function getInput(): array
    {
        $this->specialCharacters = str_split('*&@\/+#$%=-');
        $input = trim(file_get_contents(app_path('Inputs/DayThreeInput.txt')));

        //dd(implode("", array_unique(str_split(str_replace("\n","",preg_replace('/[a-zA-Z0-9.]/', '', $input))))));

        $lines = explode("\n", $input);

        $table = [];
        $index = 0;
        foreach ($lines as $line) {
            $result = preg_split('/([.*&@\/+#$%=-])|(?<=[0-9])(?=[[.*&@\/+#$%=-])|(?<=[[.*&@\/+#$%=-])(?=[0-9])/', $line, -1,
                PREG_SPLIT_DELIM_CAPTURE | PREG_SPLIT_NO_EMPTY);

            foreach ($result as $resultLine) {
                foreach (str_split($resultLine) as $character) {
                    $table[$index][] = $resultLine;
                }
            }

            $index++;
        }

        return $table;
    }

    public function partOne()
    {
        $table = $this->getInput();

        $results = [];
        $resultNum = 0;
        foreach ($table as $rowKey => $row) {
            $rowResult = [];
            $alreadyPassed = collect();
            foreach ($row as $columnKey => $column) {
                // Check if column is a number
                if (preg_match('/^\d+$/', $column)) {
                    $checks = [
                        [$rowKey, $columnKey - 1], // Left,
                        [$rowKey, $columnKey + 1], // Right
                        [$rowKey - 1, $columnKey], // Up
                        [$rowKey + 1, $columnKey], // Down
                        [$rowKey - 1, $columnKey - 1], // Diagonal left up
                        [$rowKey - 1, $columnKey + 1], // Diagonal right up
                        [$rowKey + 1, $columnKey - 1], // Diagonal left down
                        [$rowKey + 1, $columnKey + 1], // Diagonal right down
                    ];

                    // Start checks to see if adjacent is a special character
                    foreach ($checks as $check) {
                        try {
                            $val = $table[$check[0]][$check[1]];

                            if (in_array($val, $this->specialCharacters)) {
                                $foundOn = $this->findFirstIndexOfNumber($columnKey, $column, $row);
                                $hasPassed = $alreadyPassed->where(function($q) use($column, $foundOn) {
                                    return $q['number'] === $column && $q['foundOn'] === $foundOn;
                                })->first();


                                if(!$hasPassed){
                                    $rowResult[] = $column;
                                    $resultNum += (int) $column;
                                    $alreadyPassed->push([
                                        'foundOn' => $foundOn,
                                        'number' => $column,
                                        'until' => $foundOn + strlen($column) -1
                                    ]);
                                }
                            }
                        } catch (\Exception $x) {
                        }
                    }
                }
            }

            $results = array_merge($rowResult, $results);
        }
        dd(array_reduce($results, fn($carry, $result) => $carry + $result, 0));
    }

    public function partTwo()
    {
        $table = $this->getInput();
        $total = 0;
        foreach ($table as $rowKey => $row) {
            $alreadyPassed = collect();

            foreach ($row as $columnKey => $column) {
                if (preg_match('/^\*/', $column)) {
                    $checks = [
                        [$rowKey, $columnKey - 1], // Left,
                        [$rowKey, $columnKey + 1], // Right
                        [$rowKey - 1, $columnKey], // Up
                        [$rowKey + 1, $columnKey], // Down
                        [$rowKey - 1, $columnKey - 1], // Diagonal left up
                        [$rowKey - 1, $columnKey + 1], // Diagonal right up
                        [$rowKey + 1, $columnKey - 1], // Diagonal left down
                        [$rowKey + 1, $columnKey + 1], // Diagonal right down
                    ];

                    $gearNumbers = [];
                    foreach ($checks as $check) {
                        try {
                            $val = $table[$check[0]][$check[1]];
                            if(is_numeric($val)){
                                $foundOn = $this->findFirstIndexOfNumber($columnKey, $val, $row);
                                $hasPassed = $alreadyPassed->where(function($q) use($val, $foundOn) {
                                    return $q['number'] === $val && $q['foundOn'] === $foundOn;
                                })->first();

                                if(!$hasPassed){
                                    $gearNumbers[] = $val;
                                    $alreadyPassed->push([
                                        'foundOn' => $foundOn,
                                        'number' => $val,
                                        'until' => $foundOn + strlen($column) -1
                                    ]);
                                }
                            }
                        } catch (\Exception $x) {
                        }
                    }

                    if(count($gearNumbers) === 2){
                        $total += array_reduce($gearNumbers, fn($carry, $num) => $carry * $num, 1);
                    }
                }
            }
        }

        dd($total);
    }

    private function findFirstIndexOfNumber($index, $number, $row){
        try{
           return $row[$index -1] === $number ? $this->findFirstIndexOfNumber($index -1,$number,$row) : $index;
        }catch(\Exception $ex){
            return $index;
        }
    }
}
