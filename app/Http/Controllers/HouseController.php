<?php

namespace App\Http\Controllers;
use App\Models\House;

use Illuminate\Http\Request;

class HouseController extends Controller
{
    public function index()
    {
        return House::all();
    }

    public function update(Request $request, House $house)
    {
        $house->update([
            'target_temp' => $request->input('target_temp'),
        ]);

        return response()->json(['message' => 'Updated']);
    }
}
