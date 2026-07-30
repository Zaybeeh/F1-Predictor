import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

// ==========================================
// CONFIGURATION & SUPABASE
// ==========================================
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const isSupabaseConfigured = supabaseUrl && supabaseKey;
const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseKey) : null;

// ==========================================
// STATIC CONSTANTS
// ==========================================
const gpPoints = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
const sprintPoints = [8, 7, 6, 5, 4, 3, 2, 1];

const teamColors = {
  'McLaren': '#ff8000', 'Red Bull': '#3671c6', 'Ferrari': '#dc0000', 
  'Mercedes': '#27f4d2', 'Aston Martin': '#229971', 'Alpine': '#0090ff', 
  'Haas': '#ffffff', 'VCARB': '#5a96ff', 'Williams': '#005aff', 
  'Audi': '#e2051c', 'Cadillac': '#ffb800', 'Racing Bulls': '#6692FF'
};

// Pure Team Color Engine (Base wall color + Vibrant Accent Orbs)
const teamThemes = {
  'McLaren': { bg: '#1f0d00', orb1: '#ff8000', orb2: '#fbbf24', orb3: '#ea580c' }, 
  'Red Bull': { bg: '#050a1f', orb1: '#3671c6', orb2: '#dc2626', orb3: '#facc15' }, 
  'Ferrari': { bg: '#240202', orb1: '#dc0000', orb2: '#f59e0b', orb3: '#ff4500' }, 
  'Mercedes': { bg: '#021f1a', orb1: '#27f4d2', orb2: '#ffffff', orb3: '#0d9488' }, 
  'Aston Martin': { bg: '#031c15', orb1: '#229971', orb2: '#bef264', orb3: '#047857' }, 
  'Alpine': { bg: '#050c1f', orb1: '#0090ff', orb2: '#FF87BC', orb3: '#3b82f6' }, 
  'Haas': { bg: '#121212', orb1: '#ffffff', orb2: '#ef4444', orb3: '#a1a1aa' }, 
  'VCARB': { bg: '#051024', orb1: '#5a96ff', orb2: '#cbd5e1', orb3: '#2563eb' }, 
  'Racing Bulls': { bg: '#051024', orb1: '#5a96ff', orb2: '#cbd5e1', orb3: '#2563eb' },
  'Williams': { bg: '#020f26', orb1: '#005aff', orb2: '#38bdf8', orb3: '#0284c7' }, 
  'Audi': { bg: '#1f0306', orb1: '#e2051c', orb2: '#f87171', orb3: '#991b1b' }, 
  'Cadillac': { bg: '#241a00', orb1: '#ffb800', orb2: '#fcd34d', orb3: '#d97706' }, 
  'default': { bg: '#050505', orb1: '#2563eb', orb2: '#9333ea', orb3: '#10b981' } 
};

// ==========================================
// SVG ICONS
// ==========================================
const TrophyIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M19 3v4M5 7a4 4 0 008 0M19 7a4 4 0 01-8 0M12 11v8M9 19h6" /></svg>;
//const CalendarIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const SparklesIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M19 3v4M5 7a4 4 0 008 0M19 7a4 4 0 01-8 0M12 11v8M9 19h6" /></svg>;
const CheckIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>;
const TrashIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const DownloadIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;
const UploadIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;
const CloseIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
const SettingsIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const ArrowUpIcon = () => <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4l8 10H4z" /></svg>;
const ArrowDownIcon = () => <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 20l-8-10h16z" /></svg>;

// ==========================================
// MAIN APP COMPONENT
// ==========================================
export default function App() {
  const [drivers, setDrivers] = useState([]); 
  const [tracks, setTracks] = useState([]);
  
  const [activeTab, setActiveTab] = useState('predictor'); 
  const [standingsTab, setStandingsTab] = useState('wdc'); 
  
  const [activeRaceId, setActiveRaceId] = useState(null);
  const [solverTarget, setSolverTarget] = useState('');
  const [editingPosition, setEditingPosition] = useState(null);
  const [analyticsTargetId, setAnalyticsTargetId] = useState('');

  // 1. Fetch from Supabase on Load
  useEffect(() => {
    const loadData = async () => {
      if (!isSupabaseConfigured) return;
      const { data, error } = await supabase.from('f1_season_data').select('state_data').eq('id', 1).single();
      if (data && data.state_data) {
        setDrivers(data.state_data.drivers || []);
        const sortedTracks = (data.state_data.tracks || []).sort((a, b) => a.round - b.round);
        setTracks(sortedTracks);
      }
      if (error) console.error("Fetch error:", error.message);
    };
    loadData();
  }, []);

  // 2. Persist to Supabase
  const saveToSupabase = async (newDrivers, newTracks) => {
    if (!isSupabaseConfigured) {
      console.warn("Supabase is not configured. Changes will not persist on refresh.");
      return;
    }
    try {
      const { error } = await supabase.from('f1_season_data').upsert({ 
        id: 1, 
        state_data: { drivers: newDrivers, tracks: newTracks } 
      });
      if (error) console.error("Supabase Save Error:", error.message);
    } catch (err) {
      console.error("Supabase Exception:", err);
    }
  };

  // 3. Dynamic Background Theme Extractor
  const backgroundTheme = useMemo(() => {
    const completedRaces = tracks.filter(t => t.isActive && t.status === 'completed').sort((a, b) => b.round - a.round);
    if (completedRaces.length > 0) {
      const lastWinnerId = completedRaces[0].gpResults[0];
      const winner = drivers.find(d => d.id === lastWinnerId);
      if (winner && teamThemes[winner.team]) {
        return teamThemes[winner.team];
      }
    }
    return teamThemes['default'];
  }, [tracks, drivers]);

  // 4. Mathematical Engine: Adaptive Baseline Ranks
  const baseRanks = useMemo(() => {
    const hasPredictions = tracks.some(t => t.isActive && t.status === 'upcoming' && (t.gpResults.some(id => id !== '') || t.sprintResults.some(id => id !== '')));
    let wdcBasePoints = [...drivers].map(d => ({ ...d, currentPoints: d.points || 0 }));
    
    if (!hasPredictions) {
       const completedRacesSorted = tracks.filter(t => t.status === 'completed' && t.isActive).sort((a, b) => b.round - a.round);
       const lastCompletedRace = completedRacesSorted[0];
       if (lastCompletedRace) {
           lastCompletedRace.gpResults.forEach((id, i) => {
              if (id && gpPoints[i]) {
                 const d = wdcBasePoints.find(x => x.id === id);
                 if (d) d.currentPoints -= gpPoints[i];
              }
           });
           if (lastCompletedRace.isSprint) {
              lastCompletedRace.sprintResults.forEach((id, i) => {
                 if (id && sprintPoints[i]) {
                    const d = wdcBasePoints.find(x => x.id === id);
                    if (d) d.currentPoints -= sprintPoints[i];
                 }
              });
           }
       }
    }

    wdcBasePoints.sort((a, b) => b.currentPoints - a.currentPoints || a.id.localeCompare(b.id));
    const wdcRanks = {};
    wdcBasePoints.forEach((d, i) => { wdcRanks[d.id] = i + 1; });

    const wccTeams = {};
    wdcBasePoints.forEach(d => {
       if (!wccTeams[d.team]) wccTeams[d.team] = { id: d.team, currentPoints: 0 };
       wccTeams[d.team].currentPoints += d.currentPoints;
    });
    const wccBasePoints = Object.values(wccTeams).sort((a, b) => b.currentPoints - a.currentPoints || a.id.localeCompare(b.id));
    const wccRanks = {};
    wccBasePoints.forEach((t, i) => { wccRanks[t.id] = i + 1; });

    return { wdc: wdcRanks, wcc: wccRanks };
  }, [drivers, tracks]);

  // 5. Mathematical Engine: Live Driver Standings
  const liveStandings = useMemo(() => {
    if (!drivers || drivers.length === 0) return [];
    const standings = drivers.map(d => ({ ...d, currentPoints: d.points || 0 }));
    const activeSeasonTracks = tracks.filter(t => t.isActive);

    activeSeasonTracks.forEach(t => {
      if (t.status === 'upcoming') {
        (t.gpResults || []).forEach((driverId, i) => {
          if (driverId) {
            const d = standings.find(s => s.id === driverId);
            if (d && gpPoints[i]) d.currentPoints += gpPoints[i];
          }
        });
        if (t.isSprint) {
          (t.sprintResults || []).forEach((driverId, i) => {
            if (driverId) {
              const d = standings.find(s => s.id === driverId);
              if (d && sprintPoints[i]) d.currentPoints += sprintPoints[i];
            }
          });
        }
      }
    });

    standings.sort((a, b) => b.currentPoints - a.currentPoints || a.id.localeCompare(b.id));

    const uncompletedRaces = activeSeasonTracks.filter(t => t.status === 'upcoming');
    let maxPointsAvailable = 0;
    uncompletedRaces.forEach(r => { maxPointsAvailable += 25; if (r.isSprint) maxPointsAvailable += 8; });

    const leaderPts = standings[0]?.currentPoints || 0;
    standings.forEach((d, i) => {
      if (i === 0) d.status = (standings.length > 1 && (leaderPts - standings[1].currentPoints > maxPointsAvailable)) ? 'CHAMPION' : 'CONTENDER';
      else d.status = (leaderPts - d.currentPoints > maxPointsAvailable) ? 'ELIMINATED' : 'CONTENDER';
    });

    return standings;
  }, [drivers, tracks]);

  // 6. Mathematical Engine: Live Constructor Standings (WCC)
  const liveWccStandings = useMemo(() => {
    if (!liveStandings || liveStandings.length === 0) return [];
    
    const teams = {};
    liveStandings.forEach(d => {
       if (!teams[d.team]) teams[d.team] = { id: d.team, name: d.team, currentPoints: 0, drivers: [] };
       teams[d.team].currentPoints += d.currentPoints;
       const dName = d.name.split(" ").slice(-1)[0];
       if (!teams[d.team].drivers.includes(dName)) {
           teams[d.team].drivers.push(dName);
       }
    });
    
    const wccArray = Object.values(teams).sort((a, b) => b.currentPoints - a.currentPoints || a.name.localeCompare(b.name));
    const activeSeasonTracks = tracks.filter(t => t.isActive);
    const uncompletedRaces = activeSeasonTracks.filter(t => t.status === 'upcoming');
    
    let wccMaxPointsAvailable = 0;
    uncompletedRaces.forEach(r => {
      wccMaxPointsAvailable += 43; 
      if (r.isSprint) wccMaxPointsAvailable += 15; 
    });

    const wccLeaderPts = wccArray[0]?.currentPoints || 0;
    const wccSecondPts = wccArray[1]?.currentPoints || 0;
    
    wccArray.forEach((t, i) => {
      if (i === 0) t.status = (wccArray.length > 1 && (wccLeaderPts - wccSecondPts > wccMaxPointsAvailable)) ? 'CHAMPION' : 'CONTENDER';
      else t.status = (wccLeaderPts - t.currentPoints > wccMaxPointsAvailable) ? 'ELIMINATED' : 'CONTENDER';
    });

    return wccArray;
  }, [liveStandings, tracks]);

  // 7. Predictor & Data Handlers
  const handlePredictionChange = async (raceId, session, posIndex, driverId) => {
    let updatedTracks = [];
    setTracks(prev => {
      updatedTracks = prev.map(t => {
        if (t.id !== raceId) return t;
        const currentSessionArr = [...(t[session] || (session === 'gpResults' ? Array(10).fill('') : Array(8).fill('')))];
        const existingDriverPos = currentSessionArr.findIndex(id => id === driverId);
        
        if (existingDriverPos >= 0 && existingDriverPos !== posIndex) {
          const previousOccupant = currentSessionArr[posIndex];
          currentSessionArr[existingDriverPos] = previousOccupant || '';
          currentSessionArr[posIndex] = driverId;
        } else {
          currentSessionArr[posIndex] = driverId;
        }
        return { ...t, [session]: currentSessionArr };
      });
      return updatedTracks;
    });
    setEditingPosition(null); 
    await saveToSupabase(drivers, updatedTracks);
  };

  const toggleRaceStatus = async (raceId, newStatus) => {
    let updatedDrivers = drivers.map(d => ({ ...d })); 
    const track = tracks.find(t => t.id === raceId);
    if (!track) return;

    if (newStatus === 'completed' && track.status === 'upcoming') {
        track.gpResults.forEach((id, i) => {
            if (id && gpPoints[i]) { let d = updatedDrivers.find(x => x.id === id); if (d) d.points += gpPoints[i]; }
        });
        if (track.isSprint) {
            track.sprintResults.forEach((id, i) => {
                if (id && sprintPoints[i]) { let d = updatedDrivers.find(x => x.id === id); if (d) d.points += sprintPoints[i]; }
            });
        }
    } else if (newStatus === 'upcoming' && track.status === 'completed') {
        track.gpResults.forEach((id, i) => {
            if (id && gpPoints[i]) { let d = updatedDrivers.find(x => x.id === id); if (d) d.points -= gpPoints[i]; }
        });
        if (track.isSprint) {
            track.sprintResults.forEach((id, i) => {
                if (id && sprintPoints[i]) { let d = updatedDrivers.find(x => x.id === id); if (d) d.points -= sprintPoints[i]; }
            });
        }
    }

    const updatedTracks = tracks.map(t => t.id === raceId ? { ...t, status: newStatus } : t);
    setDrivers(updatedDrivers);
    setTracks(updatedTracks);
    if (newStatus === 'completed') setActiveRaceId(null);
    await saveToSupabase(updatedDrivers, updatedTracks);
  };

  const updateTrackConfig = async (raceId, field, value) => {
    let updated = tracks.map(t => t.id === raceId ? { ...t, [field]: value } : t);
    if (field === 'round') updated.sort((a, b) => a.round - b.round);
    setTracks(updated);
    await saveToSupabase(drivers, updated);
  };

  const resetData = async () => {
    if (!window.confirm("Are you sure you want to clear predictions? (Base driver data and locked track history will remain).")) return;
    const clearedTracks = tracks.map(t => {
      if (t.status === 'upcoming') return { ...t, gpResults: Array(10).fill(''), sprintResults: Array(8).fill('') };
      return t;
    });
    setTracks(clearedTracks);
    setActiveRaceId(null);
    await saveToSupabase(drivers, clearedTracks);
  };

  // 8. CSV Import & Export Engine
  const exportCSV = () => {
    let csv = "# DRIVERS\n";
    csv += "id,name,team,points,number\n";
    drivers.forEach(d => { csv += `${d.id},${d.name},${d.team},${d.points},${d.number}\n`; });
    csv += "\n# TRACKS\n";
    csv += "id,round,name,date,isSprint,isActive,status,gpResults,sprintResults\n";
    tracks.forEach(t => {
      const gpStr = (t.gpResults || []).join('|'); const sprintStr = (t.sprintResults || []).join('|');
      csv += `${t.id},${t.round},${t.name},${t.date},${t.isSprint ? 'TRUE' : 'FALSE'},${t.isActive ? 'TRUE' : 'FALSE'},${t.status},${gpStr},${sprintStr}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "f1_season_data.csv"; a.click();
  };

  const importCSV = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const lines = e.target.result.replace(/\r/g, '').split('\n').map(l => l.trim());
        let mode = ''; let newDrivers = []; let newTracks = [];
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (!line || line.startsWith(',,,,')) continue; 
          if (line.includes('# DRIVERS') || line.includes('--- DRIVER STANDINGS ---')) { mode = 'drivers'; i++; continue; }
          if (line.includes('# TRACKS') || line.includes('--- SEASON CALENDAR ---')) { mode = 'tracks'; i++; continue; }
          
          const parts = line.split(',');
          if (mode === 'drivers') {
             const isSpreadsheet = !isNaN(parseInt(parts[0])) && parts.length >= 6 && parts[1].length === 3;
             if (isSpreadsheet) newDrivers.push({ id: parts[1].toUpperCase(), name: parts[2], team: parts[3], points: Number(parts[4]) || 0, number: 0 });
             else if (parts.length >= 5) newDrivers.push({ id: parts[0], name: parts[1], team: parts[2], points: Number(parts[3]), number: Number(parts[4]) || 0 });
          } else if (mode === 'tracks') {
             const isSpreadsheet = !isNaN(parseInt(parts[0])) && parts.length >= 6 && (parts[4].includes('Standard') || parts[4].includes('Sprint'));
             if (isSpreadsheet) {
                const roundNum = Number(parts[0]);
                const status = parts[5].toLowerCase().includes('completed') ? 'completed' : 'upcoming';
                let gpArr = Array(10).fill('');
                if (status === 'completed' && parts[6]) gpArr[0] = parts[6].toUpperCase();
                
                newTracks.push({
                  id: 'R' + roundNum, round: roundNum, name: parts[1], date: parts[3],
                  isSprint: parts[4].includes('Sprint'), isActive: true, status: status,
                  gpResults: gpArr, sprintResults: Array(8).fill('')
                });
             } else if (parts.length >= 7) {
                let gpArr = parts[7] ? parts[7].split('|') : []; while (gpArr.length < 10) gpArr.push('');
                let sprintArr = parts[8] ? parts[8].split('|') : []; while (sprintArr.length < 8) sprintArr.push('');

                const isSprintVal = parts[4] ? parts[4].toLowerCase() === 'true' : false;
                const isActiveVal = parts[5] ? parts[5].toLowerCase() === 'true' : true;

                newTracks.push({
                  id: parts[0], round: Number(parts[1]), name: parts[2], date: parts[3],
                  isSprint: isSprintVal, isActive: isActiveVal, status: parts[6] || 'upcoming',
                  gpResults: gpArr, sprintResults: sprintArr
                });
             }
          }
        }
        if (newDrivers.length === 0 && newTracks.length === 0) return alert("Could not extract any data. Ensure CSV matches format.");
        newTracks.sort((a, b) => a.round - b.round);
        setDrivers(newDrivers); setTracks(newTracks);
        await saveToSupabase(newDrivers, newTracks);
        alert("Database successfully populated and synced to Supabase!");
      } catch (err) { alert("Error parsing CSV file."); }
    };
    reader.readAsText(file); event.target.value = null; 
  };

  const runSolver = async (scenario) => {
    if (!solverTarget) return alert("Select a target driver first.");
    const updatedTracks = tracks.map(t => {
      if (!t.isActive || t.status === 'completed') return t;
      let gp = Array(10).fill(''); let sprint = Array(8).fill('');
      if (scenario === 'Clean Sweep') {
        gp[0] = solverTarget; if (t.isSprint) sprint[0] = solverTarget;
      } else if (scenario === 'Tight Squeeze') {
        gp[0] = solverTarget;
        const topRivals = [...drivers].sort((a, b) => b.points - a.points).map(d => d.id).filter(id => id !== solverTarget);
        gp[1] = topRivals[0] || ''; if (t.isSprint) { sprint[0] = solverTarget; sprint[1] = topRivals[0] || ''; }
      } else if (scenario === 'Midfield Chaos') {
        gp[0] = solverTarget;
        const chaosDrivers = drivers.filter(d => d.points < 30).map(d => d.id);
        gp[1] = chaosDrivers[0] || ''; gp[2] = chaosDrivers[1] || ''; gp[3] = chaosDrivers[2] || '';
        if (t.isSprint) { sprint[0] = solverTarget; sprint[1] = chaosDrivers[0] || ''; }
      }
      return { ...t, gpResults: gp, sprintResults: sprint };
    });
    setTracks(updatedTracks); setActiveTab('predictor');
    await saveToSupabase(drivers, updatedTracks);
  };

  // ==========================================
  // RENDER HELPERS
  // ==========================================
  const activeSeasonTracks = tracks.filter(t => t.isActive);
  const uncompletedRaces = activeSeasonTracks.filter(t => t.status === 'upcoming');
  const completedRaces = activeSeasonTracks.filter(t => t.status === 'completed');
  const activeRace = tracks.find(r => r.id === activeRaceId);
  const safeGp = activeRace?.gpResults || Array(10).fill('');
  const safeSprint = activeRace?.sprintResults || Array(8).fill('');
  const eligibleContenders = liveStandings.filter((d, i) => i !== 0 && d.status === 'CONTENDER');

  return (
    <div className="min-h-screen relative font-sans text-white/90 overflow-hidden flex flex-col transition-colors duration-1000" style={{ backgroundColor: backgroundTheme.bg }}>
      
      {/* Dark vignette to create depth over the team's base color */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.7)_100%)] z-0" />
      
      {/* Dynamic Background Orbs based on last winning team */}
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[160px] pointer-events-none transition-colors duration-1000 mix-blend-screen opacity-30 z-0" style={{ backgroundColor: backgroundTheme.orb1 }} />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full blur-[160px] pointer-events-none transition-colors duration-1000 mix-blend-screen opacity-30 z-0" style={{ backgroundColor: backgroundTheme.orb2 }} />
      <div className="fixed top-[30%] left-[50%] w-[30vw] h-[30vw] rounded-full blur-[120px] pointer-events-none transition-colors duration-1000 mix-blend-screen opacity-20 z-0" style={{ backgroundColor: backgroundTheme.orb3 }} />

      {/* Header */}
      <header className="relative z-10 w-full p-6 border-b border-white/10 bg-white/5 backdrop-blur-md flex flex-wrap justify-between items-center gap-4 shadow-lg">
        <div>
          <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 flex items-center gap-2">
            <TrophyIcon /> F1 2026 Live Predictor
          </h1>
          <p className="text-xs text-white/50 mt-1 uppercase tracking-widest font-bold">Championship Mathematical Engine & Sync</p>
        </div>
        <div className="flex gap-3">
          <label className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm transition-all cursor-pointer font-bold shadow-sm">
            <UploadIcon /> Import CSV
            <input type="file" accept=".csv" onChange={importCSV} className="hidden" />
          </label>
          <button onClick={exportCSV} className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm transition-all font-bold shadow-sm"><DownloadIcon /> Export CSV</button>
          <button onClick={resetData} className="flex items-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-500/30 rounded-xl text-sm transition-all font-bold shadow-sm"><TrashIcon /> Reset</button>
        </div>
      </header>

      {/* Main Grid */}
      <main className="relative z-10 p-6 flex-1 max-w-screen-2xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Standings (WDC/WCC Toggle) */}
        <section className="lg:col-span-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-white">
              <TrophyIcon /> Standings
            </h2>
            <div className="flex bg-black/40 rounded-lg p-1 border border-white/5">
               <button onClick={() => setStandingsTab('wdc')} className={`text-[10px] uppercase font-black tracking-widest px-3 py-1.5 rounded-md transition-all ${standingsTab === 'wdc' ? 'bg-white/15 text-white shadow-sm' : 'text-white/50 hover:text-white'}`}>WDC</button>
               <button onClick={() => setStandingsTab('wcc')} className={`text-[10px] uppercase font-black tracking-widest px-3 py-1.5 rounded-md transition-all ${standingsTab === 'wcc' ? 'bg-white/15 text-white shadow-sm' : 'text-white/50 hover:text-white'}`}>WCC</button>
            </div>
          </div>
          
          <div className="space-y-2 max-h-[75vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20">
            {liveStandings.length === 0 ? (
              <div className="p-8 mt-4 text-center bg-black/30 rounded-xl border border-dashed border-white/20">
                <UploadIcon className="w-8 h-8 mx-auto text-white/30 mb-3" />
                <p className="text-white/50 text-sm font-bold uppercase tracking-widest">Database Empty</p>
                <p className="text-white/30 text-xs mt-2">Import a CSV database to populate standings.</p>
              </div>
            ) : standingsTab === 'wdc' ? (
              /* --- WDC STANDINGS RENDER --- */
              liveStandings.map((driver, index) => {
                const borderCol = teamColors[driver.team] || '#ffffff';
                const baseRank = baseRanks.wdc[driver.id];
                const currentRank = index + 1;
                const rankChange = baseRank ? (baseRank - currentRank) : 0; 
                
                return (
                  <div key={driver.id} style={{ borderLeftColor: borderCol }} className={`border-l-4 bg-black/30 hover:bg-black/50 transition-colors p-3 rounded-r-xl flex justify-between items-center border-y border-r border-white/5 ${driver.status === 'ELIMINATED' ? 'opacity-50' : ''}`}>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-white/50 w-4 text-right text-xs font-bold">{currentRank}</span>
                      
                      <div className="w-5 flex justify-center shrink-0">
                        {rankChange > 0 ? (
                          <div className="flex flex-col items-center">
                            <span className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]"><ArrowUpIcon /></span>
                            <span className="text-[9px] font-black text-emerald-400 leading-none mt-0.5">{rankChange}</span>
                          </div>
                        ) : rankChange < 0 ? (
                          <div className="flex flex-col items-center">
                            <span className="text-red-500"><ArrowDownIcon /></span>
                            <span className="text-[9px] font-black text-red-500 leading-none mt-0.5">{Math.abs(rankChange)}</span>
                          </div>
                        ) : (
                          <div className="w-2.5 h-[2px] bg-white/10 rounded-full mt-1" />
                        )}
                      </div>

                      <div>
                        <div className="font-bold text-sm text-white whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">{driver.name}</div>
                        <div className="text-[9px] uppercase font-bold tracking-widest" style={{ color: borderCol }}>{driver.team}</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="font-mono text-base font-black leading-none text-white">{driver.currentPoints} <span className="text-[10px] text-white/50 font-sans">pts</span></span>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded font-black uppercase tracking-widest leading-none
                        ${driver.status === 'CHAMPION' ? 'bg-amber-400 text-black shadow-[0_0_10px_rgba(251,191,36,0.3)]' : 
                          driver.status === 'CONTENDER' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-white/50 border border-white/5'}
                      `}>
                        {driver.status}
                      </span>
                    </div>
                  </div>
                )
              })
            ) : (
              /* --- WCC STANDINGS RENDER --- */
              liveWccStandings.map((team, index) => {
                const borderCol = teamColors[team.name] || '#888888';
                const baseRank = baseRanks.wcc[team.id];
                const currentRank = index + 1;
                const rankChange = baseRank ? (baseRank - currentRank) : 0; 
                
                return (
                  <div key={team.id} style={{ borderLeftColor: borderCol }} className={`border-l-4 bg-black/30 hover:bg-black/50 transition-colors p-3 rounded-r-xl flex justify-between items-center border-y border-r border-white/5 ${team.status === 'ELIMINATED' ? 'opacity-50' : ''}`}>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-white/50 w-4 text-right text-xs font-bold">{currentRank}</span>
                      
                      <div className="w-5 flex justify-center shrink-0">
                        {rankChange > 0 ? (
                          <div className="flex flex-col items-center">
                            <span className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]"><ArrowUpIcon /></span>
                            <span className="text-[9px] font-black text-emerald-400 leading-none mt-0.5">{rankChange}</span>
                          </div>
                        ) : rankChange < 0 ? (
                          <div className="flex flex-col items-center">
                            <span className="text-red-500"><ArrowDownIcon /></span>
                            <span className="text-[9px] font-black text-red-500 leading-none mt-0.5">{Math.abs(rankChange)}</span>
                          </div>
                        ) : (
                          <div className="w-2.5 h-[2px] bg-white/10 rounded-full mt-1" />
                        )}
                      </div>

                      <div>
                        <div className="font-bold text-sm text-white whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">{team.name}</div>
                        <div className="text-[8px] uppercase font-bold tracking-widest text-white/60">{team.drivers.join(' / ')}</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="font-mono text-base font-black leading-none text-white">{team.currentPoints} <span className="text-[10px] text-white/50 font-sans">pts</span></span>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded font-black uppercase tracking-widest leading-none
                        ${team.status === 'CHAMPION' ? 'bg-amber-400 text-black shadow-[0_0_10px_rgba(251,191,36,0.3)]' : 
                          team.status === 'CONTENDER' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-white/50 border border-white/5'}
                      `}>
                        {team.status}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </section>

        {/* Right Column: Tabs & Tools */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Tabs Navigation */}
          <div className="flex flex-wrap gap-2 bg-white/5 p-1 rounded-xl backdrop-blur-md w-max border border-white/10">
            {['predictor', 'track_manager', 'scenarios', 'analytics'].map(tab => (
              <button 
                key={tab} onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white/15 text-white shadow-lg' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* TAB: Predictor */}
          {activeTab === 'predictor' && (
            <div className="space-y-6">
              
              {/* Upcoming / Active Races Horizon */}
              <div>
                <h3 className="text-xs text-white/60 font-black uppercase tracking-widest mb-3">Upcoming Active Rounds</h3>
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-thin scrollbar-thumb-white/20">
                  {uncompletedRaces.length === 0 ? (
                    <p className="text-white/40 italic py-2 text-sm">No upcoming races found. Check the Track Manager.</p>
                  ) : uncompletedRaces.map(race => (
                    <button 
                      key={race.id} onClick={() => setActiveRaceId(race.id)}
                      className={`min-w-[160px] p-4 rounded-xl snap-start text-left transition-all border backdrop-blur-xl ${
                        activeRaceId === race.id ? 'bg-white/15 border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'bg-black/30 border-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-[9px] font-black text-white/50 flex items-center justify-between mb-1 uppercase tracking-widest">
                        <span>Rnd {race.round}</span>
                        {race.isSprint && <span className="bg-white/10 text-white/80 border border-white/20 px-1 rounded">Sprint</span>}
                      </div>
                      <div className="text-sm font-black text-white whitespace-nowrap overflow-hidden text-ellipsis">{race.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Completed Races Horizon */}
              {completedRaces.length > 0 && (
                <div>
                  <h3 className="text-xs text-white/40 font-black uppercase tracking-widest mb-3">Locked / Completed History</h3>
                  <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-thin scrollbar-thumb-white/20">
                    {completedRaces.map(race => (
                      <button 
                        key={race.id} onClick={() => setActiveRaceId(race.id)}
                        className={`min-w-[160px] p-3 rounded-xl snap-start text-left transition-all border backdrop-blur-xl ${
                          activeRaceId === race.id ? 'bg-white/10 border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'bg-black/50 border-transparent hover:bg-white/5 opacity-70'
                        }`}
                      >
                        <div className="text-[9px] font-black text-white/40 flex items-center justify-between mb-1 uppercase tracking-widest">
                          <span>Rnd {race.round}</span>
                          <span className="text-white/60 bg-black/40 px-1 rounded">Locked</span>
                        </div>
                        <div className="text-sm font-bold whitespace-nowrap overflow-hidden text-ellipsis text-white/70">{race.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Active Race Editor */}
              {activeRace && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl animate-fade-in relative">
                  <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                    <div>
                      <h3 className={`text-2xl font-black drop-shadow-md text-white`}>
                        {activeRace.name}
                      </h3>
                      <p className="text-white/60 text-xs mt-1 uppercase font-bold tracking-widest">
                        {activeRace.status === 'completed' ? 'This result is officially locked.' : 'Assign finishing positions to update predictions.'}
                      </p>
                    </div>
                  </div>

                  {/* MODAL DRIVER SELECTOR OVERLAY */}
                  {editingPosition && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-md rounded-2xl" onClick={() => setEditingPosition(null)} />
                      <div className="relative bg-black/90 backdrop-blur-2xl border border-white/20 p-6 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] w-full max-w-2xl animate-slide-in">
                        <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
                          <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                            Select Driver for {editingPosition.session === 'sprintResults' ? `Sprint P${editingPosition.index + 1}` : `Race P${editingPosition.index + 1}`}
                          </h4>
                          <button onClick={() => setEditingPosition(null)} className="text-white/40 hover:text-white transition-colors">
                            <CloseIcon />
                          </button>
                        </div>
                        
                        {drivers.length === 0 ? (
                          <p className="text-white/50 text-sm p-4 text-center">No drivers available.</p>
                        ) : (
                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                            {drivers.map(driver => {
                              const teamCol = teamColors[driver.team] || '#fff';
                              const currentSelectedId = activeRace[editingPosition.session][editingPosition.index];
                              const isThisDriver = driver.id === currentSelectedId;
                              
                              return (
                                <div
                                  key={driver.id}
                                  onClick={() => handlePredictionChange(activeRace.id, editingPosition.session, editingPosition.index, driver.id)}
                                  className={`cursor-pointer p-2.5 rounded-xl border flex flex-col gap-1 transition-all ${
                                    isThisDriver ? 'bg-white/20 border-white/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]' : 'bg-white/5 border-white/10 hover:bg-white/10'
                                  }`}
                                >
                                  <div className="flex justify-between items-center">
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: teamCol, boxShadow: `0 0 6px ${teamCol}` }} />
                                    <span className="text-[10px] text-white/40 font-bold">{driver.number || '---'}</span>
                                  </div>
                                  <span className={`text-xs font-black uppercase ${isThisDriver ? 'text-white' : 'text-white/70'}`}>{driver.id}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className={`space-y-8 ${activeRace.status === 'completed' ? 'pointer-events-none opacity-80' : ''}`}>
                    {/* PODIUM GRID (P1-P3) */}
                    <div className="space-y-3">
                      <h3 className="text-[10px] font-black text-white/50 uppercase tracking-widest">Podium Finishers</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[0, 1, 2].map((idx) => {
                          const driverId = safeGp[idx];
                          const driverObj = drivers.find(d => d.id === driverId);
                          const teamCol = teamColors[driverObj?.team];
                          
                          return (
                            <div 
                              key={`gp-${idx}`} 
                              onClick={() => { if(activeRace.status !== 'completed') setEditingPosition({ session: 'gpResults', index: idx }) }}
                              className={`bg-black/30 p-5 rounded-xl border border-white/10 flex flex-col justify-between shadow-inner relative overflow-hidden transition-all ${activeRace.status !== 'completed' ? 'cursor-pointer hover:bg-white/10 hover:border-white/30 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]' : ''}`}
                            >
                              <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: teamCol || '#333' }} />
                              <div className="flex justify-between items-center mb-3">
                                <span className={`text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-1.5 opacity-90`}>
                                  <span className={`w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]`} /> P{idx + 1}
                                </span>
                                <span className="text-xs font-bold text-white/60">+{gpPoints[idx]}p</span>
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <span className={`font-black text-lg drop-shadow-md ${driverId ? 'text-white' : 'text-white/20'}`}>
                                  {driverId ? driverObj?.name.split(" ").slice(-1)[0] : 'Click to Set'}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* POINTS SCORERS (P4-P10) */}
                    <div className="space-y-3">
                      <h3 className="text-[10px] font-black text-white/50 uppercase tracking-widest">Points Scorers (P4 - P10)</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                        {[3, 4, 5, 6, 7, 8, 9].map((idx) => {
                          const driverId = safeGp[idx];
                          return (
                            <div 
                               key={`gp-${idx}`} 
                               onClick={() => { if(activeRace.status !== 'completed') setEditingPosition({ session: 'gpResults', index: idx }) }} 
                               className={`bg-black/30 p-3 rounded-xl border border-white/5 flex flex-col justify-between transition-colors group ${activeRace.status !== 'completed' ? 'cursor-pointer hover:bg-white/10 hover:border-white/20' : ''}`}
                            >
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-black text-white/40 uppercase">P{idx + 1}</span>
                                <span className="text-[10px] font-bold text-white/30">+{gpPoints[idx]}</span>
                              </div>
                              <span className={`font-black text-sm transition-colors ${driverId ? 'text-white group-hover:text-white' : 'text-white/20'}`}>
                                {driverId || '---'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* SPRINT SCORERS */}
                    {activeRace.isSprint && (
                      <div className="p-5 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 mt-4">
                        <h4 className="font-bold text-white text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-pulse" /> Sprint Top 8 (S1-S8)
                        </h4>
                        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                          {[0, 1, 2, 3, 4, 5, 6, 7].map(idx => {
                             const driverId = safeSprint[idx];
                             return (
                              <div 
                                 key={`sprint-${idx}`} 
                                 onClick={() => { if(activeRace.status !== 'completed') setEditingPosition({ session: 'sprintResults', index: idx }) }} 
                                 className={`bg-black/30 p-2.5 rounded-lg border border-white/5 text-center transition-colors ${activeRace.status !== 'completed' ? 'cursor-pointer hover:bg-white/10 hover:border-white/20' : ''}`}
                              >
                                <span className="text-[9px] font-black text-white/40 uppercase block mb-1">S{idx + 1}</span>
                                <span className={`font-black text-xs ${driverId ? 'text-white' : 'text-white/20'}`}>{driverId || '---'}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Lock/Unlock Button */}
                  <div className="pt-6 border-t border-white/10 mt-6 relative z-10">
                    {activeRace.status === 'upcoming' ? (
                      <button 
                        onClick={() => toggleRaceStatus(activeRace.id, 'completed')}
                        className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 font-black uppercase tracking-widest py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(255,255,255,0.05),inset_0_1px_1px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2 backdrop-blur-md"
                      >
                        <CheckIcon /> Commit as Official Result
                      </button>
                    ) : (
                      <button 
                        onClick={() => toggleRaceStatus(activeRace.id, 'upcoming')}
                        className="w-full bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 hover:border-white/30 font-black uppercase tracking-widest py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 backdrop-blur-md"
                      >
                        Unlock to Re-edit Predictions
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: Track Manager */}
          {activeTab === 'track_manager' && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl animate-fade-in">
              <div className="mb-6 border-b border-white/10 pb-4">
                <h3 className="text-2xl font-black text-white flex items-center gap-2 drop-shadow-md">
                  <SettingsIcon /> Calendar / Track Manager
                </h3>
                <p className="text-white/60 text-xs mt-1 uppercase font-bold tracking-widest">
                  Configure the racing season. Dismiss tracks to exclude them completely from analytics.
                </p>
              </div>

              <div className="space-y-2">
                {/* Headers */}
                <div className="grid grid-cols-12 gap-4 px-4 py-2 text-[10px] text-white/50 font-black uppercase tracking-widest border-b border-white/10">
                  <div className="col-span-2 text-center">Round</div>
                  <div className="col-span-3">Track Name</div>
                  <div className="col-span-2 text-center">Format</div>
                  <div className="col-span-2 text-center">Status</div>
                  <div className="col-span-2 text-center">In Season</div>
                  <div className="col-span-1"></div>
                </div>
                
                {tracks.map((t) => (
                  <div key={t.id} className={`grid grid-cols-12 gap-4 items-center px-4 py-3 bg-black/30 rounded-xl border border-white/5 transition-all ${t.isActive ? '' : 'opacity-40 grayscale'}`}>
                    <div className="col-span-2 text-center">
                      <input 
                        type="number" 
                        value={t.round} 
                        onChange={(e) => updateTrackConfig(t.id, 'round', Number(e.target.value))}
                        className="w-12 bg-black/50 border border-white/10 rounded px-2 py-1 text-center text-sm font-mono text-white outline-none focus:border-white/30"
                      />
                    </div>
                    <div className="col-span-3">
                      <div className="font-bold text-sm text-white">{t.name}</div>
                      <div className="text-[10px] text-white/50 uppercase font-black">{t.date}</div>
                    </div>
                    <div className="col-span-2 text-center flex flex-col items-center justify-center gap-1">
                      <button 
                        onClick={() => {
                          if (t.status === 'completed') return alert('Unlock this race first to change its format to prevent math errors.');
                          updateTrackConfig(t.id, 'isSprint', !t.isSprint);
                        }}
                        className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors ${t.isSprint ? 'bg-white/80' : 'bg-white/20'}`}
                      >
                        <span className={`inline-block h-2 w-2 transform rounded-full ${t.isSprint ? 'bg-black' : 'bg-white/50'} transition-transform ${t.isSprint ? 'translate-x-4' : 'translate-x-1'}`} />
                      </button>
                      <span className="text-[8px] font-bold text-white/50 uppercase tracking-widest">{t.isSprint ? 'Sprint' : 'Std'}</span>
                    </div>
                    <div className="col-span-2 text-center flex justify-center">
                       <span className={`text-[9px] px-2 py-1 rounded font-black uppercase tracking-widest ${t.status === 'completed' ? 'bg-white/10 text-white/80 border border-white/20' : 'bg-white/5 text-white/50 border border-white/10'}`}>
                         {t.status}
                       </span>
                    </div>
                    <div className="col-span-2 text-center flex justify-center">
                      <button 
                        onClick={() => {
                          if (t.status === 'completed') return alert('Unlock this race first to dismiss it from the season.');
                          updateTrackConfig(t.id, 'isActive', !t.isActive);
                        }}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${t.isActive ? 'bg-white/80' : 'bg-white/20'}`}
                      >
                        <span className={`inline-block h-3 w-3 transform rounded-full ${t.isActive ? 'bg-black' : 'bg-white/50'} transition-transform ${t.isActive ? 'translate-x-5' : 'translate-x-1'}`} />
                      </button>
                    </div>
                    <div className="col-span-1 text-right text-[10px] font-black text-white/30 uppercase tracking-widest">
                      {t.id}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: Scenarios */}
          {activeTab === 'scenarios' && (
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2"><SparklesIcon /> Dynamic Solver</h3>
                <p className="text-sm text-white/60 mb-4">Auto-fill all active remaining upcoming races based on targeted scenarios.</p>
                <div className="mb-4">
                  <label className="block text-xs font-bold text-white/50 uppercase mb-2">Target Driver</label>
                  <select 
                    value={solverTarget} onChange={e => setSolverTarget(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-white/30 font-bold"
                  >
                    <option value="" className="bg-[#0a0a0a]">Select Target Driver...</option>
                    {drivers.map(d => <option key={d.id} value={d.id} className="bg-[#0a0a0a]">{d.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button onClick={() => runSolver('Clean Sweep')} className="py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold text-xs transition-all text-center text-white">🧹 Clean Sweep<br/><span className="text-[10px] text-white/50 font-normal">P1 Every Session</span></button>
                  <button onClick={() => runSolver('Tight Squeeze')} className="py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold text-xs transition-all text-center text-white">🤏 Tight Squeeze<br/><span className="text-[10px] text-white/50 font-normal">P1 vs Top Rivals P2</span></button>
                  <button onClick={() => runSolver('Midfield Chaos')} className="py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold text-xs transition-all text-center text-white">🌪 Midfield Chaos<br/><span className="text-[10px] text-white/50 font-normal">Rivals DNF</span></button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Analytics */}
          {activeTab === 'analytics' && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white"><SparklesIcon /> Championship Deficit Analytics</h3>
              
              {uncompletedRaces.length > 0 ? (() => {
                const leader = liveStandings[0];
                const p2 = liveStandings[1];
                if (!p2) return <p className="text-white/60">Data insufficient. Import driver database.</p>;
                
                const deficit = leader.currentPoints - p2.currentPoints;
                const reqPerRace = deficit > 0 ? (deficit / uncompletedRaces.length).toFixed(2) : 0;
                
                let maxPointsAvailable = 0;
                uncompletedRaces.forEach(r => { maxPointsAvailable += 25; if (r.isSprint) maxPointsAvailable += 8; });
                const isDecided = deficit > maxPointsAvailable;

                return (
                  <div className="space-y-6">
                    
                    {/* Primary Analytics (P2 vs P1) */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-black/30 p-4 rounded-xl border border-white/5 text-center">
                        <div className="text-[10px] text-white/50 font-black uppercase tracking-widest mb-1">Remaining Rounds</div>
                        <div className="text-3xl font-mono font-bold text-white">{uncompletedRaces.length}</div>
                      </div>
                      <div className="bg-black/30 p-4 rounded-xl border border-white/5 text-center">
                        <div className="text-[10px] text-white/50 font-black uppercase tracking-widest mb-1">P2 Deficit</div>
                        <div className="text-3xl font-mono font-bold text-white/90">{deficit}</div>
                      </div>
                      <div className="bg-black/30 p-4 rounded-xl border border-white/5 text-center">
                        <div className="text-[10px] text-white/50 font-black uppercase tracking-widest mb-1">Req. Gain / Round</div>
                        <div className="text-3xl font-mono font-bold text-white">{reqPerRace}</div>
                      </div>
                    </div>
                    
                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                      {isDecided ? (
                        <p className="text-lg font-bold text-white">The Championship has been mathematically decided!</p>
                      ) : deficit === 0 ? (
                        <p className="text-lg text-white/80">The championship is tied! Every position counts in the remaining <strong className="text-white">{uncompletedRaces.length}</strong> active races.</p>
                      ) : (
                        <p className="text-lg text-white/80 leading-relaxed">
                          For <strong className="text-white" style={{ color: teamColors[p2.team] }}>{p2.name}</strong> to surpass <strong className="text-white" style={{ color: teamColors[leader.team] }}>{leader.name}</strong>, they must outscore them by an exact average of <strong className="text-white text-2xl mx-1 font-mono">{reqPerRace}</strong> points in each of the remaining {uncompletedRaces.length} race weekends.
                        </p>
                      )}
                    </div>

                    {/* Secondary Analytics: Analyze Other Contenders */}
                    {eligibleContenders.length > 0 && (
                      <div className="mt-8 pt-8 border-t border-white/10">
                        <h4 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
                          Analyze Other Contenders
                        </h4>
                        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                          <span className="text-white/60 text-sm font-bold uppercase tracking-widest">Compare Leader vs:</span>
                          <select 
                            value={analyticsTargetId} 
                            onChange={(e) => setAnalyticsTargetId(e.target.value)}
                            className="bg-black/40 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-white/30 w-full md:w-auto flex-1 font-bold"
                          >
                            <option value="" className="bg-[#0a0a0a]">Select a mathematically eligible driver...</option>
                            {eligibleContenders.map(d => (
                              <option key={d.id} value={d.id} className="bg-[#0a0a0a]">{d.name} ({d.currentPoints} pts)</option>
                            ))}
                          </select>
                        </div>
                        
                        {analyticsTargetId && (() => {
                           const target = liveStandings.find(d => d.id === analyticsTargetId);
                           if (!target) return null;
                           const targetDeficit = leader.currentPoints - target.currentPoints;
                           const targetReq = targetDeficit > 0 ? (targetDeficit / uncompletedRaces.length).toFixed(2) : 0;
                           
                           return (
                             <div className="p-6 bg-white/5 border border-white/10 rounded-xl animate-fade-in">
                               <p className="text-sm text-white/80 leading-relaxed">
                                 For <strong className="text-white" style={{ color: teamColors[target.team] }}>{target.name}</strong> to surpass <strong className="text-white" style={{ color: teamColors[leader.team] }}>{leader.name}</strong>, they must overcome a <strong className="text-white">{targetDeficit}</strong> point deficit. This requires outscoring the leader by an exact average of <strong className="text-white text-xl mx-1 font-mono">{targetReq}</strong> points in each of the remaining {uncompletedRaces.length} active races.
                               </p>
                             </div>
                           );
                        })()}
                      </div>
                    )}
                  </div>
                )
              })() : (
                <p className="text-white/50 text-lg py-8 text-center">All active season rounds have been marked completed. The championship is finalized.</p>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}