<?php

namespace App\Http\Controllers;

class dayFourController extends Controller
{
    private function getInput(): array
    {
        $input = trim(file_get_contents(app_path('Inputs/DayFourInput.txt')));
        $lines = explode("\n", $input);

        $games = array_map(function ($game) {
            $mutateOne = explode(": ", $game);
            $mutateTwo = explode(" | ", $mutateOne[ 1 ]);

            return [
                'winningNumbers' => array_filter(explode(" ", $mutateTwo[ 0 ])),
                'myNumbers' => array_filter(explode(" ", $mutateTwo[ 1 ])),
            ];
        }, $lines);

        return $games;

    }

    public function partOne()
    {
        $games = $this->getInput();

        $finalScore = 0;
        foreach ($games as $game) {
            $score = 0;
            foreach ($game[ 'myNumbers' ] as $number) {
                if (in_array($number, $game[ 'winningNumbers' ])) {
                    $score = $score === 0 ? 1 : $score * 2;
                }
            }

            $finalScore += $score;
        }

        return $finalScore;
    }

    public function partTwo()
    {
        $games = $this->getInput();

        // Create mutatedGames collection
        foreach ($games as $index => $game) {
            $mutatedGames[] = [
                'gameIndex' => $index,
                'cards' => 1,
                'winningNumbers' => $game[ 'winningNumbers' ],
                'myNumbers' => $game[ 'myNumbers' ],
            ];
        }

        foreach ($games as $gameIndex => $game) {
            for($x=0;$x<$mutatedGames[$gameIndex]['cards'];$x++){
                $score = 0;
                foreach ($game[ 'myNumbers' ] as $number) {
                    //$score = array_intersect($game[''])
                    if (in_array($number, $game[ 'winningNumbers' ])) {
                        $score++;
                    }
                }


                for ($i = 1; $i <= $score; $i++) {
                    $mutatedGames[ $gameIndex + $i ][ 'cards' ]++;
                }
            }

        }

        return array_reduce($mutatedGames, function($carry, $game){
            return $carry + $game['cards'];
        }, 0);
    }

    private function processWinnings($games)
    {
        $mutatedWinnings = $games;

        foreach ($games as $gameIndex => $game) {

            $score = 0;
            foreach ($game[ 'myNumbers' ] as $number) {
                if (in_array($number, $game[ 'winningNumbers' ])) {
                    $score++;
                }
            }

            if ($gameIndex === 0) {
                $games[] = $game;
            }
        }

    }
}
