<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\House;


class HouseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
{
    $coords = [
        [47.684300, 20.227100],
        [47.678500, 20.228900],
        [47.680200, 20.217800],
        [47.685100, 20.221000],
        [47.677700, 20.220500],
        [47.683000, 20.230200],
        [47.679600, 20.225300],
        [47.684000, 20.218600],
        [47.680700, 20.230000],
        [47.682500, 20.219000],
    ];
    

    foreach ($coords as $i => [$lat, $lng]) {
        \App\Models\House::updateOrCreate(
            ['id' => $i + 1],
            [
                'name' => "House " . ($i + 1),
                'latitude' => $lat,
                'longitude' => $lng,
                'current_temp' => rand(18, 24),
                'target_temp' => rand(20, 22),
            ]
        );
    }
}

}
