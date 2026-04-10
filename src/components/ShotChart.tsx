import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, TrendingUp, TrendingDown, Zap, Shield, Circle, Trophy, BarChart3 } from 'lucide-react';
import { ShotChart as ShotChartType } from '../types';

interface ShotChartProps {
  shotChart: ShotChartType;
  playerName: string;
}

const ShotChart: React.FC<ShotChartProps> = ({ shotChart, playerName }) => {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  // Définition des zones du terrain avec leurs coordonnées et couleurs
  const courtZones = [
    {
      id: 'paint',
      name: 'Paint',
      color: '#ef4444',
      hoverColor: '#dc2626',
      path: 'M 50 85 L 50 15 L 150 15 L 150 85 Z',
      center: { x: 100, y: 50 },
      description: 'Zone de la raquette'
    },
    {
      id: 'mid-range-left',
      name: 'Mid-Range Left',
      color: '#f97316',
      hoverColor: '#ea580c',
      path: 'M 20 85 L 20 15 L 50 15 L 50 85 Z',
      center: { x: 35, y: 50 },
      description: 'Tir à mi-distance gauche'
    },
    {
      id: 'mid-range-right',
      name: 'Mid-Range Right',
      color: '#f97316',
      hoverColor: '#ea580c',
      path: 'M 150 85 L 150 15 L 180 15 L 180 85 Z',
      center: { x: 165, y: 50 },
      description: 'Tir à mi-distance droite'
    },
    {
      id: 'corner-three-left',
      name: 'Corner Three Left',
      color: '#3b82f6',
      hoverColor: '#2563eb',
      path: 'M 5 85 L 5 15 L 20 15 L 20 85 Z',
      center: { x: 12.5, y: 50 },
      description: 'Tir à 3 points coin gauche'
    },
    {
      id: 'corner-three-right',
      name: 'Corner Three Right',
      color: '#3b82f6',
      hoverColor: '#2563eb',
      path: 'M 180 85 L 180 15 L 195 15 L 195 85 Z',
      center: { x: 187.5, y: 50 },
      description: 'Tir à 3 points coin droit'
    },
    {
      id: 'wing-three-left',
      name: 'Wing Three Left',
      color: '#8b5cf6',
      hoverColor: '#7c3aed',
      path: 'M 20 15 L 20 5 L 50 5 L 50 15 Z',
      center: { x: 35, y: 10 },
      description: 'Tir à 3 points aile gauche'
    },
    {
      id: 'wing-three-right',
      name: 'Wing Three Right',
      color: '#8b5cf6',
      hoverColor: '#7c3aed',
      path: 'M 150 15 L 150 5 L 180 5 L 180 15 Z',
      center: { x: 165, y: 10 },
      description: 'Tir à 3 points aile droite'
    },
    {
      id: 'top-three',
      name: 'Top Three',
      color: '#06b6d4',
      hoverColor: '#0891b2',
      path: 'M 50 15 L 50 5 L 150 5 L 150 15 Z',
      center: { x: 100, y: 10 },
      description: 'Tir à 3 points haut'
    }
  ];

  // Trouver les données de la zone
  const getZoneData = (zoneId: string) => {
    return shotChart.zones.find(zone => zone.zone === zoneId) || {
      made: 0,
      attempted: 0,
      percentage: 0
    };
  };

  // Calculer la couleur basée sur le pourcentage
  const getZoneColor = (zoneId: string, isHovered: boolean) => {
    const zoneData = getZoneData(zoneId);
    const zone = courtZones.find(z => z.id === zoneId);
    
    if (!zone) return '#gray';
    
    if (isHovered) return zone.hoverColor;
    
    // Couleur basée sur le pourcentage
    if (zoneData.percentage >= 50) return '#10b981'; // Vert pour bon pourcentage
    if (zoneData.percentage >= 35) return '#f59e0b'; // Orange pour pourcentage moyen
    return '#ef4444'; // Rouge pour faible pourcentage
  };

  // Calculer la taille du cercle basée sur le nombre de tentatives
  const getZoneSize = (zoneId: string) => {
    const zoneData = getZoneData(zoneId);
    const maxAttempts = Math.max(...shotChart.zones.map(z => z.attempted));
    const minSize = 8;
    const maxSize = 25;
    
    if (maxAttempts === 0) return minSize;
    
    return minSize + ((zoneData.attempted / maxAttempts) * (maxSize - minSize));
  };

  return (
    <div className="w-full">
      {/* En-tête avec statistiques globales - Design amélioré */}
      <motion.div 
        className="mb-8 p-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-3xl shadow-2xl border border-purple-500/20 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Effet de fond animé */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-blue-500/10 animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <motion.div
                className="p-3 bg-gradient-to-br from-crimson-500 to-purple-600 rounded-2xl shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <Target className="h-8 w-8 text-white" />
              </motion.div>
              <div>
                <h3 className="text-3xl font-bold text-white mb-1">Shot Chart</h3>
                <p className="text-purple-200 text-lg">{playerName}</p>
              </div>
            </div>
            <motion.div
              className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg"
              whileHover={{ scale: 1.1, rotate: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Circle className="h-8 w-8 text-white" />
            </motion.div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <motion.div 
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl"
              whileHover={{ scale: 1.05, rotateY: 5, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-2">
                <BarChart3 className="h-6 w-6 text-blue-400" />
                <div className="text-3xl font-bold text-white">{shotChart.summary.totalShots}</div>
              </div>
              <div className="text-sm text-purple-200">Total Shots</div>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl"
              whileHover={{ scale: 1.05, rotateY: 5, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-2">
                <Trophy className="h-6 w-6 text-green-400" />
                <div className="text-3xl font-bold text-white">{shotChart.summary.totalMade}</div>
              </div>
              <div className="text-sm text-purple-200">Made</div>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl"
              whileHover={{ scale: 1.05, rotateY: 5, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-2">
                <Target className="h-6 w-6 text-crimson-400" />
                <div className="text-3xl font-bold text-white">{shotChart.summary.overallPercentage}%</div>
              </div>
              <div className="text-sm text-purple-200">FG%</div>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl"
              whileHover={{ scale: 1.05, rotateY: 5, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-2">
                <Zap className="h-6 w-6 text-yellow-400" />
                <div className="text-2xl font-bold text-white">{shotChart.summary.mostEfficientZone}</div>
              </div>
              <div className="text-sm text-purple-200">Best Zone</div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Terrain de basket complet - Design amélioré */}
      <div className="relative">
        <motion.div 
          className="bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100 rounded-3xl p-8 shadow-2xl border-4 border-orange-300 relative overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Effet de texture bois */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.3),transparent_50%)] opacity-60" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(255,255,255,0.2),transparent_50%)] opacity-40" />
          
          <div className="relative z-10">
            <svg 
              viewBox="0 0 200 100" 
              className="w-full h-auto drop-shadow-2xl"
              style={{ maxHeight: '600px' }}
            >
              {/* Fond du terrain avec gradient */}
              <defs>
                <linearGradient id="courtGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: '#fbbf24', stopOpacity: 1}} />
                  <stop offset="50%" style={{stopColor: '#f59e0b', stopOpacity: 1}} />
                  <stop offset="100%" style={{stopColor: '#d97706', stopOpacity: 1}} />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              <rect x="0" y="0" width="200" height="100" fill="url(#courtGradient)" stroke="#8B4513" strokeWidth="1"/>
              
              {/* Lignes principales du terrain avec effet de lueur */}
              <g stroke="#8B4513" strokeWidth="1" fill="none" filter="url(#glow)">
                {/* Lignes de fond */}
                <line x1="0" y1="85" x2="200" y2="85" />
                <line x1="0" y1="15" x2="200" y2="15" />
                
                {/* Lignes latérales */}
                <line x1="0" y1="0" x2="0" y2="100" />
                <line x1="200" y1="0" x2="200" y2="100" />
                
                {/* Ligne médiane */}
                <line x1="100" y1="0" x2="100" y2="100" />
                
                {/* Ligne de lancer franc */}
                <line x1="50" y1="15" x2="150" y2="15" />
                
                {/* Ligne de 3 points - forme courbe */}
                <path d="M 5 85 Q 100 5 195 85" />
                
                {/* Lignes de lancer franc latérales */}
                <line x1="50" y1="15" x2="50" y2="85" />
                <line x1="150" y1="15" x2="150" y2="85" />
              </g>

              {/* Cercles du terrain avec effet de lueur */}
              <g stroke="#8B4513" strokeWidth="1" fill="none" filter="url(#glow)">
                {/* Cercle central */}
                <circle cx="100" cy="50" r="15" />
                
                {/* Cercles de lancer franc */}
                <circle cx="50" cy="50" r="8" />
                <circle cx="150" cy="50" r="8" />
                
                {/* Cercles de lancer franc latéraux */}
                <circle cx="50" cy="85" r="8" />
                <circle cx="150" cy="85" r="8" />
              </g>

              {/* Paniers avec design amélioré */}
              <g>
                {/* Poteaux avec gradient */}
                <defs>
                  <linearGradient id="poleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#8B4513', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#654321', stopOpacity: 1}} />
                  </linearGradient>
                </defs>
                
                {/* Poteau gauche */}
                <rect x="48" y="0" width="4" height="8" fill="url(#poleGradient)" />
                {/* Poteau droit */}
                <rect x="148" y="0" width="4" height="8" fill="url(#poleGradient)" />
                
                {/* Anneaux avec effet métallique */}
                <defs>
                  <radialGradient id="rimGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" style={{stopColor: '#FF6B35', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#E55A2B', stopOpacity: 1}} />
                  </radialGradient>
                </defs>
                
                <circle cx="50" cy="8" r="3" fill="none" stroke="url(#rimGradient)" strokeWidth="1.5" />
                <circle cx="150" cy="8" r="3" fill="none" stroke="url(#rimGradient)" strokeWidth="1.5" />
                
                {/* Filets avec effet de transparence */}
                <g stroke="#FF6B35" strokeWidth="0.4" opacity="0.8">
                  <line x1="47" y1="8" x2="47" y2="12" />
                  <line x1="48" y1="8" x2="48" y2="12" />
                  <line x1="49" y1="8" x2="49" y2="12" />
                  <line x1="50" y1="8" x2="50" y2="12" />
                  <line x1="51" y1="8" x2="51" y2="12" />
                  <line x1="52" y1="8" x2="52" y2="12" />
                  <line x1="53" y1="8" x2="53" y2="12" />
                  
                  <line x1="147" y1="8" x2="147" y2="12" />
                  <line x1="148" y1="8" x2="148" y2="12" />
                  <line x1="149" y1="8" x2="149" y2="12" />
                  <line x1="150" y1="8" x2="150" y2="12" />
                  <line x1="151" y1="8" x2="151" y2="12" />
                  <line x1="152" y1="8" x2="152" y2="12" />
                  <line x1="153" y1="8" x2="153" y2="12" />
                </g>
              </g>

              {/* Zones de tir avec effets améliorés */}
              {courtZones.map((zone) => {
                const zoneData = getZoneData(zone.id);
                const isHovered = hoveredZone === zone.id;
                const isSelected = selectedZone === zone.id;
                
                return (
                  <g key={zone.id}>
                    {/* Zone de base avec effet de lueur */}
                    <motion.path
                      d={zone.path}
                      fill={getZoneColor(zone.id, isHovered)}
                      opacity={isHovered || isSelected ? 0.9 : 0.4}
                      stroke="#8B4513"
                      strokeWidth="0.5"
                      filter={isHovered ? "url(#glow)" : "none"}
                      whileHover={{ 
                        opacity: 0.95,
                        scale: 1.02,
                        transition: { duration: 0.2 }
                      }}
                      onMouseEnter={() => setHoveredZone(zone.id)}
                      onMouseLeave={() => setHoveredZone(null)}
                      onClick={() => setSelectedZone(selectedZone === zone.id ? null : zone.id)}
                      style={{ cursor: 'pointer' }}
                    />
                    
                    {/* Cercles représentant les tirs avec effet de lueur */}
                    {zoneData.attempted > 0 && (
                      <motion.circle
                        cx={zone.center.x}
                        cy={zone.center.y}
                        r={getZoneSize(zone.id)}
                        fill={zoneData.percentage >= 50 ? '#10b981' : zoneData.percentage >= 35 ? '#f59e0b' : '#ef4444'}
                        opacity={0.9}
                        stroke="#1f2937"
                        strokeWidth="0.8"
                        filter="url(#glow)"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.9 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        whileHover={{ scale: 1.3, filter: "url(#glow)" }}
                      />
                    )}
                    
                    {/* Texte des statistiques avec fond */}
                    {isHovered && (
                      <g>
                        <rect
                          x={zone.center.x - 15}
                          y={zone.center.y + 2}
                          width="30"
                          height="8"
                          fill="rgba(0,0,0,0.8)"
                          rx="2"
                        />
                        <motion.text
                          x={zone.center.x}
                          y={zone.center.y + 8}
                          textAnchor="middle"
                          fontSize="3"
                          fill="#ffffff"
                          fontWeight="bold"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {zoneData.made}/{zoneData.attempted}
                        </motion.text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Légende sur le terrain avec style amélioré */}
              <g>
                <rect x="85" y="92" width="30" height="6" fill="rgba(139,69,19,0.8)" rx="2" />
                <text x="100" y="96" textAnchor="middle" fontSize="3" fill="#ffffff" fontWeight="bold">
                  COURT
                </text>
              </g>
            </svg>
          </div>
        </motion.div>

        {/* Légende améliorée */}
        <motion.div 
          className="mt-8 p-6 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl shadow-xl border border-slate-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h4 className="text-lg font-bold text-white mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
            Legend
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-green-500 rounded-full shadow-lg"></div>
              <span className="text-sm text-gray-300">≥50%</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-lg"></div>
              <span className="text-sm text-gray-300">35-49%</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-red-500 rounded-full shadow-lg"></div>
              <span className="text-sm text-gray-300">&lt;35%</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-gray-400 rounded-full shadow-lg"></div>
              <span className="text-sm text-gray-300">Size = Volume</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Détails de la zone sélectionnée - Design amélioré */}
      <AnimatePresence>
        {selectedZone && (
          <motion.div
            className="mt-8 p-8 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-200 relative overflow-hidden"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            {/* Effet de fond */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5" />
            
            <div className="relative z-10">
              {(() => {
                const zone = courtZones.find(z => z.id === selectedZone);
                const zoneData = getZoneData(selectedZone);
                
                if (!zone) return null;
                
                return (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <motion.div
                          className="p-3 bg-gradient-to-br from-crimson-500 to-purple-600 rounded-2xl shadow-lg"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Target className="h-6 w-6 text-white" />
                        </motion.div>
                        <div>
                          <h4 className="text-2xl font-bold text-gray-900">{zone.name}</h4>
                          <p className="text-gray-600">{zone.description}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-6 mb-6">
                      <motion.div 
                        className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 text-center shadow-lg border border-red-200"
                        whileHover={{ scale: 1.05, y: -2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="text-3xl font-bold text-red-600">{zoneData.attempted}</div>
                        <div className="text-sm text-red-700 font-medium">Attempted</div>
                      </motion.div>
                      <motion.div 
                        className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center shadow-lg border border-green-200"
                        whileHover={{ scale: 1.05, y: -2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="text-3xl font-bold text-green-600">{zoneData.made}</div>
                        <div className="text-sm text-green-700 font-medium">Made</div>
                      </motion.div>
                      <motion.div 
                        className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center shadow-lg border border-blue-200"
                        whileHover={{ scale: 1.05, y: -2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="text-3xl font-bold text-blue-600">{zoneData.percentage}%</div>
                        <div className="text-sm text-blue-700 font-medium">Percentage</div>
                      </motion.div>
                    </div>
                    
                    {/* Barre de progression améliorée */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span className="font-medium">Accuracy</span>
                        <span className="font-bold">{zoneData.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                        <motion.div
                          className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-3 rounded-full shadow-lg"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(zoneData.percentage, 100)}%` }}
                          transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zones chaudes et froides - Design amélioré */}
      <motion.div 
        className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <motion.div 
          className="bg-gradient-to-br from-green-900 via-emerald-800 to-green-900 rounded-3xl p-8 shadow-2xl border border-green-500/20 relative overflow-hidden"
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ duration: 0.3 }}
        >
          {/* Effet de fond */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-transparent to-emerald-500/10" />
          
          <div className="relative z-10">
            <h4 className="text-xl font-bold text-white mb-6 flex items-center">
              <TrendingUp className="h-6 w-6 mr-3 text-green-400" />
              Hot Zones
            </h4>
            <div className="space-y-3">
              {shotChart.summary.hotZones.map((zone, index) => (
                <motion.div
                  key={zone}
                  className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-green-500/20"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <span className="text-green-200 font-medium">{zone}</span>
                  <Zap className="h-5 w-5 text-green-400" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-gradient-to-br from-red-900 via-rose-800 to-red-900 rounded-3xl p-8 shadow-2xl border border-red-500/20 relative overflow-hidden"
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ duration: 0.3 }}
        >
          {/* Effet de fond */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-rose-500/10" />
          
          <div className="relative z-10">
            <h4 className="text-xl font-bold text-white mb-6 flex items-center">
              <TrendingDown className="h-6 w-6 mr-3 text-red-400" />
              Cold Zones
            </h4>
            <div className="space-y-3">
              {shotChart.summary.coldZones.map((zone, index) => (
                <motion.div
                  key={zone}
                  className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-red-500/20"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: -5 }}
                >
                  <span className="text-red-200 font-medium">{zone}</span>
                  <Shield className="h-5 w-5 text-red-400" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ShotChart;
