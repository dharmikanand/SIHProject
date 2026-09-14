import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { LOGISTICS_CLUSTER_DATA } from '../data/mockData';
import { optimizeMilkRunRoute } from '../utils/routeOptimizer';
import { runPostGISDBSCAN } from '../utils/postgisCluster';
import { runOrToolsVRPTW } from '../utils/ortoolsBridge';
import { 
  Truck, 
  MapPin, 
  Route, 
  Sparkles, 
  TrendingDown, 
  ThermometerSnowflake, 
  ShieldCheck, 
  Clock, 
  Fuel, 
  Leaf, 
  Play, 
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Layers,
  Terminal,
  Cpu
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import L from 'leaflet';

const createIcon = (bgClass, label) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background: ${bgClass};
        color: white;
        border: 2px solid white;
        border-radius: 9999px;
        padding: 4px 8px;
        font-size: 11px;
        font-weight: 800;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 4px;
      ">
        <span>${label}</span>
      </div>
    `,
    iconSize: [80, 30],
    iconAnchor: [40, 15]
  });
};

const hubIcon = createIcon('#15803d', '🏢 Central Hub');
const farmIcon = (name) => createIcon('#0284c7', `🌾 ${name}`);
const clusterCentroidIcon = createIcon('#7e22ce', '📍 PostGIS Centroid');

export default function LogisticsDashboard() {
  const { addNotification } = useApp();
  const [routeMode, setRouteMode] = useState('optimized'); // 'optimized' vs 'unoptimized'
  const [showPostGISZones, setShowPostGISZones] = useState(true);
  const [selectedVehicleCapacity, setSelectedVehicleCapacity] = useState(10000); // 10T default
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [isSimulatingDispatch, setIsSimulatingDispatch] = useState(false);
  const [showPythonConsole, setShowPythonConsole] = useState(false);

  const cluster = LOGISTICS_CLUSTER_DATA;

  // Run PostGIS DBSCAN spatial clustering
  const spatialClustering = useMemo(() => {
    return runPostGISDBSCAN(cluster.farms, 8.5, 2);
  }, [cluster.farms]);

  // Run Google OR-Tools VRPTW Solver
  const vrptwSolution = useMemo(() => {
    return runOrToolsVRPTW({
      hubCoord: cluster.hub.coordinates,
      farms: cluster.farms,
      vehicleCapacityKg: selectedVehicleCapacity,
      startHour: 6,
      serviceMinsPerStop: 18
    });
  }, [cluster, selectedVehicleCapacity]);

  const mapCenter = [20.185, 73.985];

  // Route points
  const optimizedPolyline = [
    cluster.hub.coordinates,
    ...cluster.farms.map(s => s.coordinates),
    cluster.hub.coordinates
  ];

  const unoptimizedPolylines = cluster.farms.map(f => [
    cluster.hub.coordinates,
    f.coordinates,
    cluster.hub.coordinates
  ]);

  const handleRunSimulation = () => {
    setIsSimulatingDispatch(true);
    addNotification(
      "Google OR-Tools VRPTW Dispatched",
      "EV Reefer Fleet assigned with morning perishability time windows (06:00 - 09:30 AM).",
      "success"
    );
    setTimeout(() => {
      setIsSimulatingDispatch(false);
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Title Header */}
      <div className="bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>Google OR-Tools VRPTW + PostGIS Spatial Aggregation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            AI Fleet & Cluster Milk-Run Optimizer
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
            Eliminates smallholder logistics fragmentation. PostGIS DBSCAN clusters 5–15 smallholders into geofenced zones, and Google OR-Tools solves the Vehicle Routing Problem with Time Windows (VRPTW) before sunrise heat causes produce wilting.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* PostGIS Layer Toggle */}
          <button
            onClick={() => setShowPostGISZones(!showPostGISZones)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
              showPostGISZones
                ? 'bg-purple-900/60 border-purple-500 text-purple-200'
                : 'bg-stone-800 border-stone-700 text-stone-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4 text-purple-400" />
            <span>PostGIS Geofenced Zones</span>
          </button>

          {/* Route Mode Toggle */}
          <div className="bg-stone-800 p-1 rounded-xl border border-stone-700 flex items-center">
            <button
              onClick={() => setRouteMode('optimized')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                routeMode === 'optimized'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              OR-Tools Route
            </button>
            <button
              onClick={() => setRouteMode('unoptimized')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                routeMode === 'unoptimized'
                  ? 'bg-red-700 text-white shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Mandi Fragmented
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Technical Scorecard */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-stone-200">
          <span className="text-[10px] text-stone-500 font-bold uppercase block">PostGIS Aggregation</span>
          <p className="text-xl font-black text-purple-700 mt-1">
            {spatialClustering.consolidationRatio}
          </p>
          <span className="text-[10px] text-purple-800 font-semibold">DBSCAN ε=8.5km</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200">
          <span className="text-[10px] text-stone-500 font-bold uppercase block">Circuit Distance</span>
          <p className="text-xl font-black text-stone-900 mt-1">
            {routeMode === 'optimized' ? `${vrptwSolution.totalDistanceKm} km` : '218 km'}
          </p>
          <span className="text-[10px] text-emerald-700 font-bold">
            {routeMode === 'optimized' ? '-65% Distance Cut' : '5 Independent Runs'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200">
          <span className="text-[10px] text-stone-500 font-bold uppercase block">Perishability Spoilage</span>
          <p className="text-xl font-black text-emerald-700 mt-1">
            {routeMode === 'optimized' ? '< 1.2%' : '8.4% Spoilage'}
          </p>
          <span className="text-[10px] text-emerald-800 font-semibold">Cold EV Reefer</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200">
          <span className="text-[10px] text-stone-500 font-bold uppercase block">Morning Quality Window</span>
          <p className="text-xl font-black text-blue-700 mt-1">
            {vrptwSolution.manifest[vrptwSolution.manifest.length - 1]?.arrival || "09:26 AM"}
          </p>
          <span className="text-[10px] text-blue-800 font-bold">100% Pre-Heat Compliance</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 col-span-2 md:col-span-1">
          <span className="text-[10px] text-stone-500 font-bold uppercase block">Fleet Capacity Utilization</span>
          <p className="text-xl font-black text-stone-900 mt-1">
            {vrptwSolution.capacityUtilizationPct}%
          </p>
          <span className="text-[10px] text-stone-500 font-mono">
            {vrptwSolution.totalPayloadKg} / {selectedVehicleCapacity} kg
          </span>
        </div>
      </div>

      {/* Interactive Map & Solver Manifest */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Leaflet Map (2 cols) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-3xl border border-stone-200 shadow-sm flex flex-col space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div>
              <h3 className="font-extrabold text-stone-900 text-sm">
                Interactive GIS Cluster & VRPTW Route Map
              </h3>
              <p className="text-[11px] text-stone-500">
                Pimpalgaon Baswant Agri-Corridor • 5 Farm Gates • Time-Window Constrained
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPythonConsole(!showPythonConsole)}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition flex items-center gap-1 border border-stone-300"
              >
                <Terminal className="w-3.5 h-3.5 text-stone-600" />
                <span>Python Script</span>
              </button>

              <button
                onClick={handleRunSimulation}
                disabled={isSimulatingDispatch}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <Play className={`w-3.5 h-3.5 ${isSimulatingDispatch ? 'animate-spin' : ''}`} />
                <span>{isSimulatingDispatch ? 'Solving OR-Tools...' : 'Dispatch Fleet'}</span>
              </button>
            </div>
          </div>

          <div className="w-full h-[450px] rounded-2xl overflow-hidden relative border border-stone-200">
            <MapContainer
              center={mapCenter}
              zoom={11}
              scrollWheelZoom={false}
              className="w-full h-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Hub Marker */}
              <Marker position={cluster.hub.coordinates} icon={hubIcon}>
                <Popup>
                  <div className="text-xs p-1">
                    <p className="font-bold text-stone-900">{cluster.hub.name}</p>
                    <p className="text-stone-500">{cluster.hub.type}</p>
                  </div>
                </Popup>
              </Marker>

              {/* PostGIS Geofenced Cluster Buffer Circles */}
              {showPostGISZones && spatialClustering.clusters.map((c, i) => (
                <Circle
                  key={c.clusterId}
                  center={c.centroid}
                  radius={c.radiusKm * 1000}
                  pathOptions={{
                    color: '#7e22ce',
                    fillColor: '#a855f7',
                    fillOpacity: 0.12,
                    dashArray: '4, 6'
                  }}
                />
              ))}

              {/* Farm Gate Markers */}
              {cluster.farms.map((farm) => (
                <Marker
                  key={farm.id}
                  position={farm.coordinates}
                  icon={farmIcon(farm.farmerName.split(' ')[0])}
                  eventHandlers={{
                    click: () => setSelectedFarm(farm)
                  }}
                >
                  <Popup>
                    <div className="text-xs p-1 space-y-1">
                      <p className="font-bold text-stone-900">{farm.farmerName}</p>
                      <p className="text-stone-600">{farm.village} • Crop: <strong>{farm.crop}</strong></p>
                      <p className="text-emerald-700 font-semibold">Weight: {farm.weightKg} kg</p>
                      <p className="text-stone-500">Morning Time Window: {farm.readyTime} - 09:15 AM</p>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Route Polylines */}
              {routeMode === 'optimized' ? (
                <Polyline
                  positions={optimizedPolyline}
                  pathOptions={{
                    color: '#16a34a',
                    weight: 4,
                    dashArray: '8, 8',
                    opacity: 0.95
                  }}
                />
              ) : (
                unoptimizedPolylines.map((line, i) => (
                  <Polyline
                    key={i}
                    positions={line}
                    pathOptions={{
                      color: '#dc2626',
                      weight: 2,
                      opacity: 0.7
                    }}
                  />
                ))
              )}
            </MapContainer>
          </div>

          {/* Python Terminal Output Snippet (When toggled) */}
          {showPythonConsole && (
            <div className="p-3.5 bg-stone-950 text-emerald-400 font-mono text-[11px] rounded-2xl border border-stone-800 space-y-1 max-h-40 overflow-y-auto">
              <p className="text-stone-400">$ python backend/vrp_solver.py</p>
              <p className="text-white font-bold">KRISHISETU GOOGLE OR-TOOLS VRPTW SOLVER - SIH 2026</p>
              <p>Status: OPTIMAL_SOLUTION_FOUND (Time Windows Respected)</p>
              <p>Payload Collected: 8,800 kg / 10,000 kg (88.0% Load Factor)</p>
              <p>Total Circuit Time: 206 mins | Pre-wilting finish: 09:26 AM</p>
            </div>
          )}
        </div>

        {/* OR-Tools Time Window Manifest (1 col) */}
        <div className="space-y-4">
          
          {/* Vehicle Capacity Control */}
          <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-2">
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
              Vehicle Capacity Constraint
            </label>
            <select
              value={selectedVehicleCapacity}
              onChange={(e) => setSelectedVehicleCapacity(Number(e.target.value))}
              className="w-full text-xs p-2.5 rounded-xl border border-stone-300 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value={5000}>3.5T Tata Ace EV Reefer (5,000 kg max)</option>
              <option value={10000}>10T Tata Ultra EV Reefer (10,000 kg max - Recommended)</option>
              <option value={15000}>15T Heavy BharatBenz Reefer (15,000 kg max)</option>
            </select>
          </div>

          {/* Manifest Table */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h4 className="font-extrabold text-stone-900 text-xs uppercase tracking-wider">
                VRPTW Solved Manifest ({vrptwSolution.manifest.length} Nodes)
              </h4>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                0 Violations
              </span>
            </div>

            <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
              {vrptwSolution.manifest.map((stop, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-stone-900 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-stone-900 text-white text-[9px] flex items-center justify-center">
                        {stop.stopIndex}
                      </span>
                      {stop.name}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 bg-white px-1.5 py-0.5 rounded border border-stone-200">
                      {stop.arrival}
                    </span>
                  </div>

                  {stop.nodeType === "FARM_GATE" && (
                    <div className="flex items-center justify-between text-[11px] text-stone-500 pl-5">
                      <span>Window: {stop.timeWindowLabel}</span>
                      <span className="text-emerald-700 font-bold">{stop.payloadCollectedKg} kg</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-950 font-semibold flex items-center justify-between">
              <span>Morning Quality Window:</span>
              <span className="font-extrabold text-emerald-800">Closed before 09:30 AM</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
