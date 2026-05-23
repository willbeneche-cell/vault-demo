"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CreditCard, Wallet, Send, ArrowDownToLine, ArrowUpFromLine, 
  Bitcoin, PiggyBank, Search, X, CheckCircle2, TrendingUp, Newspaper, ShieldCheck
} from "lucide-react";

// --- MOCK DATA ---
const MOCK_NEWS = [
  { id: 1, title: "Le Bitcoin franchit un nouveau seuil historique", time: "Il y a 10 min", type: "crypto" },
  { id: 2, title: "La FED annonce une baisse des taux d'intérêt", time: "Il y a 32 min", type: "finance" },
  { id: 3, title: "Ethereum 2.0 : Les frais de gaz au plus bas", time: "Il y a 1h", type: "crypto" },
  { id: 4, title: "Les marchés européens ouvrent dans le vert", time: "Il y a 2h", type: "finance" },
];

export default function VaultApp() {
  const [isMounted, setIsMounted] = useState(false);
  const [userName, setUserName] = useState("");
  const [balance, setBalance] = useState(2450.75);
  const [activeTab, setActiveTab] = useState("wallet");
  
  // Modals state
  const [showNamePrompt, setShowNamePrompt] = useState(true);
  const [showVaultPay, setShowVaultPay] = useState(false);
  const [payStatus, setPayStatus] = useState("idle"); // idle, processing, success

  useEffect(() => {
    setIsMounted(true);
    const storedName = localStorage.getItem("vault_username");
    if (storedName) {
      setUserName(storedName);
      setShowNamePrompt(false);
    }
  }, []);

  const handleSaveName = (name: string) => {
    if (!name.trim()) return;
    localStorage.setItem("vault_username", name);
    setUserName(name);
    setShowNamePrompt(false);
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans overflow-hidden flex flex-col">
      
      {/* 1. MODAL PREMIERE CONNEXION */}
      <AnimatePresence>
        {showNamePrompt && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-zinc-900 p-8 rounded-3xl w-full max-w-md border border-zinc-800 shadow-2xl"
            >
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center text-2xl font-black">V</div>
              </div>
              <h2 className="text-2xl font-bold text-center mb-2">Bienvenue sur Vault</h2>
              <p className="text-zinc-400 text-center mb-6">Comment devons-nous vous appeler ?</p>
              <input 
                type="text" 
                placeholder="Votre prénom..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors mb-4"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveName(e.currentTarget.value);
                }}
                id="nameInput"
              />
              <button 
                onClick={() => {
                  const input = document.getElementById("nameInput") as HTMLInputElement;
                  handleSaveName(input.value);
                }}
                className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-zinc-200 transition-colors"
              >
                Commencer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. VAULT PAY (Style Apple Pay) */}
      <AnimatePresence>
        {showVaultPay && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-zinc-900 w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl p-6 pb-12 sm:pb-6 border border-zinc-800 shadow-2xl relative"
            >
              <button onClick={() => setShowVaultPay(false)} className="absolute top-4 right-4 p-2 bg-zinc-800 rounded-full hover:bg-zinc-700">
                <X size={20} />
              </button>
              
              <div className="flex flex-col items-center mt-4">
                <div className="w-16 h-10 bg-white text-black rounded-md flex items-center justify-center font-black italic text-xl mb-6">
                  Vault
                </div>
                
                {payStatus === "idle" && (
                  <>
                    <h3 className="text-xl font-bold mb-1">Payer avec Vault</h3>
                    <p className="text-4xl font-light mb-8">45.00 €</p>
                    
                    <div className="w-full bg-zinc-800 rounded-2xl p-4 flex items-center gap-4 mb-8">
                      <div className="w-12 h-8 bg-gradient-to-r from-zinc-600 to-zinc-400 rounded flex items-center justify-center border border-zinc-500">
                        <span className="text-[10px] font-bold text-white">VISA</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Vault Card</p>
                        <p className="text-xs text-zinc-400">Solde: {balance.toFixed(2)} €</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setPayStatus("processing");
                        setTimeout(() => {
                          setBalance(b => b - 45);
                          setPayStatus("success");
                          setTimeout(() => {
                            setShowVaultPay(false);
                            setPayStatus("idle");
                          }, 2000);
                        }, 1500);
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 transition-colors"
                    >
                      <ShieldCheck size={20} /> Double-cliquez pour payer
                    </button>
                  </>
                )}

                {payStatus === "processing" && (
                  <div className="py-12 flex flex-col items-center">
                    <motion.div 
                      animate={{ rotate: 360 }} transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
                      className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4"
                    />
                    <p className="text-zinc-400">Traitement en cours...</p>
                  </div>
                )}

                {payStatus === "success" && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="py-12 flex flex-col items-center">
                    <CheckCircle2 size={64} className="text-green-500 mb-4" />
                    <p className="text-xl font-bold">Paiement Réussi</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <header className="p-6 flex justify-between items-center bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10 border-b border-zinc-900">
        <h1 className="text-2xl font-black tracking-tighter">VAULT</h1>
        <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center font-bold">
          {userName.charAt(0).toUpperCase() || "V"}
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24 max-w-2xl mx-auto w-full">
        
        {/* --- ONGLET ACCUEIL (ACTUS) --- */}
        {activeTab === "home" && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Newspaper className="text-blue-500"/> Actualités en temps réel</h2>
            <div className="space-y-4">
              {MOCK_NEWS.map(news => (
                <div key={news.id} className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer flex gap-4 items-center">
                  <div className={`p-3 rounded-full ${news.type === 'crypto' ? 'bg-orange-500/20 text-orange-500' : 'bg-green-500/20 text-green-500'}`}>
                    {news.type === 'crypto' ? <Bitcoin size={24} /> : <TrendingUp size={24} />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">{news.title}</h3>
                    <p className="text-xs text-zinc-500 mt-1">{news.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* --- ONGLET WALLET (CARTE & ACTIONS) --- */}
        {activeTab === "wallet" && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            
            {/* CARTE 3D INTERACTIVE */}
            <div className="perspective-1000 group cursor-pointer mb-8 relative w-full aspect-[1.58/1] max-w-[400px] mx-auto">
              <motion.div 
                className="w-full h-full relative preserve-3d transition-transform duration-700 group-hover:rotate-y-180"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Face Avant */}
                <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-zinc-800 via-zinc-900 to-black rounded-2xl p-6 shadow-2xl border border-zinc-700 flex flex-col justify-between" style={{ backfaceVisibility: "hidden" }}>
                  <div className="flex justify-between items-start">
                    <span className="font-black italic text-xl">Vault</span>
                    <Search size={24} className="text-zinc-400 rotate-90" /> {/* Simule l'icône sans contact */}
                  </div>
                  <div>
                    <p className="text-zinc-400 text-sm mb-1">Solde actuel</p>
                    <p className="text-3xl font-light tracking-wider">{balance.toFixed(2)} €</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <p className="font-medium tracking-widest uppercase">{userName || "USER"}</p>
                    <span className="font-bold text-lg italic">VISA</span>
                  </div>
                </div>

                {/* Face Arrière */}
                <div className="absolute w-full h-full backface-hidden bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 flex flex-col justify-center" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                  <div className="w-full h-12 bg-black mb-4"></div>
                  <div className="px-6 flex justify-end">
                    <div className="bg-zinc-200 text-black px-2 py-1 italic font-bold w-16 text-center text-sm rounded">123</div>
                  </div>
                  <p className="text-zinc-600 text-xs text-center mt-4 px-4">Carte émise par Vault Inc. Simulateur non officiel.</p>
                </div>
              </motion.div>
            </div>

            {/* BOUTONS D'ACTION */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button onClick={() => setBalance(b => b - 50)} className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-colors">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white"><ArrowUpFromLine size={20} /></div>
                <span className="font-medium text-sm">Withdraw</span>
              </button>
              <button onClick={() => setBalance(b => b + 100)} className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-colors">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white"><ArrowDownToLine size={20} /></div>
                <span className="font-medium text-sm">Add</span>
              </button>
            </div>

            {/* BOUTON VAULT PAY */}
            <button 
              onClick={() => setShowVaultPay(true)}
              className="w-full bg-white hover:bg-zinc-200 text-black py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg transition-colors mb-6 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              <ShieldCheck size={24} /> Payer avec Vault Pay
            </button>

            {/* OPTIONS SUPPLEMENTAIRES */}
            <div className="grid grid-cols-2 gap-4">
              <button className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center gap-3 hover:bg-zinc-800 transition-colors">
                <Bitcoin className="text-orange-500" />
                <span className="text-sm font-medium">Crypto</span>
              </button>
              <button className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center gap-3 hover:bg-zinc-800 transition-colors">
                <PiggyBank className="text-pink-500" />
                <span className="text-sm font-medium">Épargner</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* --- ONGLET CONTACTS (VIREMENTS) --- */}
        {activeTab === "contacts" && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-2xl font-bold mb-6">Envoyer ou Demander</h2>
            
            <div className="relative mb-8">
              <Search className="absolute left-4 top-3.5 text-zinc-500" size={20} />
              <input 
                type="text" 
                placeholder="Rechercher un @utilisateur..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                onChange={(e) => {
                  const val = document.getElementById("searchResult");
                  if (val) val.style.opacity = e.target.value.length > 2 ? "1" : "0";
                }}
              />
            </div>

            {/* Résultat de recherche simulé */}
            <div id="searchResult" className="opacity-0 transition-opacity duration-300">
              <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 text-center">
                <div className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold shadow-lg">
                  A
                </div>
                <h3 className="font-bold text-xl mb-1">Alexandre M.</h3>
                <p className="text-zinc-500 text-sm mb-6">@alex_vault</p>
                
                <div className="flex gap-4">
                  <button 
                    onClick={() => { alert("50€ envoyés !"); setBalance(b => b - 50); }}
                    className="flex-1 bg-white text-black py-3 rounded-xl font-bold hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Send size={18} /> Envoyer 50€
                  </button>
                  <button 
                    onClick={() => { alert("Demande de 50€ acceptée !"); setBalance(b => b + 50); }}
                    className="flex-1 bg-zinc-800 text-white py-3 rounded-xl font-bold hover:bg-zinc-700 transition-colors"
                  >
                    Demander 50€
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

      </main>

      {/* BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 w-full bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-900 pb-safe pt-2 px-6 flex justify-around sm:justify-center sm:gap-16 pb-6">
        <button onClick={() => setActiveTab("home")} className={`flex flex-col items-center p-2 transition-colors ${activeTab === 'home' ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'}`}>
          <Newspaper size={24} className="mb-1" />
          <span className="text-[10px] font-medium">Accueil</span>
        </button>
        <button onClick={() => setActiveTab("wallet")} className={`flex flex-col items-center p-2 transition-colors ${activeTab === 'wallet' ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'}`}>
          <Wallet size={24} className="mb-1" />
          <span className="text-[10px] font-medium">Carte</span>
        </button>
        <button onClick={() => setActiveTab("contacts")} className={`flex flex-col items-center p-2 transition-colors ${activeTab === 'contacts' ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'}`}>
          <Send size={24} className="mb-1" />
          <span className="text-[10px] font-medium">Transferts</span>
        </button>
      </nav>
      
      {/* Configuration CSS Globale requise pour la 3D */}
      <style dangerouslySetInnerHTML={{__html: `
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .perspective-1000 { perspective: 1000px; }
        .pb-safe { padding-bottom: env(safe-area-inset-bottom, 24px); }
      `}} />
    </div>
  );
}