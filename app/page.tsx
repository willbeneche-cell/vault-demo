"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CreditCard, Wallet, Send, ArrowDownToLine, ArrowUpFromLine, 
  Bitcoin, PiggyBank, Search, X, CheckCircle2, TrendingUp, Newspaper, ShieldCheck,
  History, BarChart3, ArrowUpRight, Scale, Activity, Percent, Layers
} from "lucide-react";

// --- EXPANDED INITIAL DATA POOLS ---
const NEWS_POOL = [
  { title: "Rumeurs d'un ETF Solana imminent validé par la SEC", type: "crypto" },
  { title: "L'inflation sous-jacente en zone euro baisse plus vite que prévu", type: "finance" },
  { title: "Un wallet endormi depuis 2011 contenant 500 BTC vient de se réactiver", type: "crypto" },
  { title: "Apple annonce l'intégration native de nœuds de validation de consensus", type: "finance" },
  { title: "Le hashrate mondial du Bitcoin atteint une puissance record", type: "crypto" },
  { title: "Les liquidations de positions short s'élèvent à 120M$ en 1h", type: "crypto" },
  { title: "La Banque Centrale annonce une pause sur la hausse des taux obligataires", type: "finance" }
];

const INITIAL_MARKETS = [
  { id: "poly_1", question: "Le Bitcoin dépassera-t-il les 120 000 € avant la fin du mois ?", yesPrice: 0.64, noPrice: 0.36, volume: "1,2M €", category: "Crypto" },
  { id: "poly_2", question: "La FED va-t-elle réduire ses taux directeurs de 50 points de base ?", yesPrice: 0.42, noPrice: 0.58, volume: "840K €", category: "Macro" },
  { id: "poly_3", question: "Ethereum va-t-il enregistrer de meilleurs rendements mensuels que Solana ?", yesPrice: 0.28, noPrice: 0.72, volume: "410K €", category: "Tech" },
];

export default function VaultApp() {
  const [isMounted, setIsMounted] = useState(false);
  const [userName, setUserName] = useState("");
  const [balance, setBalance] = useState(2450.75);
  const [savings, setSavings] = useState(0);
  const [portfolio, setPortfolio] = useState({ BTC: 0, ETH: 0, SOL: 0 });
  const [activeTab, setActiveTab] = useState("wallet");
  
  // Advanced State Arrays
  const [history, setHistory] = useState<any[]>([]);
  const [newsList, setNewsList] = useState<any[]>([
    { id: 1, title: "Le Bitcoin franchit un nouveau seuil historique", time: "Il y a 2 min", type: "crypto" },
    { id: 2, title: "La FED annonce une baisse des taux d'intérêt", time: "Il y a 10 min", type: "finance" },
  ]);
  const [predictionMarkets, setPredictionMarkets] = useState(INITIAL_MARKETS);
  const [userBets, setUserBets] = useState<any[]>([]);

  // Crypto Dynamics
  const [rates, setRates] = useState({ BTC: 95240, ETH: 3410, SOL: 182.50 });
  const [rateTrends, setRateTrends] = useState({ BTC: "+2.4%", ETH: "-0.8%", SOL: "+11.3%" });

  // Modals state
  const [showNamePrompt, setShowNamePrompt] = useState(true);
  const [showVaultPay, setShowVaultPay] = useState(false);
  const [payStatus, setPayStatus] = useState("idle");
  const [actionModal, setActionModal] = useState<{ type: "add" | "withdraw" | "crypto" | "savings" | "bet" | null, payload?: any }>({ type: null });
  
  // Interactive Controls
  const [inputAmount, setInputAmount] = useState("");
  const [vaultPayAmount, setVaultPayAmount] = useState("45.00");
  const [searchQuery, setSearchQuery] = useState("");
  const [contactAmount, setContactAmount] = useState("50");
  const [selectedCrypto, setSelectedCrypto] = useState<"BTC" | "ETH" | "SOL">("BTC");
  const [selectedOutcome, setSelectedOutcome] = useState<"YES" | "NO">("YES");
  const [savingsAutoRoundUp, setSavingsAutoRoundUp] = useState(false);

  // 1. INITIAL LOAD & PERSISTENCE
  useEffect(() => {
    setIsMounted(true);
    const storedName = localStorage.getItem("vault_username");
    if (storedName) { setUserName(storedName); setShowNamePrompt(false); }
    
    if (localStorage.getItem("vault_balance")) setBalance(parseFloat(localStorage.getItem("vault_balance")!));
    if (localStorage.getItem("vault_savings")) setSavings(parseFloat(localStorage.getItem("vault_savings")!));
    if (localStorage.getItem("vault_portfolio")) setPortfolio(JSON.parse(localStorage.getItem("vault_portfolio")!));
    if (localStorage.getItem("vault_history")) setHistory(JSON.parse(localStorage.getItem("vault_history")!));
    if (localStorage.getItem("vault_bets")) setUserBets(JSON.parse(localStorage.getItem("vault_bets")!));
    if (localStorage.getItem("vault_roundup")) setSavingsAutoRoundUp(localStorage.getItem("vault_roundup") === "true");
  }, []);

  // 2. LIVE SIMULATIONS ENGINE (News & Organic Prices)
  useEffect(() => {
    if (!isMounted) return;

    // Organic market prices ticker updates every 4 seconds
    const marketTicker = setInterval(() => {
      setRates(prev => {
        const nextBtc = prev.BTC + (Math.random() * 160 - 80);
        const nextEth = prev.ETH + (Math.random() * 8 - 4);
        const nextSol = prev.SOL + (Math.random() * 1.2 - 0.6);
        return { BTC: +nextBtc.toFixed(2), ETH: +nextEth.toFixed(2), SOL: +nextSol.toFixed(2) };
      });
    }, 4000);

    // Automated news generation machine every 9 seconds
    const newsTicker = setInterval(() => {
      const rolledNews = NEWS_POOL[Math.floor(Math.random() * NEWS_POOL.length)];
      setNewsList(prev => [
        { id: Date.now(), title: rolledNews.title, time: "À l'instant", type: rolledNews.type },
        ...prev.slice(0, 6)
      ]);
    }, 9000);

    // Compound Interest Simulator (Real-time APY calculation over micro-intervals)
    const yieldEngine = setInterval(() => {
      setSavings(currentSavings => {
        if (currentSavings <= 0) return currentSavings;
        const interestPerSecond = currentSavings * (0.0425 / (365 * 24 * 3600));
        const finalSavings = currentSavings + interestPerSecond;
        localStorage.setItem("vault_savings", finalSavings.toString());
        return finalSavings;
      });
    }, 1000);

    return () => {
      clearInterval(marketTicker);
      clearInterval(newsTicker);
      clearInterval(yieldEngine);
    };
  }, [isMounted]);

  // PERSISTENCE MUTATION WRAPPERS
  const saveBalance = (val: number) => { setBalance(val); localStorage.setItem("vault_balance", val.toString()); };
  const saveSavings = (val: number) => { setSavings(val); localStorage.setItem("vault_savings", val.toString()); };
  const savePortfolio = (val: typeof portfolio) => { setPortfolio(val); localStorage.setItem("vault_portfolio", JSON.stringify(val)); };
  
  const logTransaction = (type: string, amount: number, details: string, status: "SUCCESS" | "PENDING" = "SUCCESS") => {
    const entry = {
      id: Math.random().toString(36).substring(2, 9).toUpperCase(),
      timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      date: "Aujourd'hui",
      type, amount, details, status
    };
    const nextHist = [entry, ...history];
    setHistory(nextHist);
    localStorage.setItem("vault_history", JSON.stringify(nextHist));
  };

  const handleSaveName = (name: string) => {
    if (!name.trim()) return;
    localStorage.setItem("vault_username", name);
    setUserName(name);
    setShowNamePrompt(false);
  };

  if (!isMounted) return null;

  // Calcul Global Portfolio Value
  const cryptoNetWorth = (portfolio.BTC * rates.BTC) + (portfolio.ETH * rates.ETH) + (portfolio.SOL * rates.SOL);

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans overflow-hidden flex flex-col">
      
      {/* --- MODAL CHOOSE USERNAME --- */}
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
                onKeyDown={(e) => { if (e.key === "Enter") handleSaveName(e.currentTarget.value); }}
                id="nameInput"
              />
              <button 
                onClick={() => { const input = document.getElementById("nameInput") as HTMLInputElement; handleSaveName(input.value); }}
                className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-zinc-200 transition-colors"
              >
                Commencer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- VAULT PAY SCREEN ENGINE --- */}
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
              <button onClick={() => { setShowVaultPay(false); setPayStatus("idle"); }} className="absolute top-4 right-4 p-2 bg-zinc-800 rounded-full hover:bg-zinc-700">
                <X size={20} />
              </button>
              
              <div className="flex flex-col items-center mt-4">
                <div className="w-16 h-10 bg-white text-black rounded-md flex items-center justify-center font-black italic text-xl mb-6">Vault</div>
                
                {payStatus === "idle" && (
                  <>
                    <h3 className="text-xl font-bold mb-1">Payer avec Vault</h3>
                    <div className="flex items-center gap-1 mb-6 mt-2 justify-center">
                      <input 
                        type="number" 
                        value={vaultPayAmount} 
                        onChange={(e) => setVaultPayAmount(e.target.value)}
                        className="text-4xl font-light bg-transparent border-b border-zinc-800 focus:border-white text-center w-36 focus:outline-none"
                      />
                      <span className="text-4xl font-light">€</span>
                    </div>
                    
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
                        const amt = parseFloat(vaultPayAmount) || 0;
                        if(amt > balance) { alert("Solde insuffisant !"); return;}
                        setPayStatus("processing");
                        setTimeout(() => {
                          let actualDebit = amt;
                          if(savingsAutoRoundUp) {
                            const nextWhole = Math.ceil(amt);
                            const diff = nextWhole - amt;
                            if(diff > 0 && diff < 1) {
                              actualDebit = nextWhole;
                              saveSavings(savings + diff);
                            }
                          }
                          saveBalance(balance - actualDebit);
                          logTransaction("VAULT PAY", amt, "Terminal marchand externe");
                          setPayStatus("success");
                          setTimeout(() => { setShowVaultPay(false); setPayStatus("idle"); }, 2000);
                        }, 1500);
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 transition-colors"
                    >
                      <ShieldCheck size={20} /> Confirmer la transaction
                    </button>
                  </>
                )}

                {payStatus === "processing" && (
                  <div className="py-12 flex flex-col items-center">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, ease: "linear", duration: 1 }} className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4" />
                    <p className="text-zinc-400">Sécurisation Vault-End...</p>
                  </div>
                )}

                {payStatus === "success" && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="py-12 flex flex-col items-center">
                    <CheckCircle2 size={64} className="text-green-500 mb-4" />
                    <p className="text-xl font-bold">Paiement Autorisé</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- ALL COMPLEX FEATURE INTERACTIVE MODALS --- */}
      <AnimatePresence>
        {actionModal.type && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-zinc-900 p-6 rounded-3xl w-full max-w-md border border-zinc-800 shadow-2xl relative"
            >
              <button onClick={() => { setActionModal({ type: null }); setInputAmount(""); }} className="absolute top-4 right-4 p-2 bg-zinc-800 rounded-full hover:bg-zinc-700">
                <X size={16} />
              </button>

              {/* RETRAIT / DEPOT STANDARD */}
              {(actionModal.type === "add" || actionModal.type === "withdraw") && (
                <div>
                  <h3 className="text-xl font-bold mb-4">{actionModal.type === "add" ? "Ajouter des fonds" : "Retirer vers banque externe"}</h3>
                  <div className="relative mb-6">
                    <input 
                      type="number" placeholder="Montant en €" value={inputAmount}
                      onChange={(e) => setInputAmount(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:border-white"
                    />
                  </div>
                  <button 
                    onClick={() => {
                      const val = parseFloat(inputAmount) || 0;
                      if(val <= 0) return;
                      if(actionModal.type === "withdraw" && val > balance) { alert("Solde insuffisant !"); return; }
                      
                      saveBalance(actionModal.type === "add" ? balance + val : balance - val);
                      logTransaction(actionModal.type === "add" ? "DEPOT" : "RETRAIT", val, "Compte connecté principal");
                      setActionModal({ type: null }); setInputAmount("");
                    }}
                    className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-zinc-200 transition-colors"
                  >
                    Valider l'opération
                  </button>
                </div>
              )}

              {/* ADVANCED CRYPTO MANAGEMENT SYSTEM */}
              {actionModal.type === "crypto" && (
                <div>
                  <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Bitcoin className="text-orange-500" /> Trading Spot</h3>
                  <div className="bg-zinc-950 p-3 rounded-2xl border border-zinc-800 text-xs mb-4 space-y-1">
                    <div className="flex justify-between text-zinc-400"><span>Bitcoin (BTC)</span><span className="font-mono text-white">{rates.BTC.toLocaleString()} €</span></div>
                    <div className="flex justify-between text-zinc-400"><span>Ethereum (ETH)</span><span className="font-mono text-white">{rates.ETH.toLocaleString()} €</span></div>
                    <div className="flex justify-between text-zinc-400"><span>Solana (SOL)</span><span className="font-mono text-white">{rates.SOL.toLocaleString()} €</span></div>
                  </div>
                  
                  <label className="text-xs text-zinc-400 block mb-1">Sélectionner l'actif</label>
                  <select 
                    value={selectedCrypto} onChange={(e) => setSelectedCrypto(e.target.value as any)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white mb-4 focus:outline-none"
                  >
                    <option value="BTC">Bitcoin (BTC)</option>
                    <option value="ETH">Ethereum (ETH)</option>
                    <option value="SOL">Solana (SOL)</option>
                  </select>

                  <label className="text-xs text-zinc-400 block mb-1">Montant de l'allocation (€)</label>
                  <div className="relative mb-2">
                    <input 
                      type="number" placeholder="0.00" value={inputAmount}
                      onChange={(e) => setInputAmount(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white"
                    />
                  </div>
                  
                  {inputAmount && (
                    <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-900 mb-6 flex justify-between items-center text-sm">
                      <span className="text-zinc-500">Estimation Reçue:</span>
                      <span className="text-emerald-400 font-bold">~{(parseFloat(inputAmount) / rates[selectedCrypto]).toFixed(6)} {selectedCrypto}</span>
                    </div>
                  )}

                  <button 
                    onClick={() => {
                      const val = parseFloat(inputAmount) || 0;
                      if(val <= 0) return;
                      if(val > balance) { alert("Solde de compte insuffisant !"); return; }
                      
                      const cryptoUnits = val / rates[selectedCrypto];
                      saveBalance(balance - val);
                      savePortfolio({ ...portfolio, [selectedCrypto]: portfolio[selectedCrypto] + cryptoUnits });
                      logTransaction(`ACHAT ${selectedCrypto}`, val, `Achat spot de ${cryptoUnits.toFixed(5)} ${selectedCrypto}`);
                      setActionModal({ type: null }); setInputAmount("");
                    }}
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
                  >
                    Exécuter l'ordre au prix du marché
                  </button>
                </div>
              )}

              {/* ADVANCED INTEREST SAVINGS VAULT MODAL */}
              {actionModal.type === "savings" && (
                <div>
                  <h3 className="text-xl font-bold mb-1 flex items-center gap-2"><PiggyBank className="text-pink-500" /> Smart Yield Vault</h3>
                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-2xl mb-4 text-center">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider">Taux de rendement actuel</p>
                    <p className="text-3xl font-black text-pink-500">4.25% APY</p>
                    <p className="text-[10px] text-zinc-400 mt-1">Gains capitalisés en temps réel chaque seconde</p>
                  </div>
                  
                  <div className="relative mb-6">
                    <input 
                      type="number" placeholder="Montant à allouer (€)" value={inputAmount}
                      onChange={(e) => setInputAmount(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white"
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    <button 
                      onClick={() => {
                        const val = parseFloat(inputAmount) || 0;
                        if(val <= 0) return; if(val > balance) { alert("Solde disponible insuffisant !"); return; }
                        saveBalance(balance - val); saveSavings(savings + val);
                        logTransaction("EPARGNE DEPOSIT", val, "Versement vers Smart Yield");
                        setActionModal({ type: null }); setInputAmount("");
                      }}
                      className="flex-1 bg-white text-black font-bold py-3 rounded-xl hover:bg-zinc-200"
                    >
                      Déposer
                    </button>
                    <button 
                      onClick={() => {
                        const val = parseFloat(inputAmount) || 0;
                        if(val <= 0) return; if(val > savings) { alert("Fonds d'épargne insuffisants !"); return; }
                        saveSavings(savings - val); saveBalance(balance + val);
                        logTransaction("EPARGNE RETRAIT", val, "Retrait depuis Smart Yield vers Balance");
                        setActionModal({ type: null }); setInputAmount("");
                      }}
                      className="flex-1 bg-zinc-800 border border-zinc-700 text-white font-bold py-3 rounded-xl hover:bg-zinc-700"
                    >
                      Retirer
                    </button>
                  </div>
                </div>
              )}

              {/* POLYMARKET BET SYSTEM PLACEMENT */}
              {actionModal.type === "bet" && actionModal.payload && (
                <div>
                  <h3 className="text-lg font-bold mb-2">Prendre une position</h3>
                  <p className="text-sm text-zinc-400 mb-4">{actionModal.payload.question}</p>
                  
                  <div className="flex gap-2 mb-4 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
                    <button 
                      onClick={() => setSelectedOutcome("YES")}
                      className={`flex-1 py-2 rounded-lg font-bold text-sm transition-colors ${selectedOutcome === 'YES' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-transparent text-zinc-400'}`}
                    >
                      OUI ({(actionModal.payload.yesPrice * 100).toFixed(0)}¢)
                    </button>
                    <button 
                      onClick={() => setSelectedOutcome("NO")}
                      className={`flex-1 py-2 rounded-lg font-bold text-sm transition-colors ${selectedOutcome === 'NO' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-transparent text-zinc-400'}`}
                    >
                      NON ({(actionModal.payload.noPrice * 100).toFixed(0)}¢)
                    </button>
                  </div>

                  <div className="relative mb-2">
                    <input 
                      type="number" placeholder="Montant de votre mise (€)" value={inputAmount}
                      onChange={(e) => setInputAmount(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white"
                    />
                  </div>

                  {inputAmount && (
                    <div className="p-3 bg-zinc-950 rounded-xl text-xs space-y-1 mb-6 text-zinc-400">
                      <div className="flex justify-between"><span>Nombre de Shares acquises :</span><span className="font-bold text-white">{(parseFloat(inputAmount) / (selectedOutcome === 'YES' ? actionModal.payload.yesPrice : actionModal.payload.noPrice)).toFixed(2)} parts</span></div>
                      <div className="flex justify-between"><span>Payout potentiel en cas de victoire :</span><span className="font-bold text-emerald-400">{(parseFloat(inputAmount) / (selectedOutcome === 'YES' ? actionModal.payload.yesPrice : actionModal.payload.noPrice) * 1.00).toFixed(2)} €</span></div>
                    </div>
                  )}

                  <button 
                    onClick={() => {
                      const val = parseFloat(inputAmount) || 0;
                      if(val <= 0) return; if(val > balance) { alert("Solde de compte insuffisant !"); return; }
                      
                      const finalPrice = selectedOutcome === 'YES' ? actionModal.payload.yesPrice : actionModal.payload.noPrice;
                      const acquiredShares = val / finalPrice;
                      
                      const newBet = {
                        id: Date.now(),
                        marketId: actionModal.payload.id,
                        question: actionModal.payload.question,
                        outcome: selectedOutcome,
                        shares: acquiredShares,
                        investment: val
                      };
                      
                      const updatedBets = [newBet, ...userBets];
                      setUserBets(updatedBets);
                      localStorage.setItem("vault_bets", JSON.stringify(updatedBets));
                      
                      saveBalance(balance - val);
                      logTransaction("PRED MARKET BET", val, `Contrat prédictif: ${selectedOutcome} sur marché #${actionModal.payload.id}`);
                      setActionModal({ type: null }); setInputAmount("");
                    }}
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-500 transition-colors"
                  >
                    Confirmer l'engagement contractuel
                  </button>
                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- STANDARD HEADER AREA --- */}
      <header className="p-6 flex justify-between items-center bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10 border-b border-zinc-900">
        <h1 className="text-2xl font-black tracking-tighter">VAULT</h1>
        <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center font-bold uppercase">
          {userName.charAt(0) || "V"}
        </div>
      </header>

      {/* --- CENTRAL MAIN VIEW ENGINE --- */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24 max-w-2xl mx-auto w-full">
        
        {/* TAB 1: ACTUALITES (WITH BACKEND POOL LIVE INJECTIONS) */}
        {activeTab === "home" && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Newspaper className="text-blue-500"/> Flux d'informations global</h2>
            <div className="space-y-4">
              {newsList.map(news => (
                <div key={news.id} className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer flex gap-4 items-center">
                  <div className={`p-3 rounded-full ${news.type === 'crypto' ? 'bg-orange-500/20 text-orange-500' : 'bg-green-500/20 text-green-500'}`}>
                    {news.type === 'crypto' ? <Bitcoin size={24} /> : <TrendingUp size={24} />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm sm:text-base leading-snug">{news.title}</h3>
                    <p className="text-xs text-zinc-500 mt-1 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> {news.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB 2: PORTFOLIO & MAIN CARDS MANAGEMENT */}
        {activeTab === "wallet" && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            
            {/* INTERACTIVE GLOW 3D CARD COMPONENT */}
            <div className="perspective-1000 group cursor-pointer mb-8 relative w-full aspect-[1.58/1] max-w-[400px] mx-auto">
              <motion.div className="w-full h-full relative preserve-3d transition-transform duration-700 group-hover:rotate-y-180" style={{ transformStyle: "preserve-3d" }}>
                <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-zinc-800 via-zinc-900 to-black rounded-2xl p-6 shadow-2xl border border-zinc-700 flex flex-col justify-between" style={{ backfaceVisibility: "hidden" }}>
                  <div className="flex justify-between items-start">
                    <span className="font-black italic text-xl">Vault</span>
                    <Search size={24} className="text-zinc-400 rotate-90" />
                  </div>
                  <div>
                    <p className="text-zinc-400 text-sm mb-1">Liquidités disponibles</p>
                    <p className="text-3xl font-light tracking-wider">{balance.toFixed(2)} €</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <p className="font-medium tracking-widest uppercase">{userName || "USER"}</p>
                    <span className="font-bold text-lg italic">VISA</span>
                  </div>
                </div>
                <div className="absolute w-full h-full backface-hidden bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 flex flex-col justify-center" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                  <div className="w-full h-12 bg-black mb-4"></div>
                  <div className="px-6 flex justify-end">
                    <div className="bg-zinc-200 text-black px-2 py-1 italic font-bold w-16 text-center text-sm rounded">489</div>
                  </div>
                  <p className="text-zinc-600 text-xs text-center mt-4 px-4">Vault Secure Cryptographic Protocol Simulation Engine.</p>
                </div>
              </motion.div>
            </div>

            {/* BASE TRANSACTION OPERATIONAL TRIGGERS */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button onClick={() => setActionModal({ type: "withdraw" })} className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-colors">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white"><ArrowUpFromLine size={20} /></div>
                <span className="font-medium text-sm">Retirer</span>
              </button>
              <button onClick={() => setActionModal({ type: "add" })} className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-colors">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white"><ArrowDownToLine size={20} /></div>
                <span className="font-medium text-sm">Alimenter</span>
              </button>
            </div>

            <button 
              onClick={() => setShowVaultPay(true)}
              className="w-full bg-white hover:bg-zinc-200 text-black py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg transition-colors mb-6 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              <ShieldCheck size={24} /> Activer Vault Pay
            </button>

            {/* HIGH END CRYPTO AND INTEREST OVERVIEWS */}
            <div className="space-y-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-orange-500/10 rounded-xl text-orange-500"><Bitcoin size={24} /></div>
                  <div>
                    <h4 className="font-bold text-sm">Portefeuille Crypto</h4>
                    <p className="text-xs text-zinc-400">BTC, ETH, SOL</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-sm">{cryptoNetWorth.toFixed(2)} €</p>
                  <button onClick={() => setActionModal({ type: "crypto" })} className="text-xs text-orange-400 font-semibold hover:underline mt-0.5 flex items-center gap-1">Trader <ArrowUpRight size={12} /></button>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-pink-500/10 rounded-xl text-pink-500"><PiggyBank size={24} /></div>
                    <div>
                      <h4 className="font-bold text-sm">Smart Yield Epargne</h4>
                      <p className="text-xs text-emerald-400 font-medium flex items-center gap-1"><Percent size={12}/> 4.25% APY Capitalisé</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-sm text-white">{savings.toFixed(4)} €</p>
                    <button onClick={() => setActionModal({ type: "savings" })} className="text-xs text-pink-400 font-semibold hover:underline mt-0.5">Gérer</button>
                  </div>
                </div>
                <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400">
                  <span>Arrondi automatique des achats</span>
                  <button 
                    onClick={() => { const nextState = !savingsAutoRoundUp; setSavingsAutoRoundUp(nextState); localStorage.setItem("vault_roundup", nextState.toString()); }}
                    className={`px-3 py-1 rounded-full font-bold transition-colors ${savingsAutoRoundUp ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' : 'bg-zinc-800 text-zinc-500'}`}
                  >
                    {savingsAutoRoundUp ? "ACTIF" : "INACTIF"}
                  </button>
                </div>
              </div>
            </div>

          </motion.div>
        )}

        {/* TAB 3: INVESTIR (POLYMARKET STYLE PREDICTION CONTRACTS ARCHITECTURE) */}
        {activeTab === "invest" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2"><Scale className="text-purple-500"/> Marchés Prédictifs</h2>
              <span className="text-xs bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800 text-zinc-400 flex items-center gap-1.5">
                <Activity size={12} className="text-purple-400 animate-pulse"/> Polymarket Engine
              </span>
            </div>

            <div className="space-y-4 mb-8">
              {predictionMarkets.map(m => (
                <div key={m.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full">{m.category}</span>
                    <span className="text-xs text-zinc-500">Vol: {m.volume}</span>
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base mb-4 leading-snug">{m.question}</h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => { setSelectedOutcome("YES"); setActionModal({ type: "bet", payload: m }); }}
                      className="bg-zinc-950 border border-zinc-800 hover:border-emerald-500/40 p-3 rounded-xl flex justify-between items-center transition-all group"
                    >
                      <span className="text-xs font-bold text-zinc-400 group-hover:text-emerald-400">Miser OUI</span>
                      <span className="font-mono text-sm font-black text-emerald-400">{(m.yesPrice * 100).toFixed(0)}¢</span>
                    </button>
                    <button 
                      onClick={() => { setSelectedOutcome("NO"); setActionModal({ type: "bet", payload: m }); }}
                      className="bg-zinc-950 border border-zinc-800 hover:border-red-500/40 p-3 rounded-xl flex justify-between items-center transition-all group"
                    >
                      <span className="text-xs font-bold text-zinc-400 group-hover:text-red-400">Miser NON</span>
                      <span className="font-mono text-sm font-black text-red-400">{(m.noPrice * 100).toFixed(0)}¢</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* LIVE OPEN ENGAGEMENTS */}
            {userBets.length > 0 && (
              <div>
                <h4 className="text-xs uppercase tracking-wider font-bold text-zinc-500 mb-3 flex items-center gap-1.5"><Layers size={14}/> Vos Positions Spéculatives Actives</h4>
                <div className="space-y-2">
                  {userBets.map(bet => (
                    <div key={bet.id} className="bg-zinc-950 border border-zinc-900 p-3 rounded-xl flex justify-between items-center text-xs">
                      <div className="max-w-[70%]">
                        <p className="font-medium truncate text-zinc-300">{bet.question}</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">Position: <span className={bet.outcome === 'YES' ? 'text-emerald-400' : 'text-red-400'}>{bet.outcome}</span> • {bet.shares.toFixed(1)} Contract Shares</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-zinc-300">{bet.investment.toFixed(2)} €</p>
                        <p className="text-[10px] text-zinc-500">Gains potentiels: {(bet.shares * 1.00).toFixed(1)}€</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 4: CONTACTS & PEER-TO-PEER INTERACTIVE GRIDS */}
        {activeTab === "contacts" && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-2xl font-bold mb-6">Réseau de transferts direct</h2>
            
            <div className="relative mb-8">
              <Search className="absolute left-4 top-3.5 text-zinc-500" size={20} />
              <input 
                type="text" placeholder="Rechercher un pseudonyme @id..." value={searchQuery}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <AnimatePresence>
              {searchQuery.trim().length > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 text-center">
                  <div className="w-20 h-20 bg-gradient-to-tr from-purple-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold shadow-lg uppercase">{searchQuery.charAt(0)}</div>
                  <h3 className="font-bold text-xl mb-1 capitalize">{searchQuery}</h3>
                  <p className="text-zinc-500 text-sm mb-4">@{searchQuery.toLowerCase().replace(/\s+/g, '')}_vault</p>
                  
                  <div className="max-w-[150px] mx-auto flex items-center gap-2 border-b border-zinc-800 focus-within:border-white mb-6">
                    <input 
                      type="number" value={contactAmount} onChange={(e) => setContactAmount(e.target.value)}
                      className="w-full bg-transparent text-center font-bold text-xl py-1 text-white focus:outline-none"
                    />
                    <span className="font-bold text-xl text-zinc-400">€</span>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => { 
                        const amt = parseFloat(contactAmount) || 0;
                        if(amt <= 0) return; if(amt > balance) { alert("Solde insuffisant !"); return; }
                        saveBalance(balance - amt); 
                        logTransaction("TRANSFERT EMIS", amt, `Virement direct vers @${searchQuery}`);
                        alert(`${amt}€ transférés instantanément !`); 
                      }}
                      className="flex-1 bg-white text-black py-3 rounded-xl font-bold hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <Send size={18} /> Transférer
                    </button>
                    <button 
                      onClick={() => { 
                        const amt = parseFloat(contactAmount) || 0; if(amt <= 0) return;
                        saveBalance(balance + amt); 
                        logTransaction("TRANSFERT RECU", amt, `Demande collectée depuis @${searchQuery}`);
                        alert(`Requête acceptée. ${amt}€ crédités !`); 
                      }}
                      className="flex-1 bg-zinc-800 text-white py-3 rounded-xl font-bold hover:bg-zinc-700 transition-colors"
                    >
                      Réclamer
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* TAB 5: CENTRAL AUDIT & REALTIME LOG TRANSACTION HISTORY PAGE */}
        {activeTab === "history" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><History className="text-zinc-400"/> Registre des Transactions</h2>
            
            {history.length === 0 ? (
              <div className="text-center py-12 bg-zinc-900 border border-zinc-800 rounded-3xl text-zinc-500 text-sm">
                Aucune transaction enregistrée sur ce terminal pour le moment.
              </div>
            ) : (
              <div className="space-y-3">
                {history.map(item => (
                  <div key={item.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex justify-between items-center">
                    <div>
                      <span className="text-[9px] font-mono tracking-widest text-zinc-500 bg-zinc-950 px-2 py-0.5 border border-zinc-800 rounded-md block w-max mb-1.5">{item.id}</span>
                      <h4 className="font-bold text-sm text-zinc-200">{item.type}</h4>
                      <p className="text-xs text-zinc-500 mt-0.5">{item.details}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-mono font-bold text-sm ${item.type.includes("RECU") || item.type.includes("DEPOT") ? 'text-emerald-400' : 'text-zinc-300'}`}>
                        {item.type.includes("RECU") || item.type.includes("DEPOT") ? "+" : "-"}{item.amount.toFixed(2)} €
                      </p>
                      <p className="text-[10px] text-zinc-500 mt-1">{item.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

      </main>

      {/* --- RECONSTRUCTED EXTENDED BOTTOM DOCK NAVIGATION --- */}
      <nav className="fixed bottom-0 w-full bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-900 pb-safe pt-2 px-2 flex justify-around pb-6 z-20">
        <button onClick={() => setActiveTab("home")} className={`flex flex-col items-center p-2 transition-colors ${activeTab === 'home' ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'}`}>
          <Newspaper size={22} className="mb-1" />
          <span className="text-[9px] font-medium">Accueil</span>
        </button>
        <button onClick={() => setActiveTab("wallet")} className={`flex flex-col items-center p-2 transition-colors ${activeTab === 'wallet' ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'}`}>
          <CreditCard size={22} className="mb-1" />
          <span className="text-[9px] font-medium">Carte</span>
        </button>
        <button onClick={() => setActiveTab("invest")} className={`flex flex-col items-center p-2 transition-colors ${activeTab === 'invest' ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'}`}>
          <BarChart3 size={22} className="mb-1" />
          <span className="text-[9px] font-medium">Investir</span>
        </button>
        <button onClick={() => setActiveTab("contacts")} className={`flex flex-col items-center p-2 transition-colors ${activeTab === 'contacts' ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'}`}>
          <Send size={22} className="mb-1" />
          <span className="text-[9px] font-medium">Transfert</span>
        </button>
        <button onClick={() => setActiveTab("history")} className={`flex flex-col items-center p-2 transition-colors ${activeTab === 'history' ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'}`}>
          <History size={22} className="mb-1" />
          <span className="text-[9px] font-medium">Historique</span>
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