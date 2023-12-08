<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;

class dayTwoController extends Controller
{
    private function getInput(): array
    {
        $input = trim(file_get_contents(app_path('Inputs/DayTwoInput.txt')));

        $gameLines = explode("\n", $input);
        $games = [];

        $index = 0;
        foreach ($gameLines as $gameLine) {
            $game = explode(": ", $gameLine)[1];
            $picks = explode(";", $game);

            $games[$index] = [];
            foreach ($picks as $pick) {
                $cubes = explode(",", $pick);
                foreach ($cubes as $cube) {
                    $amount = (int)preg_replace('/\D/', '', $cube);
                    $type = trim(preg_replace('/\d/', '', $cube));

                    $games[$index][] = [
                        'amount' => $amount,
                        'type' => $type
                    ];
                }
            }
            $index++;
        }

        return $games;
    }

    public function partOne()
    {
        $inventory = [
            'red' => 12,
            'green' => 13,
            'blue' => 14
        ];

        $games = $this->getInput();

        $possibleGames = [];
        $gameNumber = 1;
        foreach($games as $game){
            $gamePossible = true;
            foreach ($game as $pick) {
                if ($inventory[$pick['type']] < $pick['amount']) {
                    $gamePossible = false;
                }
            }

            if ($gamePossible) $possibleGames[] = $gameNumber;
            $gameNumber++;
        }

        dd(array_reduce($possibleGames, fn($carry, $value) => $carry + $value, 0));
    }

    public function partTwo()
    {
        $games = $this->getInput();

        $total = 0;
        foreach($games as $game){
            $collection = collect($game)->groupBy('type');

            $result = [];
            $collection->each(function($values, $type) use (&$result){

                $result[$type] = $values->reduce(fn($carry, $value) => max($value['amount'], $carry), 0);
            });

            $total = $total + array_reduce($result, fn($carry, $amount) => $carry * $amount,1);
        }

        dd($total);
    }
}
