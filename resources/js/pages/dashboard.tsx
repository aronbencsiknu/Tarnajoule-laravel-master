import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react'; // Add this if you're using Lucide icons

import { 
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const houseIcon = new L.Icon({
    iconUrl: '/images/house-icon.png', // path relative to public folder
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

// Dummy data for the charts

// 1. Monthly Energy Usage (Line Chart) in kWh
const energyUsageData = [
    { month: 'Jan', usage: 350 },
    { month: 'Feb', usage: 400 },
    { month: 'Mar', usage: 450 },
    { month: 'Apr', usage: 500 },
    { month: 'May', usage: 550 },
    { month: 'Jun', usage: 600 },
];

// 2. Outdoor Temperature (Bar Chart) in °C
const outdoorTempData = [
    { day: 'Mon', temperature: 15 },
    { day: 'Tue', temperature: 18 },
    { day: 'Wed', temperature: 17 },
    { day: 'Thu', temperature: 16 },
    { day: 'Fri', temperature: 19 },
    { day: 'Sat', temperature: 21 },
    { day: 'Sun', temperature: 20 },
];

// 3. Energy Source Breakdown (Pie Chart)
const energySourceData = [
    { name: 'Solar', value: 400 },
    { name: 'Wind', value: 300 },
    { name: 'Hydro', value: 300 },
    { name: 'Fossil', value: 200 },
];
const pieColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// 4. Outdoor Humidity (Line Chart) in %
const humidityData = [
    { hour: '6 AM', humidity: 80 },
    { hour: '9 AM', humidity: 70 },
    { hour: '12 PM', humidity: 60 },
    { hour: '3 PM', humidity: 65 },
    { hour: '6 PM', humidity: 75 },
    { hour: '9 PM', humidity: 85 },
];

// HouseMarker component with separated current temperature and slider for target temperature
function HouseMarker({ id, position, houseName, initialTemperature, targetTemp }: {
    id: number;
    position: [number, number];
    houseName: string;
    initialTemperature: number;
    targetTemp: number;
}) {
    const [targetTemperature, setTargetTemperature] = useState(targetTemp ?? initialTemperature);
    const [saving, setSaving] = useState(false);

    const handleSave = () => {
        setSaving(true);
        fetch(`/houses/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
            },
            body: JSON.stringify({ target_temp: targetTemperature })
        })
        .then(() => setSaving(false));
    };
    const increaseTemp = () => {
        setTargetTemperature((prev) => Math.min(prev + 1, 30));
    };

    const decreaseTemp = () => {
        setTargetTemperature((prev) => Math.max(prev - 1, 10));
    };
    return (
        <Marker position={position} icon={houseIcon}>
            <Popup>
            <div className="flex flex-col items-center gap-3">
    <h4 className="font-bold text-xl text-center">{houseName}</h4>

    <p className="text-sm text-neutral-600 dark:text-neutral-300">
        Current Temp: <span className="font-semibold">{initialTemperature}°C</span>
    </p>

    <div className="relative flex h-24 w-24 flex-col items-center justify-center rounded-full bg-gradient-to-b from-neutral-200 to-neutral-300 shadow-inner dark:from-neutral-700 dark:to-neutral-800">
        {/* Shine effect */}
        <div className="absolute top-1 left-1 right-1 bottom-1 rounded-full bg-gradient-to-b from-white/40 to-transparent dark:from-white/10"></div>

        {/* Target temperature */}
        <div className="z-10 text-2xl font-bold text-neutral-900 dark:text-white">
            {targetTemperature}°C
        </div>
    </div>

    <div className="flex gap-4">
    <button
        onClick={decreaseTemp}
        className="rounded-full bg-blue-600 px-4 py-2 shadow-md hover:bg-blue-700 active:translate-y-px cursor-pointer"
    >
        <ChevronDown className="h-5 w-5 text-white" />
    </button>
    <button
        onClick={increaseTemp}
        className="rounded-full bg-red-600 px-4 py-2 shadow-md hover:bg-red-700 active:translate-y-px cursor-pointer"
    >
        <ChevronUp className="h-5 w-5 text-white" />
    </button>
</div>


    <button
        onClick={handleSave}
        className="mt-2 w-full rounded bg-green-700 py-1 text-white hover:bg-green-800 shadow cursor-pointer"
    >
        {saving ? 'Saving...' : 'Save'}
    </button>
</div>

            </Popup>
        </Marker>
    );
}

export default function Dashboard() {
    const [houses, setHouses] = useState<HouseType[]>([]);

    useEffect(() => {
        fetch('/houses')
            .then(res => res.json())
            .then(data => {
                console.log("Fetched houses:", data); // 👈 Add this here
                setHouses(data);
            });
    }, []);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Top Grid for Multiple Charts */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Chart 1: Monthly Energy Usage (Line Chart) */}
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border bg-white p-4 dark:bg-neutral-900">
                        <h3 className="mb-2 text-sm font-semibold">Monthly Energy Usage (kWh)</h3>
                        <ResponsiveContainer width="100%" height="80%">
                            <LineChart data={energyUsageData}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200 dark:stroke-neutral-700" />
                                <XAxis dataKey="month" stroke="#64748b" tick={{ fill: '#64748b' }} />
                                <YAxis stroke="#64748b" tick={{ fill: '#64748b' }} />
                                <Tooltip />
                                <Line type="monotone" dataKey="usage" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Chart 2: Outdoor Temperature (Bar Chart) */}
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border bg-white p-4 dark:bg-neutral-900">
                        <h3 className="mb-2 text-sm font-semibold">Outdoor Temperature (°C)</h3>
                        <ResponsiveContainer width="100%" height="80%">
                            <BarChart data={outdoorTempData}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200 dark:stroke-neutral-700" />
                                <XAxis dataKey="day" stroke="#64748b" tick={{ fill: '#64748b' }} />
                                <YAxis stroke="#64748b" tick={{ fill: '#64748b' }} />
                                <Tooltip />
                                <Bar dataKey="temperature" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Chart 3: Energy Source Breakdown (Pie Chart) */}
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border bg-white p-4 dark:bg-neutral-900">
                        <h3 className="mb-2 text-sm font-semibold">Energy Source Breakdown</h3>
                        <ResponsiveContainer width="100%" height="80%">
                            <PieChart>
                                <Pie 
                                    data={energySourceData} 
                                    dataKey="value" 
                                    nameKey="name" 
                                    cx="50%" 
                                    cy="50%" 
                                    outerRadius={50} 
                                    label
                                >
                                    {energySourceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Chart 4: Outdoor Humidity (Line Chart) */}
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border bg-white p-4 dark:bg-neutral-900">
                        <h3 className="mb-2 text-sm font-semibold">Outdoor Humidity (%)</h3>
                        <ResponsiveContainer width="100%" height="80%">
                            <LineChart data={humidityData}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200 dark:stroke-neutral-700" />
                                <XAxis dataKey="hour" stroke="#64748b" tick={{ fill: '#64748b' }} />
                                <YAxis stroke="#64748b" tick={{ fill: '#64748b' }} />
                                <Tooltip />
                                <Line type="monotone" dataKey="humidity" stroke="#ff7300" strokeWidth={2} dot={{ fill: '#ff7300' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Bottom Large Grid with Interactive Map */}
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[600px] flex-1 overflow-hidden rounded-xl border">
                    <MapContainer center={[47.6825, 20.225]} zoom={15} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {houses.map((house) => (
                            <HouseMarker 
                                key={house.id} 
                                id={house.id}
                                position={[house.latitude, house.longitude]}
                                houseName={house.name}
                                initialTemperature={house.current_temp}
                                targetTemp={house.target_temp}
                            />
                        ))}
                    </MapContainer>
                </div>
            </div>
        </AppLayout>
    );
}
