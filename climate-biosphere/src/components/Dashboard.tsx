'use client';

import { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Globe, Zap, AlertTriangle, Leaf, TrendingUp, Menu, X } from 'lucide-react';
import ParticleGlobe from './ParticleGlobe';
import { TelemetryWidget, AnomalyAlert, RewildingCard } from './TelemetryWidget';
import { generateTelemetryData, cn } from '@/lib/utils';

type TelemetryData = ReturnType<typeof generateTelemetryData>;

export default function Dashboard() {
  const [data, setData] = useState<TelemetryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'anomalies' | 'rewilding'>('overview');

  // Simulate real-time data updates
  useEffect(() => {
    const loadData = () => {
      setData(generateTelemetryData());
      setIsLoading(false);
    };
    
    loadData();
    
    // Update data every 5 seconds
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--biosphere-black)' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-[var(--primary)] border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-[var(--foreground-muted)] text-mono">INITIALIZING BIOSPHERE MATRIX...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* CRT Scanline Overlay */}
      <div className="crt-scanlines" />
      
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] opacity-20"
          style={{ background: 'var(--primary)' }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[120px] opacity-15"
          style={{ background: 'var(--secondary)' }}
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 glass-panel border-b-0 rounded-none border-t-0 mx-0 mt-0"
        style={{ borderRadius: 0 }}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Globe size={32} className="text-[var(--primary-glow)]" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold glitch-text" data-text="BIOSPHERE MATRIX">
                BIOSPHERE MATRIX
              </h1>
              <p className="text-xs text-[var(--foreground-muted)] text-mono">
                REAL-TIME CLIMATE INTELLIGENCE
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Status Indicator */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 glass-panel">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-[var(--primary-glow)]"
              />
              <span className="text-xs text-mono text-[var(--foreground-muted)]">LIVE FEED</span>
            </div>
            
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Content Grid */}
      <main className="pt-24 pb-8 px-4 md:px-6 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1800px] mx-auto">
          
          {/* Left Sidebar - Navigation & Quick Stats */}
          <motion.aside
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={cn(
              "lg:col-span-2 space-y-4",
              sidebarOpen ? "fixed inset-0 z-40 bg-black/95 p-6" : "hidden lg:block"
            )}
          >
            {sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 lg:hidden"
              >
                <X size={24} />
              </button>
            )}
            
            <nav className="space-y-2">
              {[
                { id: 'overview', label: 'Overview', icon: Activity },
                { id: 'anomalies', label: 'Anomalies', icon: AlertTriangle },
                { id: 'rewilding', label: 'Rewilding', icon: Leaf },
              ].map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setSidebarOpen(false);
                  }}
                  whileHover={{ x: 8 }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                    activeTab === item.id
                      ? 'bg-[var(--primary)]/20 text-[var(--primary-glow)]'
                      : 'text-[var(--foreground-muted)] hover:bg-white/5'
                  )}
                >
                  <item.icon size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                </motion.button>
              ))}
            </nav>
            
            {/* Quick Stats */}
            <div className="mt-8 space-y-4">
              <h3 className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">
                System Status
              </h3>
              {[
                { label: 'Sensors Active', value: '847', color: 'var(--primary)' },
                { label: 'Data Points/sec', value: '12.4K', color: 'var(--secondary)' },
                { label: 'Coverage', value: '94.2%', color: 'var(--warning)' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="glass-panel p-3"
                >
                  <p className="text-xs text-[var(--foreground-muted)]">{stat.label}</p>
                  <p className="text-lg font-bold text-mono" style={{ color: stat.color }}>
                    {stat.value}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.aside>

          {/* Center - 3D Globe Canvas */}
          <section className="lg:col-span-6 min-h-[500px] lg:min-h-[600px]">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="glass-panel h-full relative overflow-hidden"
              style={{ minHeight: '500px' }}
            >
              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="globe"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0"
                  >
                    <Suspense fallback={
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                      </div>
                    }>
                      <Canvas gl={{ antialias: true, alpha: true }}>
                        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={50} />
                        <OrbitControls 
                          enableZoom={true}
                          enablePan={false}
                          minDistance={4}
                          maxDistance={10}
                          autoRotate
                          autoRotateSpeed={0.5}
                        />
                        <Environment preset="night" />
                        <ParticleGlobe 
                          particleCount={6000}
                          rotationSpeed={0.002}
                          color="#059669"
                          secondaryColor="#00d4ff"
                          interactive={true}
                        />
                      </Canvas>
                    </Suspense>
                    
                    {/* Overlay Info */}
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between text-xs text-mono text-[var(--foreground-muted)]">
                      <span>LAT: {(Math.random() * 180 - 90).toFixed(4)}°</span>
                      <span>LNG: {(Math.random() * 360 - 180).toFixed(4)}°</span>
                      <span>ZOOM: 1.0x</span>
                    </div>
                  </motion.div>
                )}
                
                {activeTab === 'anomalies' && (
                  <motion.div
                    key="anomalies"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="p-6 h-full overflow-y-auto"
                  >
                    <h2 className="text-display mb-6 flex items-center gap-3">
                      <AlertTriangle className="text-[var(--accent)]" />
                      Environmental Anomalies
                    </h2>
                    <div className="space-y-3">
                      {data.anomalies.map((anomaly, i) => (
                        <AnomalyAlert key={anomaly.id} anomaly={anomaly} delay={i * 0.1} />
                      ))}
                    </div>
                  </motion.div>
                )}
                
                {activeTab === 'rewilding' && (
                  <motion.div
                    key="rewilding"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="p-6 h-full overflow-y-auto"
                  >
                    <h2 className="text-display mb-6 flex items-center gap-3">
                      <Leaf className="text-[var(--primary)]" />
                      Urban Rewilding Projects
                    </h2>
                    <div className="grid gap-4">
                      {data.rewildingProjects.map((project, i) => (
                        <RewildingCard key={project.id} project={project} delay={i * 0.1} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </section>

          {/* Right Panel - Telemetry Widgets */}
          <aside className="lg:col-span-4 space-y-4">
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-section mb-4 flex items-center gap-2">
                <Zap size={20} className="text-[var(--warning)]" />
                Live Telemetry
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                <TelemetryWidget
                  label="Global Temperature"
                  data={data.globalTemp}
                  delay={0.5}
                />
                <TelemetryWidget
                  label="CO₂ Level"
                  data={data.co2Level}
                  delay={0.6}
                />
                <TelemetryWidget
                  label="Ocean pH"
                  data={data.oceanPh}
                  delay={0.7}
                />
                <TelemetryWidget
                  label="Forest Cover"
                  data={data.forestCover}
                  delay={0.8}
                />
                <TelemetryWidget
                  label="Renewable Energy"
                  data={data.renewableEnergy}
                  delay={0.9}
                />
                <TelemetryWidget
                  label="Biodiversity Index"
                  data={data.biodiversityIndex}
                  delay={1.0}
                />
              </div>
            </motion.div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 glass-panel border-t border-b-0 rounded-none mx-0 mb-0">
        <div className="flex items-center justify-between px-6 py-3 text-xs text-mono text-[var(--foreground-muted)]">
          <div className="flex items-center gap-4">
            <span>LAST UPDATE: {new Date(data.timestamp).toLocaleTimeString()}</span>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline">DATA SOURCE: SIMULATED TELEMETRY</span>
          </div>
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-[var(--primary-glow)]"
            />
            <span>SYSTEM OPTIMAL</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
