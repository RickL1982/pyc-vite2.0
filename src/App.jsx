import { useState, useEffect, useMemo, useRef } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged, setPersistence, inMemoryPersistence } from 'firebase/auth';
import { db, auth } from './firebase.js';
import {
  Calendar, ShieldCheck, Star, Menu, X, PlusCircle, LogOut, LayoutGrid,
  ThumbsUp, Download, Heart, Send, Search, Check, Loader2, AlertTriangle,
  Settings, Wifi, WifiOff, Users, Printer, BookOpen, Contact,
  CalendarDays, CreditCard, Clock, Pencil, Save, ImageIcon, UploadCloud,
  Wand2, GripHorizontal, FileSpreadsheet, MapPin, MessageCircle, UserCheck, Info,
  RefreshCw, Camera,
  Sun, Moon, User, Phone
} from './Icons.jsx';
import {
  APP_ID, INITIAL_SERVERS, ZONES_DEFINITION, SERVICE_SLOTS,
  EVAC_SOURCES, EVAC_DESTINATIONS, BIBLE_VERSES
} from './constants.js';

const generatePDF = () => { window.print(); };

const SLOT_STYLES = {
    '7:30': { border: 'border-blue-500', bg: 'bg-[#2F3349]', badge: 'bg-blue-500/20 text-blue-400', cardBg: 'bg-white', cardText: 'text-[#212435]' },
    '9:30': { border: 'border-indigo-400', bg: 'bg-[#2F3349]', badge: 'bg-indigo-500/20 text-indigo-400', cardBg: 'bg-white', cardText: 'text-[#212435]' },
    '11:30': { border: 'border-purple-400', bg: 'bg-[#2F3349]', badge: 'bg-purple-500/20 text-purple-400', cardBg: 'bg-white', cardText: 'text-[#212435]' },
    '1:30': { border: 'border-emerald-400', bg: 'bg-[#2F3349]', badge: 'bg-emerald-500/20 text-emerald-400', cardBg: 'bg-white', cardText: 'text-[#212435]' },
    '3:30': { border: 'border-amber-400', bg: 'bg-[#2F3349]', badge: 'bg-amber-500/20 text-amber-400', cardBg: 'bg-white', cardText: 'text-[#212435]' },
    '5:30': { border: 'border-rose-400', bg: 'bg-[#2F3349]', badge: 'bg-rose-500/20 text-rose-400', cardBg: 'bg-white', cardText: 'text-[#212435]' },
};

        export default function MainApp() {
            const [user, setUser] = useState(null);
            const [currentServerId, setCurrentServerId] = useState(() => {
                try { return parseInt(localStorage.getItem('sop_v28_id')) || null; } catch (e) { return null; }
            });

            const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
            const [activeTab, setActiveTab] = useState('directory');
            const [isLoading, setIsLoading] = useState(true);
            const [searchTerm, setSearchTerm] = useState(''); // Para el buscador del directorio
            const [loginInput, setLoginInput] = useState(''); // Específico para el ingreso

            const [extraServers, setExtraServers] = useState([]);
            const [zoneSupervisors, setZoneSupervisors] = useState({ Z1: '', Z2: '', Z3: '' });
            const [zoneSupports, setZoneSupports] = useState({ Z1: '', Z2: '', Z3: '' });
            const [distribution, setDistribution] = useState({});
            const [serverProfiles, setServerProfiles] = useState({});
            const [attendingList, setAttendingList] = useState([]);

            const [alertMsg, setAlertMsg] = useState("");
            const [confirmDialog, setConfirmDialog] = useState(null);
            const [showThanksModal, setShowThanksModal] = useState(false);
            const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
            const [isAutoScheduling, setIsAutoScheduling] = useState(false);
            const [isManualInversion, setIsManualInversion] = useState(false);
            const [theme, setTheme] = useState(() => localStorage.getItem('pyc-theme') || 'dark');
            const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

            useEffect(() => {
                localStorage.setItem('pyc-theme', theme);
                if (theme === 'light') {
                    document.body.classList.add('light-mode');
                } else {
                    document.body.classList.remove('light-mode');
                }
            }, [theme]);

            const [selectedProfileId, setSelectedProfileId] = useState(null);
            const [isEditingProfile, setIsEditingProfile] = useState(false);
            const [profileForm, setProfileForm] = useState({});
            const [newServerForm, setNewServerForm] = useState({ name: '', phone: '', group: '3A', gender: 'F', doc: '', birthday: '', serviceStartDate: '', photoUrl: '', isSubstitute: false, substitutingId: '' });
            const [randomVerse, setRandomVerse] = useState("");

            const [invertRotation, setInvertRotation] = useState(false);
            const [globalActiveDate, setGlobalActiveDate] = useState(() => new Date().toISOString().split('T')[0]);

            const isScheduler = currentServerId === 100 || currentServerId === 103;

            const selectedMonth = parseInt(selectedDate.split('-')[1], 10);
            const isOddMonth = selectedMonth % 2 !== 0;
            let grupoMadrugador = isOddMonth ? '3A' : '3B';
            let grupoTardio = isOddMonth ? '3B' : '3A';

            if (invertRotation || isManualInversion) {
                grupoMadrugador = isOddMonth ? '3B' : '3A';
                grupoTardio = isOddMonth ? '3A' : '3B';
            }

            useEffect(() => {
                const initAuth = async () => {
                    try {
                        await setPersistence(auth, inMemoryPersistence);
                        await signInAnonymously(auth);
                    } catch (e) {
                        console.error("Auth Fail", e);
                        setIsLoading(false);
                    }
                };

initAuth();
                const unsub = onAuthStateChanged(auth, (u) => {
                    setUser(u);
                    if (!u) setIsLoading(false);
                });
                return () => unsub();
            }, [auth, setPersistence, inMemoryPersistence, signInAnonymously, onAuthStateChanged]);

            useEffect(() => {
                if (!user) return;
                const configRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'config', 'global');
                const unsub = onSnapshot(configRef, (snap) => {
                    if (snap.exists()) {
                        const d = snap.data();
                        setExtraServers(d.extraServers || []);
                        setZoneSupervisors(d.zoneSupervisors || { Z1: '', Z2: '', Z3: '' });
                        setZoneSupports(d.zoneSupports || { Z1: '', Z2: '', Z3: '' });
                        setServerProfiles(d.serverProfiles || {});
                        setInvertRotation(d.invertRotation || false);
                        if (d.globalActiveDate) setGlobalActiveDate(d.globalActiveDate);
                    }
                    setIsLoading(false);
                }, (err) => console.error(err));
                return () => unsub();
            }, [user, db, doc, onSnapshot]);

            useEffect(() => {
                if (globalActiveDate && !isScheduler) {
                    setSelectedDate(globalActiveDate);
                }
            }, [globalActiveDate, isScheduler]);

            useEffect(() => {
                if (!user || !selectedDate) return;
                const schedRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'schedules', selectedDate);
                const unsub = onSnapshot(schedRef, (snap) => {
                    if (snap.exists()) {
                        setDistribution(snap.data().grid || {});
                        setAttendingList(snap.data().attending || []);
                    } else {
                        setDistribution({});
                        setAttendingList([]);
                    }
                }, (err) => console.error(err));
                return () => unsub();
            }, [user, selectedDate, db, doc, onSnapshot]);

            const allServers = useMemo(() => {
                const combined = [...INITIAL_SERVERS, ...extraServers].map(s => {
                    const customProfile = serverProfiles[s.id] || {};
                    return { ...s, ...customProfile };
                });
                return combined.sort((a, b) => a.name.localeCompare(b.name));
            }, [extraServers, serverProfiles]);

            const currentUserData = useMemo(() => {
                if (!currentServerId) return null;
                return allServers.find(s => s.id === currentServerId) || null;
            }, [allServers, currentServerId]);

            const directoryFiltered = useMemo(() => {
                const s = searchTerm.trim().toUpperCase();
                if (!s) return allServers;
                return allServers.filter(srv => srv.name.toUpperCase().includes(s) || (srv.doc && srv.doc.includes(s)));
            }, [allServers, searchTerm]);

            const getMyAssignments = () => {
                if (!distribution || !currentServerId) return [];
                const list = [];
                try {
                    Object.entries(distribution).forEach(([zId, zGrid]) => {
                        Object.entries(zGrid || {}).forEach(([pId, pGrid]) => {
                            Object.entries(pGrid || {}).forEach(([slot, srvId]) => {
                                if (srvId === currentServerId) {
                                    const zone = ZONES_DEFINITION.find(z => z.id === zId);
                                    const point = zone?.points.find(p => p.id === pId);
                                    const supId = zoneSupervisors[zId];
                                    const supName = allServers.find(s => s.id.toString() === supId?.toString())?.name || "Sin Supervisor";
                                    list.push({ slot, zoneName: zone?.name || "", pointLabel: point?.label || "", zoneId: zId, pointId: pId, supervisor: supName });
                                }
                            });
                        });
                    });
                } catch (e) { }

return list.sort((a, b) => SERVICE_SLOTS.indexOf(a.slot) - SERVICE_SLOTS.indexOf(b.slot));
            };

            const calculateYearsInService = (dateString) => {
                if (!dateString) return '0.0';
                const start = new Date(dateString);
                if (isNaN(start.getTime())) return 'N/A';
                const diffMs = new Date() - start;
                return (diffMs / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1);
            };

            const getSupervisorName = (zId) => allServers.find(s => s.id.toString() === zoneSupervisors[zId]?.toString())?.name || "PENDIENTE";
            const getApoyoName = (zId) => allServers.find(s => s.id.toString() === zoneSupports[zId]?.toString())?.name || "PENDIENTE";

            const renderZoneMonitor = (z, i = 0) => (
                <div key={z.id} className={`glass-panel-heavy rounded-[2rem] overflow-hidden print-break-inside-avoid ${i > 0 ? 'print-mt-8' : ''}`}>
                    <div className="bg-black/30 backdrop-blur-md p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b-[6px] border-blue-600">
                        <div>
                            <h2 className="text-3xl font-black text-white uppercase italic tracking-wider">{z.name}</h2>
                            <div className="flex flex-wrap gap-4 mt-5">
                                <div className="bg-white/10 border border-white/10 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-sm transition-all hover:bg-white/20">
                                    {ShieldCheck && <ShieldCheck size={20} className="text-blue-400" />}
                                    <div className="leading-tight">                                        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Supervisor Zona</p>
                                        <p 
                                            className="text-sm font-black text-white uppercase italic cursor-pointer hover:text-blue-400 transition-colors"
                                            onClick={() => { const s = allServers.find(srv => srv.id == zoneSupervisors[z.id]); if (s) { setProfileForm({...s}); setSelectedProfileId(s.id); } }}
                                        >
                                            {getSupervisorName(z.id)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 bg-white/10 p-4 rounded-3xl border border-white/10 shadow-sm transition-all hover:bg-white/20">
                                    {Users && <Users size={20} className="text-purple-400" />}
                                    <div className="leading-tight">
                                        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Apoyo Zona</p>
                                        <p 
                                            className="text-sm font-black text-white uppercase italic cursor-pointer hover:text-purple-400 transition-colors"
                                            onClick={() => { const s = allServers.find(srv => srv.id == zoneSupports[z.id]); if (s) { setProfileForm({...s}); setSelectedProfileId(s.id); } }}
                                        >
                                            {getApoyoName(z.id)}
                                        </p>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="glass-panel px-10 py-5 rounded-[2.5rem] text-white font-black text-2xl italic tracking-widest shadow-xl">
                            {selectedDate}
                        </div>
                    </div>

                    <div className="flex overflow-x-auto pb-8 pt-4 gap-4 md:gap-6 custom-scrollbar px-4 md:px-8 snap-x whitespace-nowrap w-full">
                        {SERVICE_SLOTS.map(slot => {
                            const slotStyle = SLOT_STYLES[slot] || SLOT_STYLES['7:30'];
                            return (
                            <div key={slot} className="w-[260px] md:w-[300px] flex-none flex flex-col gap-4 snap-center whitespace-normal">
                                <div className="flex items-center justify-between mb-3 px-2">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${slotStyle.bg.replace('/5', '')} shadow-sm border border-black/5`}></div>
                                        <span className="text-lg font-black text-slate-400 dark:text-slate-500 tracking-tight uppercase">{slot}</span>
                                    </div>
                                    <span className="text-[11px] font-bold px-3 py-1 bg-slate-100 dark:bg-[#353A50] text-slate-500 dark:text-slate-300 rounded-full shadow-sm">
                                        {z.points.length}
                                    </span>
                                </div>

                                <div className="bg-white/60 dark:bg-[#2B2F42]/60 rounded-[2rem] p-4 flex flex-col gap-4 min-h-[500px] border border-slate-200/50 dark:border-white/5 shadow-[inset_0_4px_20px_rgba(0,0,0,0.02)]">
                                    {z.points.map(p => {
                                        const srvId = distribution?.[z.id]?.[p.id]?.[slot];
                                        const srv = srvId ? allServers.find(s => s.id === srvId) : null;
                                        const isEvac = p.label?.toUpperCase().includes('EVAC') || ['Z2_16', 'Z2_17', 'Z2_18', 'Z2_19'].includes(p.id);

                                        let availableServers = [];
                                        if (isScheduler && !srv && !isGeneratingPdf) {
                                            availableServers = attendingList.filter(id => {
                                                const s = allServers.find(srv => srv.id === id);
                                                if (!s || s.isSupervisor || s.id === 100 || s.id === 103) return false;
                                                
                                                let isAssigned = false;
                                                Object.values(distribution).forEach(zGrid => {
                                                    Object.values(zGrid || {}).forEach(pGrid => {
                                                        if (pGrid?.[slot] === id) isAssigned = true;
                                                    });
                                                });
                                                return !isAssigned;
                                            }).map(id => allServers.find(s => s.id === id)).sort((a, b) => a.name.localeCompare(b.name));
                                        }
                                        return (
                                            <div 
                                                key={p.id} 
                                                className="relative group w-full"
                                                onDragOver={(e) => { if (isScheduler) { e.preventDefault(); e.stopPropagation(); } }}
                                                onDragEnter={(e) => { if (isScheduler) { e.preventDefault(); e.stopPropagation(); } }}
                                                onDrop={(e) => { if (isScheduler) { e.preventDefault(); e.stopPropagation(); handleDrop(e, z.id, p.id, slot); } }}
                                            >
                                                {srv ? (
                                                    <div 
                                                        draggable={isScheduler && !isGeneratingPdf}
                                                        onDragStart={(e) => isScheduler && handleDragStart(e, srv.id, z.id, p.id, slot)}
                                                        onDragEnd={handleDragEnd}
                                                        className={`rounded-[1.5rem] bg-white dark:bg-[#353A50] flex flex-col overflow-hidden shadow-sm hover:shadow-md cursor-pointer transition-all border ${isEvac ? 'border-[#FF7A59] shadow-[#FF7A59]/20' : 'border-slate-200 dark:border-white/5'}`}
                                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setProfileForm({...srv}); setSelectedProfileId(srv.id); }}
                                                    >
                                                        {/* Top Image/Gradient Section */}
                                                        <div className={`h-[60px] w-full relative ${isEvac ? 'bg-[#FF7A59]' : 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-[#212435] dark:to-[#2B2F42]'}`}>
                                                            {/* Position Label */}
                                                            <div className="absolute top-3 left-3 flex items-center gap-1.5 max-w-[85%]">
                                                                {isEvac ? <AlertTriangle size={12} className="text-white flex-shrink-0" /> : <ShieldCheck size={12} className="text-blue-500/70 dark:text-blue-400 flex-shrink-0" />}
                                                                <span className={`text-[12px] font-black uppercase truncate drop-shadow-sm ${isEvac ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`}>{p.label}</span>
                                                            </div>
                                                            {/* Remove Button */}
                                                            {isScheduler && !isGeneratingPdf && (
                                                                <button 
                                                                    onClick={(e) => handleRemoveFromSlot(e, z.id, p.id, slot)}
                                                                    className={`absolute top-2 right-2 p-1 rounded-lg transition-all z-20 ${isEvac ? 'text-white/70 hover:text-white hover:bg-black/20' : 'text-slate-400 hover:text-slate-700 hover:bg-black/5 dark:hover:text-white dark:hover:bg-white/10'}`}
                                                                >
                                                                    {X && <X size={14} strokeWidth={3} />}
                                                                </button>
                                                            )}
                                                            {/* Avatar overlapping border */}
                                                            <div className="absolute -bottom-4 left-4 z-10">
                                                                {srv.photoUrl ? (
                                                                    <img src={srv.photoUrl} alt={srv.name} draggable={false} className="w-10 h-10 rounded-full object-cover border-[3px] border-white dark:border-[#353A50] shadow-sm pointer-events-none bg-slate-100" />
                                                                ) : (
                                                                    <div className={`w-10 h-10 rounded-full border-[3px] border-white dark:border-[#353A50] shadow-sm flex items-center justify-center text-[14px] font-black ${isEvac ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                                                        {srv.name.charAt(0)}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Bottom Info Section */}
                                                        <div className="pt-6 pb-3 px-4 flex flex-col gap-0.5 relative">
                                                            <p className="text-[13px] font-bold text-slate-800 dark:text-white leading-tight">{srv.name}</p>
                                                            <p className="text-[11px] font-medium text-slate-500">{srv.group.replace('3', '')} • {srv.phone || 'S/T'}</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className={`rounded-[1.5rem] p-4 flex flex-col gap-3 border-2 border-dashed transition-all ${isEvac ? 'border-red-300 bg-red-50/50 dark:border-red-900/50 dark:bg-red-900/10' : 'border-slate-200 bg-white/40 dark:border-white/10 dark:bg-[#353A50]/40 hover:bg-white dark:hover:bg-[#353A50]'}`}>
                                                        <div className="flex items-center gap-2 max-w-full overflow-hidden">
                                                            {isEvac ? <AlertTriangle size={14} className="text-red-500 flex-shrink-0" /> : <ShieldCheck size={14} className="text-slate-400 flex-shrink-0" />}
                                                            <span className={`text-[12px] font-black uppercase truncate ${isEvac ? 'text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-300'}`}>{p.label}</span>
                                                        </div>
                                                        
                                                        {isScheduler && !isGeneratingPdf ? (
                                                            <div className="relative w-full overflow-hidden rounded-xl bg-white dark:bg-[#2B2F42] border border-slate-200 dark:border-white/10 shadow-sm">
                                                                <select
                                                                    value=""
                                                                    disabled={availableServers.length === 0}
                                                                    onChange={(e) => handleAssignFromDropdown(e.target.value, z.id, p.id, slot)}
                                                                    className="w-full p-2.5 pl-3 pr-8 rounded-xl text-[10px] font-black uppercase outline-none cursor-pointer bg-transparent text-slate-700 dark:text-slate-200 appearance-none text-left box-border"
                                                                >
                                                                    <option value="" disabled>{availableServers.length === 0 ? 'OCUPADO' : '+ ASIGNAR'}</option>
                                                                    {availableServers.map(asrv => (
                                                                        <option key={asrv.id} value={asrv.id}>{asrv.name}</option>
                                                                    ))}
                                                                </select>
                                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 text-slate-500 dark:text-white">
                                                                    {PlusCircle && <PlusCircle size={14} />}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="p-2 border border-dashed border-slate-200 dark:border-white/10 rounded-xl flex items-center justify-center opacity-50">
                                                                <span className="text-[10px] font-bold text-slate-400 uppercase">Libre</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )})}
                        <div className="flex-none w-6 md:w-12" aria-hidden="true"></div>
                    </div>
                </div>
            );

            const assignedRoles = useMemo(() => {
                const roles = new Set();
                Object.values(zoneSupervisors).forEach(id => { if (id) roles.add(id.toString()); });
                Object.values(zoneSupports).forEach(id => { if (id) roles.add(id.toString()); });
                return roles;
            }, [zoneSupervisors, zoneSupports]);

            const hasSixMonths = (dateStr) => {
                if (!dateStr) return false;
                const d = new Date(dateStr);
                if (isNaN(d.getTime())) return false;
                const sixAgo = new Date(); sixAgo.setMonth(sixAgo.getMonth() - 6);
                return d <= sixAgo;
            };

            const getAssignmentWarning = (srv, point, toSlot) => {
                if (!point || !srv) return "";
                let warnings = [];
                if (point.genderReq && srv.gender !== point.genderReq) {
                    warnings.push(`Este punto requiere ser cubierto por ${point.genderReq === 'F' ? 'una MUJER' : 'un HOMBRE'}`);
                }
                const restrictedForNewbies = ['Z1_1', 'Z1_4', 'Z1_5', 'Z1_10'];
                if (restrictedForNewbies.includes(point.id) && !hasSixMonths(srv.serviceStartDate)) {
                    warnings.push(`Este punto es crítico y requiere más de 6 meses de experiencia`);
                }
                if (point.exclusiveTo && srv.id !== point.exclusiveTo) {
                    warnings.push(`Este punto es exclusivo para un rol en específico`);
                }

                let shiftCount = 0;
                let hasThisPosition = false;
                let hasZ1 = false;
                const isStickySPK = ['Z2_6_1', 'Z2_6_2', 'Z2_6_3', 'Z2_7'].includes(point.id);

                try {
                    Object.entries(distribution).forEach(([zId, zGrid]) => {
                        Object.entries(zGrid || {}).forEach(([pId, pGrid]) => {
                            Object.entries(pGrid || {}).forEach(([slot, srvId]) => {
                                if (srvId === srv.id && slot !== toSlot) {
                                    shiftCount++;
                                    if (pId === point.id) hasThisPosition = true;
                                    if (zId === 'Z1') hasZ1 = true;
                                }
                            });
                        });
                    });

                    if (shiftCount >= 3) {
                        warnings.push(`El servidor quedaría con ${shiftCount + 1} servicios asignados (máximo sugerido: 3)`);
                    }
                    if (hasThisPosition && !isStickySPK) {
                        warnings.push(`El servidor estaría repitiendo esta misma posición en la jornada`);
                    }
                    if (hasZ1 && point.id.startsWith('Z1_') && !hasThisPosition) {
                        warnings.push(`El servidor estaría repitiendo la Zona 1 (no permitido por reglas generales)`);
                    }
                } catch (e) {}

                return warnings.length > 0 ? `\n\n⚠️ REGLAS QUE SE ROMPERÍAN CON ESTE CAMBIO:\n• ${warnings.join('\n• ')}` : "";
            };

            const handleLogin = (e) => {
                if (e) e.preventDefault();
                const s = loginInput.trim().toUpperCase();
                if (!s) return;
                const found = allServers.find(srv => (srv.doc && srv.doc.toString().toUpperCase() === s) || srv.name.toUpperCase() === s);
                if (found) {
                    identify(found.id);
                } else {
                    setAlertMsg("Acceso denegado. El documento o nombre no coincide con nuestros registros.");
                }
            };

            const identify = (id) => {
                try { localStorage.setItem('sop_v28_id', id); } catch (e) { }
                setCurrentServerId(id);
                setLoginInput('');
                setSearchTerm('');
                const srv = allServers.find(s => s.id === id);
                if (srv?.id === 100 || srv?.id === 103) setActiveTab('coordination');
                else setActiveTab('agenda');
            };

            const logout = () => {
                try { localStorage.removeItem('sop_v28_id'); } catch (e) { }
                setCurrentServerId(null);
                setLoginInput('');
                setSearchTerm('');
                setActiveTab('directory');
            };

            const updateConfig = async (field, value) => {
                if (!user) return;
                const ref = doc(db, 'artifacts', APP_ID, 'public', 'data', 'config', 'global');
                await setDoc(ref, { [field]: value }, { merge: true });
            };

            const handleSaveProfileEdit = async () => {
                if (!selectedProfileId) return;
                const updatedProfiles = { ...serverProfiles, [selectedProfileId]: profileForm };
                await updateConfig('serverProfiles', updatedProfiles);
                setIsEditingProfile(false);
            };

            const handleDeleteServer = async (serverId) => {
                if (!window.confirm("¿Estás seguro de que deseas eliminar este servidor de la base de datos?")) return;
                const newList = extraServers.filter(s => s.id !== serverId);
                await updateConfig('extraServers', newList);
                setSelectedProfileId(null);
            };

            const processImageFile = (file, callback) => {
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = new Image();
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        const MAX_SIZE = 250;
                        let width = img.width;
                        let height = img.height;
                        if (width > height) {
                            if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; }
                        } else {
                            if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; }
                        }
                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, width, height);
                        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                        callback(dataUrl);
                    };
                    img.src = event.target.result;
                };
                reader.readAsDataURL(file);
            };

            const handleProfileImageUpload = (e) => {
                if (!e.target.files[0]) return;

processImageFile(e.target.files[0], (dataUrl) => {
                    setProfileForm(prev => ({ ...prev, photoUrl: dataUrl }));
                });
            };

            const handleNewServerImageUpload = (e) => {
                if (!e.target.files[0]) return;
                processImageFile(e.target.files[0], (dataUrl) => {
                    setNewServerForm(prev => ({ ...prev, photoUrl: dataUrl }));
                });
            };

            const toggleAttending = async (serverId) => {
                let newList = [...attendingList];
                if (newList.includes(serverId)) newList = newList.filter(id => id !== serverId);
                else newList.push(serverId);
                setAttendingList(newList);
                await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'schedules', selectedDate), { attending: newList }, { merge: true });
            };

            const toggleGroupAttending = async (group) => {
                const groupServers = allServers.filter(s => s.group === group && !s.isSupervisor && s.id !== 100 && s.id !== 103).map(s => s.id);
                const currentlyAttending = groupServers.filter(id => attendingList.includes(id));
                let newList = [...attendingList];
                if (currentlyAttending.length === groupServers.length && groupServers.length > 0) {
                    newList = newList.filter(id => !groupServers.includes(id));
                } else {
                    const toAdd = groupServers.filter(id => !newList.includes(id));
                    newList = [...newList, ...toAdd];
                }
                setAttendingList(newList);
                await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'schedules', selectedDate), { attending: newList }, { merge: true });
            };

            const handleSendWhatsApp = () => {
                const assignments = getMyAssignments();
                if (assignments.length === 0) return;
                let text = `*🌟 MI AGENDA DE SERVICIO - PROTECCIÓN Y CUIDADO*\n*Fecha:* ${selectedDate}\n\n`;
                assignments.forEach(a => {
                    text += `🔹 *${a.slot} AM* - ${a.pointLabel}\n📍 _${a.zoneName}_\n👤 _Supervisor: ${a.supervisor}_\n\n`;
                });
                text += `\n¡Listos para servir con excelencia! 🛡️`;
                const encodedText = encodeURIComponent(text);
                window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');
                setRandomVerse(BIBLE_VERSES[Math.floor(Math.random() * BIBLE_VERSES.length)]);
                setShowThanksModal(true);
            };

            const generateStrategicSchedule = async () => {
                setIsAutoScheduling(true);
                await new Promise(r => setTimeout(r, 800));

                const newGrid = {};
                ZONES_DEFINITION.forEach(z => {
                    newGrid[z.id] = {};
                    z.points.forEach(p => { 
                        newGrid[z.id][p.id] = {}; 
                        SERVICE_SLOTS.forEach(slot => {
                            newGrid[z.id][p.id][slot] = null;
                        });
                    });
                });

                const shiftCount = {};
                const slotsAssigned = {};
                const positionsAssigned = {};
                const zonesCount = {};

                attendingList.forEach(id => {
                    shiftCount[id] = 0;
                    slotsAssigned[id] = new Set();
                    positionsAssigned[id] = new Set();
                    zonesCount[id] = { Z1: 0, Z2: 0, Z3: 0 };
                });

                const isStickySPK = (pId) => ['Z2_6_1', 'Z2_6_2', 'Z2_6_3', 'Z2_7'].includes(pId);

                const getCandidates = (p, slot, zId, overrides = {}) => {
                    return attendingList.filter(id => {
                        const s = allServers.find(srv => srv.id === id);
                        if (!s || s.isSupervisor || s.id === 100 || s.id === 103) return false;
                        if (slotsAssigned[id].has(slot)) return false;
                        if (shiftCount[id] >= 3) return false;
                        
                        if (zId === 'Z1' && zonesCount[id]['Z1'] >= 1) return false;
                        if (!isStickySPK(p.id) && positionsAssigned[id].has(p.id)) return false;

                        if (p.exclusiveTo && s.id !== p.exclusiveTo) return false;
                        if (!p.exclusiveTo && s.id === 21 && p.id !== 'Z3_1') return false; 

                        const restrictedForNewbies = ['Z1_1', 'Z1_4', 'Z1_5', 'Z1_10'];
                        if (restrictedForNewbies.includes(p.id) && !hasSixMonths(s.serviceStartDate)) return false;

                        if (overrides.gender) {
                            if (s.gender !== overrides.gender) return false;
                        } else if (p.genderReq && s.gender !== p.genderReq) {
                            return false;
                        }

                        if (overrides.group) {
                            if (s.group !== overrides.group) return false;
                        }

                        let canWork = false;
                        if (s.group === grupoMadrugador && slot !== '1:30') canWork = true;
                        if (s.group === grupoTardio && slot !== '7:30') canWork = true;
                        if (!canWork) return false;

                        return true;
                    }).sort((a, b) => shiftCount[a] - shiftCount[b]);
                };

                const assign = (serverId, zId, pId, slot) => {
                    newGrid[zId][pId][slot] = serverId;
                    shiftCount[serverId]++;
                    slotsAssigned[serverId].add(slot);
                    positionsAssigned[serverId].add(pId);
                    zonesCount[serverId][zId]++;
                };

                const spkPoints = ['Z2_6_1', 'Z2_6_2', 'Z2_6_3'];
                spkPoints.forEach(pId => {
                    const candsA = getCandidates({id: pId}, '7:30', 'Z2', {gender: 'F', group: '3A'}).filter(id => !slotsAssigned[id].has('9:30'));
                    if (candsA.length > 0) {
                        assign(candsA[0], 'Z2', pId, '7:30');
                        assign(candsA[0], 'Z2', pId, '9:30');
                    }
                    const candsB = getCandidates({id: pId}, '11:30', 'Z2', {gender: 'F', group: '3B'}).filter(id => !slotsAssigned[id].has('1:30'));
                    if (candsB.length > 0) {
                        assign(candsB[0], 'Z2', pId, '11:30');
                        assign(candsB[0], 'Z2', pId, '1:30');
                    }
                });

                const candsRefB = getCandidates({id: 'Z2_7'}, '9:30', 'Z2', {gender: 'F', group: '3B'}).filter(id => !slotsAssigned[id].has('11:30'));
                if (candsRefB.length > 0) {
                    assign(candsRefB[0], 'Z2', 'Z2_7', '9:30');
                    assign(candsRefB[0], 'Z2', 'Z2_7', '11:30');
                }

                ZONES_DEFINITION.forEach(z => {
                    z.points.forEach(p => {
                        if (p.isSticky && !isStickySPK(p.id)) {
                            let requiredBlocks = [['7:30', '9:30'], ['11:30', '1:30']];
                            if (p.id === 'Z2_8') requiredBlocks = [['9:30', '11:30']];
                            requiredBlocks.forEach(block => {
                                const s1 = getCandidates(p, block[0], z.id);
                                const validCandidates = s1.filter(id => !slotsAssigned[id].has(block[1]));
                                if (validCandidates.length > 0) {
                                    assign(validCandidates[0], z.id, p.id, block[0]);
                                    assign(validCandidates[0], z.id, p.id, block[1]);
                                }
                            });
                        } else if (p.exclusiveTo) {
                            SERVICE_SLOTS.forEach(slot => {
                                const cands = getCandidates(p, slot, z.id);
                                if (cands.includes(p.exclusiveTo)) assign(p.exclusiveTo, z.id, p.id, slot);
                            });
                        }
                    });
                });

                const phases = [
                    (p, slot) => p.isCritical && !p.isSticky && !p.exclusiveTo,
                    (p, slot) => (slot === '9:30' || slot === '11:30') && p.isReinforcement && !p.isSticky && !p.exclusiveTo,
                    (p, slot) => !p.isCritical && !p.isReinforcement && !p.isSticky && !p.exclusiveTo,
                    (p, slot) => (slot === '7:30' || slot === '1:30') && p.isReinforcement && !p.isSticky && !p.exclusiveTo
                ];

                phases.forEach(condition => {
                    SERVICE_SLOTS.forEach(slot => {
                        ZONES_DEFINITION.forEach(z => {
                            z.points.forEach(p => {
                                if (p.label?.toUpperCase().includes('EVAC') || ['Z2_16', 'Z2_17', 'Z2_18', 'Z2_19'].includes(p.id)) return;
                                
                                if (p.id === 'Z3_2' && (slot === '7:30' || slot === '1:30')) return;

                                if (!isStickySPK(p.id) && condition(p, slot) && !newGrid[z.id][p.id][slot]) {
                                    const cands = getCandidates(p, slot, z.id);
                                    if (cands.length > 0) { assign(cands[0], z.id, p.id, slot); }
                                }
                            });
                        });
                    });
                });

                await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'schedules', selectedDate), { grid: newGrid }, { merge: true });
                setIsAutoScheduling(false);
            };

            const handleDragStart = (e, serverId, zId, pId, slot) => {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', JSON.stringify({ serverId, zId, pId, slot }));
                setTimeout(() => { e.target.style.opacity = '0.5'; }, 0);

};

            const handleDragEnd = (e) => { e.target.style.opacity = '1'; };

            const handleDrop = async (e, toZId, toPId, toSlot) => {
                e.preventDefault();
                try {
                    const rawData = e.dataTransfer.getData('text/plain');
                    if (!rawData) {
                        setAlertMsg("Error: El navegador no permitió leer los datos de arrastre. Intenta usar el menú desplegable (+ ASIGNAR).");
                        return;
                    }
                    const data = JSON.parse(rawData);
                    if (!data || !data.serverId) {
                        setAlertMsg("Error: La tarjeta no contenía la información correcta del servidor.");
                        return;
                    }
                    const { serverId: srcId, zId: srcZ, pId: srcP, slot: srcSlot } = data;
                    if (srcZ && srcP && srcZ === toZId && srcP === toPId && srcSlot === toSlot) return;

                    const srv = allServers.find(s => s.id === parseInt(srcId));
                    if (!srv) {
                        setAlertMsg("Error interno: No se pudo identificar al servidor arrastrado.");
                        return;
                    }
                    const targetPoint = ZONES_DEFINITION.find(z => z.id === toZId)?.points.find(p => p.id === toPId);
                    
                    if (!targetPoint) {
                        setAlertMsg("Error interno: No se reconoció el punto destino.");
                        return;
                    }

                    const warning = getAssignmentWarning(srv, targetPoint, toSlot);
                    const confirmMsg = `¿Realmente quieres mover a "${srv.name}" a "${targetPoint.label}" para las ${toSlot}?${warning}\n\n¿Deseas aplicar este cambio manual de todas formas?`;
                    
                    const executeDrop = async () => {
                        let newGrid = JSON.parse(JSON.stringify(distribution));
                        if (srcSlot !== toSlot || (!srcZ && !srcP)) {
                            let alreadyAssigned = false;
                            Object.entries(newGrid).forEach(([zId, zGrid]) => {
                                Object.entries(zGrid || {}).forEach(([pId, pGrid]) => {
                                    if (pGrid?.[toSlot] === srv.id) alreadyAssigned = true;
                                });
                            });
                            if (alreadyAssigned) {
                                setAlertMsg(`Este servidor ya está asignado a otro punto a las ${toSlot}.`);
                                return;
                            }
                        }

                        const targetOccupant = newGrid[toZId]?.[toPId]?.[toSlot];
                        if (srcZ && srcP) {
                            if (!newGrid[srcZ]) newGrid[srcZ] = {};
                            if (!newGrid[srcZ][srcP]) newGrid[srcZ][srcP] = {};
                            newGrid[srcZ][srcP][srcSlot] = targetOccupant || null;
                        }

                        if (!newGrid[toZId]) newGrid[toZId] = {};
                        if (!newGrid[toZId][toPId]) newGrid[toZId][toPId] = {};
                        newGrid[toZId][toPId][toSlot] = srv.id;

                        try {
                            await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'schedules', selectedDate), { grid: newGrid }, { merge: true });
                        } catch (err) {
                            setAlertMsg("Error de conexión al guardar el cambio.");
                        }
                    };

                    setConfirmDialog({
                        message: confirmMsg,
                        onConfirm: () => {
                            setConfirmDialog(null);
                            executeDrop();
                        }
                    });
                } catch (err) { 
                    console.error("Drop error", err); 
                    setAlertMsg("Error al mover la tarjeta. Asegúrate de soltarla correctamente.");
                }
            };

            const handleAssignFromDropdown = async (serverId, zId, pId, slot) => {
                if (!serverId) return;
                const srv = allServers.find(s => s.id === parseInt(serverId));
                const targetPoint = ZONES_DEFINITION.find(z => z.id === zId)?.points.find(p => p.id === pId);
                const warning = getAssignmentWarning(srv, targetPoint, slot);
                const confirmMsg = `¿Deseas asignar a "${srv.name}" a "${targetPoint.label}" para las ${slot}?${warning}\n\n¿Deseas aplicar este cambio manual de todas formas?`;
                
                setConfirmDialog({
                    message: confirmMsg,
                    onConfirm: async () => {
                        setConfirmDialog(null);
                        let newGrid = JSON.parse(JSON.stringify(distribution));
                        if (!newGrid[zId]) newGrid[zId] = {};
                        if (!newGrid[zId][pId]) newGrid[zId][pId] = {};
                        newGrid[zId][pId][slot] = srv.id;
                        try {
                            await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'schedules', selectedDate), { grid: newGrid }, { merge: true });
                        } catch(e) {
                            setAlertMsg("Error al guardar.");
                        }
                    }
                });
            };

            const handleRemoveFromSlot = async (e, zId, pId, slot) => {
                e.stopPropagation();
                let newGrid = JSON.parse(JSON.stringify(distribution));
                if (newGrid[zId] && newGrid[zId][pId]) {
                    newGrid[zId][pId][slot] = null;
                }
                await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'schedules', selectedDate), { grid: newGrid }, { merge: true });
            };

            if (!currentServerId) {
                return (
                    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
                        <video autoPlay loop muted playsInline className="fixed inset-0 w-full h-full object-cover -z-10">
                            <source src="/vid_login.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-black/20 -z-10"></div>
                        <div className="relative overflow-hidden rounded-3xl p-[1.5px]">
                            <div className="absolute inset-[-1000%] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#007BFF_50%,transparent_100%)] animate-[spin_4s_linear_infinite]" />
                            <div className="relative z-10 w-full h-full bg-white/10 backdrop-blur-2xl rounded-[inherit] flex flex-col items-center p-10 space-y-6">
                                <img src="/Icon_login.png" alt="Logo" className="h-32" />
                                <div className="text-center w-full space-y-1">
                                    <p className="text-xs font-black uppercase text-white tracking-widest">INGRESAR TU CÉDULA</p>
                                    <h1 className="text-2xl font-black text-white">Ingresa tu cédula para continuar</h1>
                                </div>
                                <form onSubmit={handleLogin} className="w-full space-y-4">
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white">
                                            <Contact size={20} />
                                        </div>
                                        <input type="text" placeholder="Cédula de identidad" autoComplete="off" autoCorrect="off" spellCheck="false" className="w-full pl-12 pr-4 py-4 bg-white/50 border border-white/30 rounded-xl outline-none font-bold text-sm text-white placeholder:text-white/60 backdrop-blur-sm focus:border-white focus:ring-2 focus:ring-white/20 transition-all" value={loginInput} onChange={(e) => setLoginInput(e.target.value)} />
                                    </div>
                                    <button type="submit" className="w-full py-4 bg-[#007BFF] text-white font-black rounded-xl uppercase text-sm shadow-lg hover:bg-[#0056cc] transition-all active:scale-95 flex items-center justify-center gap-2">
                                        <img src="/Icon_login.png" alt="" className="h-5" />
                                        CONTINUAR
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                );
            }

            if (isLoading || !currentUserData) {
                return (
                    <div className="min-h-screen flex flex-col items-center justify-center gap-8 text-white">
                        {Loader2 && <Loader2 className="animate-spin text-blue-500 drop-shadow-[0_0_15px_rgba(0,68,255,1)]" size={64} />}
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Sincronizando Sistema...</p>
                    </div>
                );
            }

            return (
                <div className="min-h-screen pb-24 font-sans antialiased text-white">
                    <div className="dashboard-bg" aria-hidden="true"></div>

                    <header className="no-print sticky top-0 z-[100] glass-panel rounded-b-3xl border-t-0 border-x-0 px-6 py-4 flex justify-between items-center shadow-lg mx-auto w-full">
                        <div className="flex items-center gap-4">
                            <img src="/Icon_login.png" alt="Logo" className="h-14" />
                            <div className="leading-none">
                                <span className="font-black text-[13px] uppercase tracking-tighter italic block">Protección y Cuidado</span>
                                <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mt-1 inline-block">{selectedDate}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex items-center justify-center p-2 rounded-xl bg-white/5 border border-white/10" title={user ? "Conectado" : "Buscando..."}>
                                {user ? (Wifi && <Wifi size={16} className="text-blue-400 drop-shadow-[0_0_5px_rgba(0,68,255,0.8)]" />) : (WifiOff && <WifiOff size={16} className="text-red-500 animate-pulse" />)}
                            </div>
                            <button 
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className="w-10 h-10 glass-panel rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-90 shadow-lg border-white/20"
                                title={theme === 'dark' ? "Modo Claro" : "Modo Oscuro"}
                            >
                                {theme === 'dark' ? (Sun && <Sun size={18} className="text-amber-400" />) : (Moon && <Moon size={18} className="text-blue-400" />)}
                            </button>
                            <button onClick={() => { setCurrentServerId(null); setSelectedProfileId(null); }} className="text-slate-400 hover:text-red-400 transition-all bg-white/5 p-2 rounded-xl border border-white/10" title="Cerrar Sesión">
                                {LogOut && <LogOut size={18} />}
                            </button>
                        </div>
                    </header>

                    <div className="no-print max-w-6xl mx-auto p-4 mt-2 relative">
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                            className="md:hidden absolute top-0 right-0 z-50 p-3 glass-panel rounded-xl"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                        <div className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row items-center gap-2 overflow-x-auto whitespace-nowrap custom-scrollbar px-2 w-full p-2 md:p-0 glass-panel rounded-[2rem] absolute md:static top-12 md:top-0 left-0 right-0 z-40 bg-[#090C11] md:bg-transparent`}>
                            {[
                                { id: 'agenda', label: 'Mi Agenda', icon: LayoutGrid },
                                ...(isScheduler ? [
                                    { id: 'coordination', label: 'Programador', icon: Wand2 },
                                    { id: 'consolidado', label: 'Consolidado', icon: LayoutGrid },
                                    { id: 'management', label: 'Gestión', icon: Settings }
                                ] : []),
                                { id: 'directory', label: 'Directorio', icon: Users }
                            ].map(tab => (
                                <button key={tab.id} onClick={() => { setActiveTab(tab.id); setIsMobileMenuOpen(false); }} className={`flex-1 min-w-[120px] py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all italic flex items-center justify-center gap-2 w-full md:w-auto ${activeTab === tab.id ? 'glass-button-primary' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                                    {tab.icon && <tab.icon size={16} />} <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <main className="max-w-[1400px] mx-auto px-5">

                        {activeTab === 'agenda' && (
                            <div className="max-w-5xl mx-auto space-y-12 pb-24 py-6 animate-in slide-in-from-bottom-6">
                                <div className="text-center space-y-2">
                                    <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white leading-none">Mi Agenda</h2>
                                    <p className="text-[11px] font-bold text-blue-400 uppercase tracking-widest italic leading-none">Asignaciones definidas por la Coordinación</p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    {SERVICE_SLOTS.filter(s => (currentUserData.group === grupoMadrugador && s !== '1:30') || (currentUserData.group === grupoTardio && s !== '7:30')).map(slot => {
                                        const ass = getMyAssignments().find(a => a.slot === slot);
                                        if (ass) {
                                            return (
                                                                                            <div key={slot} className="interactive-card p-4 md:p-6 rounded-[2rem] flex flex-col group relative overflow-hidden border glass-panel">
                                                    <div className="absolute top-0 right-0 p-4 opacity-10">{ShieldCheck && <ShieldCheck size={100} />}</div>
                                                    <div className="flex items-center gap-4 md:gap-6 relative z-10">
                                                        <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 text-white rounded-[1.4rem] flex items-center justify-center font-black text-sm italic shadow-lg glass-button-primary">{slot}</div>
                                                        <div>
                                                            <p className="font-black text-white text-[11px] md:text-[13px] uppercase italic break-words max-w-[150px] md:max-w-[200px] leading-tight">{ass.pointLabel}</p>
                                                            <p className="text-[9px] md:text-[10px] font-bold uppercase italic tracking-widest leading-none mt-1 text-blue-400">{ass.zoneName}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        } else {
                                            return (
                                                <div key={slot} className="w-full glass-panel p-8 md:p-10 rounded-[3rem] border-2 border-dashed border-white/20 flex items-center gap-6 md:gap-8 opacity-70">
                                                    <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 bg-white/5 border border-white/10 text-slate-500 rounded-[1.4rem] flex items-center justify-center font-black text-sm italic">{slot}</div>
                                                    <div className="text-left">
                                                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Banca de Disponibilidad</p>
                                                        <p className="font-bold text-slate-500 text-xs">Sin asignar, quédate pendiente.</p>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    })}
                                </div>
                                {getMyAssignments().length > 0 && (
                                    <div className="fixed bottom-10 right-6 z-[200]">
                                        <button onClick={handleSendWhatsApp} className="w-20 h-20 glass-button-primary text-white rounded-[2.5rem] shadow-[0_0_20px_rgba(0,68,255,0.6)] flex items-center justify-center border-b-[6px] border-[#002299] active:scale-90 transition-all">
                                            {Send && <Send size={32} className="ml-1" />}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'directory' && (
                            <div className="py-6 space-y-8 animate-in slide-in-from-bottom-6">
                                <div className="glass-panel p-6 rounded-[2rem] flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
                                    <div className="text-center md:text-left relative z-10">
                                        <h2 className="text-2xl font-black text-white uppercase italic leading-none">Directorio de Servidores</h2>
                                        <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest italic mt-1">Base de datos de Protección y Cuidado</p>
                                    </div>
                                    <div className="relative w-full md:w-96 z-10">
                                        {Search && <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />}
                                        <input type="text" placeholder="Buscar por nombre o documento..." className="glass-input w-full pl-12 pr-4 py-4 rounded-2xl font-bold uppercase text-xs" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-5">
    {currentServerId && directoryFiltered.map(srv => (
        <button key={srv.id} onClick={() => { setProfileForm({ ...srv }); setSelectedProfileId(srv.id); }} className="relative w-full max-w-[185px] mx-auto mb-5 text-left group cursor-pointer transition-transform duration-300 hover:-translate-y-2">
            
            {/* Composición Geométrica */}
            <div className="relative">
                
                {/* Bloque de Foto (Fondo oscuro tipo tarjeta Kanban #1E293B) */}
                <div className="w-full aspect-[4/5] bg-[#1E293B] rounded-bl-lg rounded-tl-lg rounded-br-lg rounded-tr-[40px] overflow-hidden shadow-[0_10px_20px_rgba(0,0,0,0.5)] border border-white/5">
                    {srv.photoUrl ? (
                        <img src={srv.photoUrl} alt="Foto" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-black text-5xl bg-[#1E293B]">
                            {srv.name.charAt(0)}
                        </div>
                    )}
                </div>

                {/* Bloque Amarillo */}
                <div className="absolute -bottom-3 -left-2.5 bg-[#FFD300] w-[80%] py-1.5 px-2 rounded-bl-md rounded-tl-md rounded-br-md rounded-tr-[20px] shadow-[0_8px_15px_rgba(0,0,0,0.5)] z-10">
                    <span className="text-[#090C11] text-[9px] font-black uppercase tracking-widest block text-center truncate">
                        {srv.group.replace('3', 'GRUPO ')}
                    </span>
                </div>
            </div>

            {/* Información Extra (Textos e Íconos adaptados) */}
            <div className="mt-5 px-1 flex flex-col gap-2.5">
                
                {/* Ícono Usuario + Nombre */}
                <div className="flex items-start gap-1.5">
                    <User size={16} className="text-[#FFD300] flex-none mt-0.5" />
                    <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-tight leading-none drop-shadow-md">
                        {srv.name}
                    </h3>
                </div>
                
                {/* Ícono Teléfono + Celular */}
                <div className="flex items-center gap-1.5 text-slate-300 text-[10px] font-bold bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/10 w-fit">
                    <Phone size={12} className="text-[#FFD300] flex-none" />
                    <span>{(isScheduler || currentServerId === srv.id) ? (srv.phone || 'N/A') : 'Privado'}</span>
                </div>
            </div>
        </button>
    ))}
</div>
                            </div>
                        )}

                        {activeTab === 'coordination' && isScheduler && (
                            <div className="py-6 space-y-8 animate-in slide-in-from-bottom-6">
                                <div className="glass-panel-heavy p-8 rounded-[3rem] flex flex-col md:flex-row gap-6 items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-black uppercase italic text-white leading-none">Panel de Programación</h2>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-2 tracking-widest italic">Selecciona quiénes sirven hoy: <span className="text-blue-400 font-black">{selectedDate}</span></p>
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
                                        <button 
                                            onClick={() => setIsManualInversion(!isManualInversion)} 
                                            className={`px-6 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest border transition-all flex items-center gap-3 ${isManualInversion ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}
                                        >
                                            <div className={`w-3 h-3 rounded-full ${isManualInversion ? 'bg-amber-400 animate-pulse' : 'bg-slate-600'}`}></div>
                                            Inversión: {isManualInversion ? 'MANUAL' : 'NORMAL'}
                                        </button>
                                        <button onClick={generateStrategicSchedule} disabled={isAutoScheduling || attendingList.length === 0} className="w-full md:w-auto px-8 py-5 glass-button-primary font-black rounded-[1.5rem] uppercase italic text-sm flex items-center justify-center gap-3 border-b-4 border-[#002299] active:scale-95 disabled:opacity-50">
                                            {isAutoScheduling ? (Loader2 && <Loader2 size={24} className="animate-spin" />) : (Wand2 && <Wand2 size={24} />)}
                                            {isAutoScheduling ? 'Optimizando...' : 'Generar Asignación Estratégica'}
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {['3A', '3B'].map(grupo => (
                                        <div key={grupo} className="bg-white/90 dark:bg-[#1E293B]/60 backdrop-blur-xl dark:backdrop-blur-md border border-blue-900/20 dark:border-white/10 rounded-xl overflow-hidden">
                                            <div className="bg-blue-900/10 dark:bg-white/5 backdrop-blur-sm p-4 flex items-center justify-between border-b border-blue-900/20 dark:border-white/10">
                                                <h3 className="font-black text-sm uppercase italic text-[#1a4467] dark:text-white">Grupo {grupo}</h3>
                                                <button onClick={() => toggleGroupAttending(grupo)} className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-[#1a4467]/10 dark:bg-[#FFD300]/20 border border-[#1a4467]/30 dark:border-[#FFD300]/30 text-[#1a4467] dark:text-[#FFD300] hover:bg-[#1a4467]/20 dark:hover:bg-[#FFD300]/30 transition-all active:scale-95">Alternar</button>
                                            </div>
                                            <div className="p-3 grid gap-2 max-h-[450px] overflow-y-auto custom-scrollbar">
                                                {allServers.filter(s => s.group === grupo && !s.isSupervisor && s.id !== 100 && s.id !== 103).map(srv => {
                                                    const isSelected = attendingList.includes(srv.id);
                                                    return (
                                                        <button key={srv.id} onClick={() => toggleAttending(srv.id)} className={`flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${isSelected ? 'border-[#FFD300] bg-[#FFD300]/10 shadow-md' : 'border-blue-900/20 dark:border-white/10 bg-transparent hover:bg-blue-900/10 dark:hover:bg-white/5'}`}>
                                                            <div className={`w-4 h-4 rounded flex items-center justify-center transition-colors flex-shrink-0 ${isSelected ? 'bg-[#FFD300] text-[#090C11]' : 'bg-blue-900/20 dark:bg-white/10 border border-blue-900/30 dark:border-white/20'}`}>
                                                                {isSelected && <Check size={10} strokeWidth={4} />}
                                                            </div>
                                                            <div className="overflow-hidden">
                                                                <p className={`font-black text-[10px] uppercase truncate ${isSelected ? 'text-[#1a4467] dark:text-white' : 'text-[#1a4467]/70 dark:text-slate-400'}`}>{srv.name}</p>
                                                                <p className="text-[8px] font-bold text-[#1a4467]/50 dark:text-slate-500 uppercase tracking-wider">{srv.gender === 'M' ? 'H' : 'M'} • {srv.phone || 'S/T'}</p>
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'consolidado' && isScheduler && (
                            <div className="py-6 space-y-12 animate-in slide-in-from-bottom-6">
                                <div className="no-print flex flex-col md:flex-row gap-4 items-center justify-between glass-panel p-6 rounded-[2rem]">
                                    <div className="flex items-center gap-4 w-full md:w-auto">
                                        <div className="bg-blue-900/30 p-3 rounded-2xl text-blue-400 border border-blue-500/20">{Calendar && <Calendar size={24} />}</div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic leading-none mb-1">Día a visualizar</p>
                                            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="bg-transparent font-black text-lg italic outline-none text-white color-scheme-dark" />
                                        </div>
                                    </div>
                                    <div className="flex gap-4 w-full md:w-auto">
                                        <button onClick={() => generatePDF()} disabled={isGeneratingPdf} className="w-full md:w-auto glass-button-primary font-black py-4 px-8 rounded-2xl flex items-center justify-center gap-3 uppercase italic text-sm border-b-[4px] border-[#002299] active:scale-95 disabled:opacity-50">
                                            {isGeneratingPdf ? (Loader2 && <Loader2 size={20} className="animate-spin" />) : (Printer && <Printer size={20} />)}
                                            {isGeneratingPdf ? 'Generando...' : 'Descargar PDF'}
                                        </button>
                                    </div>
                                </div>

                                <div id="coordinator-pdf-content" className="space-y-12 pb-8">
                                    {ZONES_DEFINITION.map((z, i) => renderZoneMonitor(z, i))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'management' && (
                            <div className="py-6 animate-in slide-in-from-bottom-6 space-y-8">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                                    {/* COLUMNA IZQUIERDA: CONFIGURACIÓN GLOBAL */}
                                    <div className="space-y-5">
                                        {/* FECHA GLOBAL */}
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black uppercase text-[#1a4467] dark:text-slate-400 italic tracking-[0.3em] ml-2">Fecha Global</p>
                                            <div className="bg-white/90 dark:bg-[#1E293B]/60 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-xl p-3 shadow-xl shadow-blue-900/10 dark:shadow-lg dark:shadow-black/5">
                                                <input 
                                                    type="date" 
                                                    value={globalActiveDate} 
                                                    onChange={(e) => { 
                                                        const val = e.target.value; 
                                                        setGlobalActiveDate(val); 
                                                        setSelectedDate(val); 
                                                        updateConfig('globalActiveDate', val); 
                                                    }} 
                                                    className="bg-transparent w-full p-3 rounded-lg font-black text-xl italic text-center text-[#1a4467] dark:text-white border-none" 
                                                />
                                            </div>
                                            <p className="text-[9px] font-bold text-[#FFD300]/60 uppercase italic ml-4">* CAMBIAR ACTUALIZA PLATAFORMA.</p>
                                        </div>

                                        {/* ROTACIÓN DE HORARIOS */}
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black uppercase text-[#FFD300] italic tracking-[0.3em] ml-2">Rotación</p>
                                            <div className="bg-white/90 dark:bg-[#1E293B]/60 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-xl p-3 shadow-xl shadow-blue-900/10 dark:shadow-lg dark:shadow-black/5 flex flex-col md:flex-row items-center justify-between gap-3">
                                                <div>
                                                    <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none mb-1">Mes</p>
                                                    <p className="text-xs font-black text-[#1a4467] dark:text-white uppercase italic">{grupoMadrugador}</p>
                                                </div>
                                                <button 
                                                    onClick={() => setIsManualInversion(!isManualInversion)} 
                                                    className={`px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${isManualInversion ? 'bg-[#FFD300]/20 border-[#FFD300]/50 text-[#FFD300]' : 'bg-blue-900/10 dark:bg-white/20 border-blue-900/20 dark:border-white/10 text-[#1a4467] dark:text-slate-400 hover:text-[#FFD300]'}`}
                                                >
                                                    <RefreshCw size={12} className={isManualInversion ? 'animate-spin' : ''} />
                                                    {isManualInversion ? 'MANUAL' : 'Invertir'}
                                                </button>
                                            </div>
                                        </div>

                                        {/* REGISTRO DE SERVIDORES */}
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black uppercase text-[#FFD300] italic tracking-[0.3em] ml-2">Registrar</p>
                                            <div className="bg-white/90 dark:bg-[#1E293B]/60 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-xl p-3 shadow-xl shadow-blue-900/10 dark:shadow-lg dark:shadow-black/5 space-y-3">
                                                <div className="flex items-center gap-3 pb-3 border-b border-blue-900/10 dark:border-white/10">
                                                    <div className="w-10 h-10 rounded-lg bg-blue-900/10 dark:bg-white/5 border border-blue-900/20 dark:border-white/10 flex items-center justify-center text-[#1a4467] dark:text-slate-500">
                                                        <Camera size={18} />
                                                    </div>
                                                    <button className="px-3 py-2 rounded-lg bg-blue-900/10 dark:bg-white/5 border border-blue-900/20 dark:border-white/10 text-[9px] font-black uppercase text-[#1a4467] dark:text-slate-300 hover:bg-blue-900/20 dark:hover:bg-white/10 transition-all">Foto</button>
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    <input type="text" placeholder="NOMBRE..." className="w-full p-2.5 rounded-lg bg-blue-900/10 dark:bg-white/5 border border-blue-900/20 dark:border-white/10 font-black uppercase text-xs text-[#1a4467] dark:text-white" value={newServerForm.name} onChange={(e) => setNewServerForm({ ...newServerForm, name: e.target.value })} />
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <input type="text" placeholder="DOC..." className="w-full p-2.5 rounded-lg bg-blue-900/10 dark:bg-white/5 border border-blue-900/20 dark:border-white/10 font-black uppercase text-xs text-[#1a4467] dark:text-white" value={newServerForm.doc} onChange={(e) => setNewServerForm({ ...newServerForm, doc: e.target.value })} />
                                                        <input type="text" placeholder="TEL..." className="w-full p-2.5 rounded-lg bg-blue-900/10 dark:bg-white/5 border border-blue-900/20 dark:border-white/10 font-black text-xs text-[#1a4467] dark:text-white" value={newServerForm.phone} onChange={(e) => setNewServerForm({ ...newServerForm, phone: e.target.value })} />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <select className="w-full p-2.5 rounded-lg bg-blue-900/10 dark:bg-white/5 border border-blue-900/20 dark:border-white/10 font-black uppercase text-xs outline-none text-[#1a4467] dark:text-white" value={newServerForm.group} onChange={(e) => setNewServerForm({ ...newServerForm, group: e.target.value })}>
                                                            <option value="3A">3A</option>
                                                            <option value="3B">3B</option>
                                                        </select>
                                                        <select className="w-full p-2.5 rounded-lg bg-blue-900/10 dark:bg-white/5 border border-blue-900/20 dark:border-white/10 font-black uppercase text-xs outline-none text-[#1a4467] dark:text-white" value={newServerForm.gender} onChange={(e) => setNewServerForm({ ...newServerForm, gender: e.target.value })}>
                                                            <option value="F">Mujer</option>
                                                            <option value="M">Hombre</option>
                                                        </select>
                                                    </div>
                                                    <button onClick={() => { if (newServerForm.name) { updateConfig('extraServers', [...extraServers, { id: Date.now(), ...newServerForm, isExternal: true }]); setNewServerForm({ name: '', phone: '', group: '3A', gender: 'F', doc: '', birthday: '', serviceStartDate: '', photoUrl: '', isSubstitute: false, substitutingId: '' }); } }} className="w-full bg-[#FFD300] text-[#090C11] font-black py-3 rounded-lg shadow-xl shadow-blue-900/10 uppercase text-xs italic active:scale-95 transition-all border-b-2 border-[#090C11]">Agregar</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* COLUMNA DERECHA: SUPERVISORES DE ZONA */}
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black uppercase text-[#FFD300] italic tracking-[0.3em] text-center md:text-right">Supervisores</p>
                                        <div className="bg-white/90 dark:bg-[#1E293B]/60 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-xl p-2 shadow-xl shadow-blue-900/10 dark:shadow-lg dark:shadow-black/5">
                                            <div className="rounded-lg p-3 md:p-4 space-y-4 max-h-[650px] overflow-y-auto custom-scrollbar">
                                                {ZONES_DEFINITION.map(z => (
                                                    <div key={z.id} className="p-3 rounded-lg bg-blue-900/10 dark:bg-white/5 border border-blue-900/20 dark:border-white/10 space-y-3 hover:bg-blue-900/20 dark:hover:bg-white/10 transition-all">
                                                        <p className="text-xs font-black text-[#1a4467] dark:text-white uppercase italic tracking-widest border-b border-blue-900/20 dark:border-white/10 pb-2 flex justify-between items-center">
                                                            {z.name}
                                                            <span className="text-[8px] bg-[#FFD300]/20 text-[#FFD300] px-2 py-0.5 rounded-full font-black">CONFIG</span>
                                                        </p>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            <div className="space-y-1">
                                                                <p className="text-[8px] font-black text-[#1a4467]/70 dark:text-slate-500 uppercase tracking-widest ml-2">SUP</p>
                                                                <select value={zoneSupervisors[z.id] || ""} onChange={(e) => updateConfig('zoneSupervisors', { ...zoneSupervisors, [z.id]: e.target.value })} className="w-full p-2.5 rounded-lg bg-blue-900/10 dark:bg-white/5 border border-blue-900/20 dark:border-white/10 font-black text-[9px] uppercase italic outline-none text-[#1a4467] dark:text-white">
                                                                    <option value="">--</option>
                                                                    {allServers.filter(s => s.isSupervisor).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                                                </select>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="text-[8px] font-black text-[#1a4467]/70 dark:text-slate-500 uppercase tracking-widest ml-2">APOYO</p>
                                                                <select value={zoneSupports[z.id] || ""} onChange={(e) => updateConfig('zoneSupports', { ...zoneSupports, [z.id]: e.target.value })} className="w-full p-2.5 rounded-lg bg-blue-900/10 dark:bg-white/5 border border-blue-900/20 dark:border-white/10 font-black text-[9px] uppercase italic outline-none text-[#1a4467] dark:text-white">
                                                                    <option value="">--</option>
                                                                    {allServers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </main>

                    {selectedProfileId !== null && (
                        <div className="fixed inset-0 z-[2000] bg-black/30 backdrop-blur-[2px] flex items-center justify-center p-4 md:p-6 overflow-y-auto">

<div className="glass-panel-heavy rounded-[3rem] w-full max-w-[500px] shadow-[0_0_50px_rgba(0,68,255,0.2)] relative overflow-hidden animate-in zoom-in-95 my-8 border border-white/20">
                                <button onClick={() => { setSelectedProfileId(null); setIsEditingProfile(false); }} className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 z-10 border border-white/20">{X && <X size={20} className="text-white" />}</button>

                                <div className="h-32 w-full relative bg-gradient-to-b from-blue-600/40 to-transparent">
                                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                                        {profileForm.photoUrl ? (
                                            <img src={profileForm.photoUrl} alt="Foto" className="w-24 h-24 rounded-[1.5rem] object-cover border-4 border-[#050B14] shadow-[0_0_20px_rgba(0,68,255,0.6)] bg-white/5" />
                                        ) : (
                                            <div className="w-24 h-24 rounded-[1.5rem] border-4 border-[#050B14] shadow-[0_0_20px_rgba(0,68,255,0.6)] flex items-center justify-center bg-black/50">
                                                <div className={`w-full h-full rounded-[1.2rem] flex items-center justify-center text-white font-black text-3xl ${profileForm.gender === 'M' ? 'bg-blue-600' : 'bg-purple-600'}`}>
                                                    {profileForm.name?.charAt(0) || '?'}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-16 pb-8 px-8">
                                    {isEditingProfile ? (
                                        <div className="space-y-4">
                                            <h3 className="text-center font-black uppercase italic text-blue-400 mb-6 drop-shadow-md">Modo Edición</h3>
                                            <div className="space-y-3">
                                                <div className="bg-blue-900/20 p-4 rounded-2xl border border-blue-500/30 mb-4 shadow-inner">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase ml-1 mb-2">Actualizar Foto del Servidor</p>
                                                    <div className="flex flex-col gap-2">
                                                        <label className="cursor-pointer glass-button-primary px-4 py-3 rounded-xl flex items-center justify-center gap-2 font-black text-[11px] uppercase tracking-widest border-none">
                                                            {UploadCloud && <UploadCloud size={18} />} Cargar Nueva Foto
                                                            <input type="file" accept="image/*" className="hidden" onChange={handleProfileImageUpload} />
                                                        </label>
                                                        <input type="text" className="glass-input w-full p-3 rounded-xl font-bold text-[10px] text-center" value={profileForm.photoUrl || ''} onChange={e => setProfileForm({ ...profileForm, photoUrl: e.target.value })} placeholder="O pega un enlace de internet aquí..." />
                                                    </div>
                                                </div>
                                                <div><p className="text-[10px] font-bold text-slate-400 uppercase ml-1">Teléfono</p><input type="text" className="glass-input w-full p-3 rounded-xl font-bold text-xs" value={profileForm.phone || ''} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} /></div>
                                                {(isScheduler || currentServerId === profileForm.id) && (
                                                    <div><p className="text-[10px] font-bold text-slate-400 uppercase ml-1">Documento / Cédula</p><input type="text" className="glass-input w-full p-3 rounded-xl font-bold text-xs" value={profileForm.doc || ''} onChange={e => setProfileForm({ ...profileForm, doc: e.target.value })} /></div>
                                                )}

<div className="grid grid-cols-2 gap-3">
                                                    <div><p className="text-[10px] font-bold text-slate-400 uppercase ml-1">Cumpleaños</p><input type="text" className="glass-input w-full p-3 rounded-xl font-bold text-xs" placeholder="Ej: 15-Ago" value={profileForm.birthday || ''} onChange={e => setProfileForm({ ...profileForm, birthday: e.target.value })} /></div>
                                                    <div><p className="text-[10px] font-bold text-slate-400 uppercase ml-1">Fecha Ingreso</p><input type="date" className="glass-input w-full p-3 rounded-xl font-bold text-xs color-scheme-dark cursor-pointer" value={profileForm.serviceStartDate || ''} onChange={e => setProfileForm({ ...profileForm, serviceStartDate: e.target.value })} /></div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-3 pt-4">
                                                <div className="flex gap-3">
                                                    <button onClick={() => setIsEditingProfile(false)} className="flex-1 p-4 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors font-black uppercase text-[10px] italic rounded-2xl text-slate-300">Cancelar</button>
                                                    <button onClick={handleSaveProfileEdit} className="flex-1 p-4 glass-button-primary font-black uppercase text-[10px] italic rounded-2xl flex items-center justify-center gap-2 border-b-[4px] border-[#002299] active:scale-95">{Save && <Save size={16} />} Guardar</button>
                                                </div>
                                                {isScheduler && profileForm.isExternal && (
                                                    <button onClick={() => handleDeleteServer(profileForm.id)} className="w-full p-4 bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 text-red-500 font-black uppercase text-[10px] italic rounded-2xl transition-all">Eliminar Servidor Definitivamente</button>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="text-center mb-8">
                                                <h3 className="text-2xl font-black uppercase italic text-white leading-tight">{profileForm.name}</h3>
                                                <div className="flex justify-center gap-2 mt-3">
                                                    <span className="bg-blue-600/20 text-blue-400 border border-blue-500/50 shadow-[0_0_10px_rgba(0,68,255,0.4)] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{profileForm.group ? profileForm.group.replace('3', '') : ''}</span>
                                                    {profileForm.isSupervisor && <span className="bg-purple-600/20 text-purple-400 border border-purple-500/50 shadow-[0_0_10px_rgba(139,92,246,0.4)] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">{Star && <Star size={10} fill="currentColor" />} LÍDER</span>}
                                                </div>
                                            </div>

                                            {(!isScheduler && currentServerId !== profileForm.id) ? (
                                                <div className="bg-white/5 rounded-[2rem] p-6 text-center border border-white/10 shadow-inner">
                                                    {ShieldCheck && <ShieldCheck size={40} className="mx-auto text-blue-400/50 mb-3" />}
                                                    <p className="text-xs font-bold text-white uppercase tracking-widest">Información Privada</p>
                                                    <p className="text-[10px] text-slate-400 mt-2">Los datos de contacto y fechas son exclusivos para el equipo de coordinación.</p>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="bg-black/30 rounded-[2rem] p-6 space-y-5 border border-white/10 shadow-inner">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-sm text-blue-400">{Contact && <Contact size={20} />}</div>

<div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Teléfono</p><p className="font-bold text-white text-sm mt-1">{profileForm.phone || 'No registrado'}</p></div>
                                                        </div>

                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-sm text-blue-400">{CreditCard && <CreditCard size={20} />}</div>
                                                            <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Documento</p><p className="font-bold text-white text-sm mt-1">{profileForm.doc || 'No registrado'}</p></div>
                                                        </div>

                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-sm text-blue-400">{CalendarDays && <CalendarDays size={20} />}</div>
                                                            <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Cumpleaños</p><p className="font-bold text-white text-sm mt-1">{profileForm.birthday || 'No registrado'}</p></div>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-sm text-blue-400">{Clock && <Clock size={20} />}</div>
                                                            <div>
                                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Tiempo en Servicio</p>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <p className="font-bold text-white text-sm">{profileForm.serviceStartDate || 'No registrado'}</p>
                                                                    {profileForm.serviceStartDate && (
                                                                        <span className="bg-purple-600/20 text-purple-400 border border-purple-500/50 shadow-[0_0_5px_rgba(139,92,246,0.3)] px-2 py-0.5 rounded text-[10px] font-black uppercase">
                                                                            {calculateYearsInService(profileForm.serviceStartDate)} Años
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <button onClick={() => setIsEditingProfile(true)} className="w-full mt-6 bg-white/5 hover:bg-white/10 border border-white/20 transition-all text-white font-black py-4 rounded-[1.5rem] uppercase text-[11px] italic flex items-center justify-center gap-2 shadow-lg active:scale-95">
                                                        {Pencil && <Pencil size={16} />} Actualizar Mis Datos
                                                    </button>
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {showThanksModal && (
                        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
                            <video autoPlay loop muted className="fixed inset-0 w-full h-full object-cover -z-10">
                                <source src="/vid_login.mp4" type="video/mp4" />
                            </video>
                            <div className="absolute inset-0 bg-black/50 -z-10"></div>
                            <div className="relative overflow-hidden rounded-3xl p-[1.5px]">
                                <div className="absolute inset-[-1000%] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#007BFF_50%,transparent_100%)] animate-[spin_4s_linear_infinite]" />
                                <div className="relative z-10 bg-white/5 backdrop-blur-3xl rounded-[inherit] p-10 flex flex-col items-center space-y-6">
                                    <img src="/Icon_login.png" alt="Logo" className="h-24" />
                                    <h3 className="text-2xl font-black text-white text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">¡PROGRAMACIÓN ENVIADA!</h3>
                                    <div className="bg-black/30 border border-white/10 p-4 rounded-xl">
                                        <p className="text-sm font-bold text-white italic text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">"{randomVerse}"</p>
                                    </div>
                                    <button onClick={() => setShowThanksModal(false)} className="w-full py-4 bg-[#007BFF] text-white font-black rounded-xl uppercase text-sm shadow-lg hover:bg-[#0056cc] transition-all active:scale-95">CERRAR</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {alertMsg && (
                        <div className="fixed inset-0 z-[3000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
                            <div className="glass-panel-heavy rounded-[3rem] p-8 max-w-sm w-full text-center shadow-[0_0_30px_rgba(245,158,11,0.2)] border border-amber-500/30 animate-in zoom-in-95">
                                {AlertTriangle && <AlertTriangle size={48} className="mx-auto text-amber-500 mb-4 drop-shadow-[0_0_10px_rgba(245,158,11,0.6)]" />}
                                <h3 className="text-xl font-black uppercase italic text-white mb-2">Aviso</h3>
                                <p className="text-sm font-bold text-slate-300 mb-6">{alertMsg}</p>
                                <button onClick={() => setAlertMsg("")} className="w-full bg-white/10 text-white border border-white/20 font-black py-4 rounded-2xl uppercase text-[11px] hover:bg-white/20 transition-all">Entendido</button>
                            </div>
                        </div>
                    )}

                    {confirmDialog && (
                        <div className="fixed inset-0 z-[3000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
                            <div className="glass-panel-heavy rounded-[3rem] p-8 max-w-md w-full text-center shadow-[0_0_30px_rgba(0,68,255,0.2)] border border-blue-500/30 animate-in zoom-in-95">
                                {ShieldCheck && <ShieldCheck size={48} className="mx-auto text-blue-500 mb-4 drop-shadow-[0_0_10px_rgba(0,68,255,0.6)]" />}
                                <h3 className="text-xl font-black uppercase italic text-white mb-4">Confirmar Cambio Manual</h3>
                                <div className="text-sm font-bold text-slate-300 mb-8 whitespace-pre-line text-left bg-black/20 p-4 rounded-2xl border border-white/5">
                                    {confirmDialog.message}
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => setConfirmDialog(null)} className="flex-1 bg-white/5 text-slate-400 border border-white/10 font-black py-4 rounded-2xl uppercase text-[11px] hover:bg-white/10 hover:text-white transition-all">Cancelar</button>
                                    <button onClick={confirmDialog.onConfirm} className="flex-1 glass-button-primary text-white font-black py-4 rounded-2xl uppercase text-[11px] transition-all">Aplicar Cambio</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            );
        }