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

    public function partOne(): int
    {

        $checkMethod = fn($val) => in_array($val, $this->specialCharacters);
        $results = $this->doStuff('/^\d+$/', $checkMethod, 'column', 1);

        return array_reduce($results, fn($carry, $result) => $carry + $result, 0);
    }

    public function partTwo(): int
    {

        $checkMethod = fn($val) => is_numeric($val);
        $results = $this->doStuff('/^\*/', $checkMethod, 'val', 2);

        return $results;
    }

    private function doStuff($regexPattern, $checkMethod, $columnOrVal, $part): int|array
    {

        $table = $this->getInput();
        $total = 0;
        $results = [];

        foreach ($table as $rowKey => $row) {
            $rowResult = [];
            $alreadyPassed = collect();

            foreach ($row as $columnKey => $column) {
                // Check if column matches the pattern
                if (preg_match($regexPattern, $column)) {
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

                            if ($checkMethod($val)) {
                                $actualValue = $$columnOrVal;
                                $foundOn = $this->findFirstIndexOfNumber($columnKey, $actualValue, $row);

                                if ($alreadyPassed->where(fn($q) => $q['number'] === $actualValue && $q['foundOn'] === $foundOn)->isEmpty()) {
                                    $rowResult[] = $column;
                                    $gearNumbers[] = $val;

                                    $alreadyPassed->push([
                                        'foundOn' => $foundOn,
                                        'number' => $$columnOrVal,
                                        'until' => $foundOn + strlen($column) - 1
                                    ]);
                                }
                            }
                        } catch (\Exception $ex) {
                        }
                    }
                    if (count($gearNumbers) === 2) {
                        $total += array_reduce($gearNumbers, fn($carry, $num) => $carry * $num, 1);
                    }
                }
            }

            $results = array_merge($rowResult, $results);
        }

        return $part === 1 ? $results : $total;
    }

    private function findFirstIndexOfNumber($index, $number, $row)
    {
        try {
            return $row[$index - 1] === $number ? $this->findFirstIndexOfNumber($index - 1, $number, $row) : $index;
        } catch (\Exception $ex) {
            return $index;
        }
    }
}
