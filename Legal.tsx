import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, orderBy, limit, getDocs, doc, getDoc, updateDoc, where, addDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  CreditCard, 
  ShieldCheck, 
  ArrowLeft,
  Loader2,
  ExternalLink,
  Search,
  Edit2,
  Check,
  X,
  Target,
  Plus,
  Lock,
  Unlock,
  UserPlus
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface PaymentLog {
  id: string;
  email: string;
  productId: string;
  amount: number;
  status: string;
  timestamp: any;
}

interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  hasAccessPsychology?: boolean;
  hasAccessCameleon?: boolean;
  hasAccessAlgo?: boolean;
  isAlgoUser?: boolean;
  isSniper?: boolean;
  matricule?: string;
  whatsappLink?: string;
  zoomLink?: string;
  createdAt?: any;
  isManual?: boolean;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<PaymentLog[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [stats, setStats] = useState({ totalUsers: 0, totalRevenue: 0 });
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ email: "", displayName: "" });
  const [activeTab, setActiveTab] = useState<"transactions" | "users" | "quick-access">("users");
  const [quickAccess, setQuickAccess] = useState({ email: "", productId: "psychology" });
  const [isGivingAccess, setIsGivingAccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [logSnapshot, userSnapshot] = await Promise.all([
        getDocs(query(collection(db, "payment_logs"), orderBy("timestamp", "desc"), limit(50))),
        getDocs(query(collection(db, "users"), orderBy("createdAt", "desc"), limit(100)))
      ]);

      const fetchedLogs = logSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PaymentLog[];
      setLogs(fetchedLogs);

      const fetchedUsers = userSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserProfile[];
      
      console.log(`[Admin] Fetched ${fetchedUsers.length} users from Firestore`);
      
      // Sort in memory to handle missing createdAt fields gracefully
      const sortedUsers = fetchedUsers.sort((a, b) => {
        const dateA = a.createdAt?.seconds || (a.createdAt instanceof Date ? a.createdAt.getTime() : 0);
        const dateB = b.createdAt?.seconds || (b.createdAt instanceof Date ? b.createdAt.getTime() : 0);
        return dateB - dateA;
      });
      
      setUsers(sortedUsers);

      // Simple stats
      setStats({ totalUsers: userSnapshot.size, totalRevenue: fetchedLogs.reduce((acc, log) => acc + (log.amount || 0), 0) });
    } catch (err) {
      console.error("Error fetching admin data:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user || !isAdmin) {
        navigate("/espace-membre");
        return;
      }
      fetchData();
    }
  }, [user, isAdmin, authLoading, navigate]);

  const handleCreateAdminProfile = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const adminRef = doc(db, "users", user.uid);
      await setDoc(adminRef, {
        email: user.email?.toLowerCase().trim(),
        displayName: user.displayName || "Admin",
        role: "admin",
        createdAt: serverTimestamp(),
        hasAccessPsychology: true,
        hasAccessCameleon: true,
        hasAccessAlgo: true,
        isAlgoUser: true,
        isSniper: true,
        matricule: "ADMIN",
        isManual: false,
        whatsappLink: "",
        zoomLink: ""
      });

      const newAdminProfile = {
        id: user.uid,
        email: user.email?.toLowerCase().trim(),
        displayName: user.displayName || "Admin",
        role: "admin",
        createdAt: { seconds: Math.floor(Date.now() / 1000) },
        hasAccessPsychology: true,
        hasAccessCameleon: true,
        hasAccessAlgo: true,
        isAlgoUser: true,
        isSniper: true,
        matricule: "ADMIN",
        isManual: false
      } as UserProfile;

      setUsers(prev => [newAdminProfile, ...prev.filter(u => u.id !== user.uid)]);
      setStatusMessage({ type: "success", text: "Votre profil élève a été créé avec succès." });
      fetchData();
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      console.error("Error creating admin profile:", err);
      setStatusMessage({ type: "error", text: `Erreur : ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleGiveAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAccess.email || !quickAccess.productId) return;

    setIsGivingAccess(true);
    setStatusMessage(null);

    try {
      const emailSearch = quickAccess.email.toLowerCase().trim();
      
      // 1. Find User ID by Email
      const q = query(collection(db, "users"), where("email", "==", emailSearch));
      const snap = await getDocs(q);
      
      let targetUserId = "";
      let targetDisplayName = "";

      if (snap.empty) {
        // If user doesn't exist, create a manual profile first
        console.log("[Admin] User not found, creating manual profile for:", emailSearch);
        const newUserRef = doc(db, "users", emailSearch);
        targetUserId = emailSearch;
        targetDisplayName = emailSearch.split('@')[0];
        
        await setDoc(newUserRef, {
          email: emailSearch,
          displayName: targetDisplayName,
          createdAt: serverTimestamp(),
          role: "user",
          isManual: true,
          hasAccessPsychology: quickAccess.productId === "psychology",
          hasAccessCameleon: quickAccess.productId === "cameleon",
          hasAccessAlgo: quickAccess.productId === "algo_lifetime",
          isSniper: quickAccess.productId === "cameleon" || quickAccess.productId === "algo_lifetime",
          matricule: "",
          whatsappLink: "",
          zoomLink: ""
        });
      } else {
        const userDoc = snap.docs[0];
        targetUserId = userDoc.id;
        targetDisplayName = userDoc.data().displayName || emailSearch.split('@')[0];
        
        // Update access flags in Firestore
        let updateData: any = {};
        if (quickAccess.productId === "psychology") updateData.hasAccessPsychology = true;
        if (quickAccess.productId === "cameleon") {
          updateData.hasAccessCameleon = true;
          updateData.isSniper = true;
        }
        if (quickAccess.productId === "algo_lifetime") {
          updateData.hasAccessAlgo = true;
          updateData.isAlgoUser = true;
        }

        await updateDoc(doc(db, "users", targetUserId), updateData);
      }

      // 2. Call API to generate token & send email
      const response = await fetch("/api/generate-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: targetUserId,
          productId: quickAccess.productId
        }),
      });

      const data = await response.json();
      if (data.success) {
        setStatusMessage({ 
          type: "success", 
          text: `Accès donné à ${emailSearch} pour le produit ${quickAccess.productId}. Email envoyé !` 
        });
        setQuickAccess({ email: "", productId: "psychology" });
        fetchData(); // Refresh list
      } else {
        throw new Error(data.error || "Erreur lors de la génération du jeton");
      }
    } catch (err: any) {
      console.error("Error giving manual access:", err);
      setStatusMessage({ type: "error", text: `Erreur : ${err.message}` });
    } finally {
      setIsGivingAccess(false);
      setTimeout(() => setStatusMessage(null), 10000);
    }
  };

  const handleUpdateUser = async (updatedData: Partial<UserProfile>) => {
    if (!editingUser) return;
    try {
      const userRef = doc(db, "users", editingUser.id);
      await updateDoc(userRef, updatedData);
      
      // Update local state
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...updatedData } : u));
      setEditingUser(null);
      setStatusMessage({ type: "success", text: "Utilisateur mis à jour avec succès !" });
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err) {
      console.error("Error updating user:", err);
      setStatusMessage({ type: "error", text: "Erreur lors de la mise à jour." });
    }
  };

  const generateMatricule = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    const randomNumber = Math.floor(Math.random() * 99) + 1;
    return `Sniper ${randomLetter}${randomNumber}`;
  };

  const handleSearch = async () => {
    if (!searchEmail) return;
    setLoading(true);
    try {
      const emailSearch = searchEmail.toLowerCase().trim();
      const q = query(collection(db, "users"), where("email", "==", emailSearch));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const foundUser = { id: snap.docs[0].id, ...snap.docs[0].data() } as UserProfile;
        // Add to list if not already there
        if (!users.find(u => u.id === foundUser.id)) {
          setUsers([foundUser, ...users]);
        }
        setEditingUser(foundUser);
      } else {
        setStatusMessage({ type: "error", text: "Aucun utilisateur trouvé avec cet email." });
      }
    } catch (err) {
      console.error("Search error:", err);
    }
    setLoading(false);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.email) return;

    try {
      setLoading(true);
      const email = newUser.email.toLowerCase().trim();
      console.log("[Admin] Attempting to add user:", email);
      
      // Check if user already exists
      const q = query(collection(db, "users"), where("email", "==", email));
      const snap = await getDocs(q);
      
      if (!snap.empty) {
        console.log("[Admin] User already exists:", email);
        setStatusMessage({ type: "error", text: "Cet utilisateur existe déjà." });
        setLoading(false);
        return;
      }

      console.log("[Admin] Creating document in Firestore...");
      // Create a "pending" user document with email as ID for manual users
      // This makes it easier to manage and avoids random ID permission issues
      const userRef = doc(db, "users", email);
      await setDoc(userRef, {
        email,
        displayName: newUser.displayName || email.split('@')[0],
        createdAt: serverTimestamp(),
        role: "user",
        hasAccessPsychology: false,
        hasAccessCameleon: false,
        hasAccessAlgo: false,
        isAlgoUser: false,
        isSniper: false,
        isManual: true,
        matricule: "",
        whatsappLink: "",
        zoomLink: ""
      });
      console.log("[Admin] Document created with ID:", email);

      const addedUser = { 
        id: email, 
        email, 
        displayName: newUser.displayName || email.split('@')[0],
        createdAt: { seconds: Math.floor(Date.now() / 1000) }, // Temp date for sorting
        hasAccessPsychology: false,
        hasAccessCameleon: false,
        hasAccessAlgo: false,
        isSniper: false,
        isManual: true
      } as UserProfile;

      setUsers([addedUser, ...users]);
      setIsAddModalOpen(false);
      setNewUser({ email: "", displayName: "" });
      setStatusMessage({ type: "success", text: "Élève ajouté avec succès." });
      
      // Clear message after 3 seconds
      setTimeout(() => setStatusMessage(null), 3000);
      
      // Refresh to get real server timestamp and full data
      fetchData();
    } catch (err: any) {
      console.error("[Admin] Error adding user:", err);
      setStatusMessage({ type: "error", text: `Erreur : ${err.message || "Impossible d'ajouter l'élève"}` });
    } finally {
      setLoading(false);
    }
  };

  const toggleAccess = async (userId: string, field: keyof UserProfile, currentValue: boolean) => {
    try {
      const userRef = doc(db, "users", userId);
      const newValue = !currentValue;
      
      let updateData: any = { [field]: newValue };
      
      // Special logic for Sniper: generate matricule if activating and none exists
      if (field === "isSniper" && newValue) {
        const targetUser = users.find(u => u.id === userId);
        if (targetUser && !targetUser.matricule) {
          updateData.matricule = generateMatricule();
        }
      }

      await updateDoc(userRef, updateData);
      
      // Update local state
      setUsers(users.map(u => u.id === userId ? { ...u, ...updateData } : u));
    } catch (err) {
      console.error("Error toggling access:", err);
      setStatusMessage({ type: "error", text: "Erreur lors de la mise à jour." });
    }
  };

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(searchEmail.toLowerCase()) ||
    u.matricule?.toLowerCase().includes(searchEmail.toLowerCase())
  );

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ngt-black">
        <Loader2 className="animate-spin text-ngt-gold" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ngt-black pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="flex items-center gap-4">
            <Link to="/espace-membre" className="text-ngt-white/40 hover:text-ngt-gold transition-colors">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-4xl font-serif italic gold-text">Dashboard Administration</h1>
            {user && (
              <span className="text-[8px] text-ngt-white/20 uppercase tracking-widest">
                Connecté en tant que: {user.email} (Admin: {isAdmin ? "OUI" : "NON"})
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            {!users.some(u => u.email?.toLowerCase() === user?.email?.toLowerCase()) && (
              <button 
                onClick={handleCreateAdminProfile}
                className="flex items-center gap-2 px-4 py-2 bg-ngt-gold/10 text-ngt-gold border border-ngt-gold/20 text-[10px] uppercase tracking-widest font-bold hover:bg-ngt-gold/20 transition-all rounded-lg"
                title="Créer mon profil élève pour apparaître dans la liste"
              >
                <UserPlus size={14} />
                M'ajouter à la liste
              </button>
            )}

            <button 
              onClick={() => {
                setLoading(true);
                // Trigger useEffect re-run or just call fetchData
                window.location.reload();
              }}
              className="p-2 text-ngt-white/40 hover:text-ngt-gold transition-colors"
              title="Rafraîchir"
            >
              <Loader2 className={loading ? "animate-spin" : ""} size={20} />
            </button>
            
            <div className="flex bg-ngt-white/5 p-1 rounded-lg">
              <button 
                onClick={() => setActiveTab("transactions")}
                className={`px-6 py-2 text-[10px] uppercase tracking-widest font-bold transition-all ${activeTab === "transactions" ? "bg-ngt-gold text-ngt-black" : "text-ngt-white/40 hover:text-ngt-white"}`}
              >
                Transactions
              </button>
              <button 
                onClick={() => setActiveTab("users")}
                className={`px-6 py-2 text-[10px] uppercase tracking-widest font-bold transition-all ${activeTab === "users" ? "bg-ngt-gold text-ngt-black" : "text-ngt-white/40 hover:text-ngt-white"}`}
              >
                Élèves
              </button>
              <button 
                onClick={() => setActiveTab("quick-access")}
                className={`px-6 py-2 text-[10px] uppercase tracking-widest font-bold transition-all ${activeTab === "quick-access" ? "bg-ngt-gold text-ngt-black" : "text-ngt-white/40 hover:text-ngt-white"}`}
              >
                Donner Accès
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {statusMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-8 p-4 rounded-xl border flex items-center gap-3 ${
                statusMessage.type === "success" 
                  ? "bg-ngt-gold/10 border-ngt-gold/20 text-ngt-gold" 
                  : "bg-red-500/10 border-red-500/20 text-red-500"
              }`}
            >
              {statusMessage.type === "success" ? <Check size={18} /> : <X size={18} />}
              <p className="text-sm font-medium">{statusMessage.text}</p>
              <button onClick={() => setStatusMessage(null)} className="ml-auto opacity-50 hover:opacity-100">
                <X size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="p-8 border border-ngt-white/10 bg-ngt-white/[0.02]">
            <div className="flex items-center gap-3 mb-4 text-ngt-gold">
              <Users size={20} />
              <span className="text-[10px] uppercase tracking-widest">Élèves Totaux</span>
            </div>
            <div className="text-3xl font-serif">{stats.totalUsers}</div>
          </div>
          <div className="p-8 border border-ngt-white/10 bg-ngt-white/[0.02]">
            <div className="flex items-center gap-3 mb-4 text-ngt-gold">
              <CreditCard size={20} />
              <span className="text-[10px] uppercase tracking-widest">Revenu (20 derniers)</span>
            </div>
            <div className="text-3xl font-serif">{stats.totalRevenue}€</div>
          </div>
          <div className="p-8 border border-ngt-gold/20 bg-ngt-gold/[0.02]">
            <div className="flex items-center gap-3 mb-4 text-ngt-gold">
              <ShieldCheck size={20} />
              <span className="text-[10px] uppercase tracking-widest">Statut Sniper</span>
            </div>
            <div className="text-3xl font-serif text-ngt-gold">
              {users.filter(u => u.isSniper).length} Snipers
            </div>
          </div>
        </div>

        {activeTab === "transactions" ? (
          /* Recent Payments Table */
          <div className="border border-ngt-white/10 bg-ngt-white/[0.01] overflow-hidden">
            <div className="p-6 border-b border-ngt-white/10 bg-ngt-white/[0.02]">
              <h2 className="text-lg font-serif">Dernières Transactions</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] uppercase tracking-widest text-ngt-white/30 border-b border-ngt-white/10">
                    <th className="p-6">Date</th>
                    <th className="p-6">Email</th>
                    <th className="p-6">Produit</th>
                    <th className="p-6">Montant</th>
                    <th className="p-6">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b border-ngt-white/5 hover:bg-ngt-white/[0.02] transition-colors">
                      <td className="p-6 text-ngt-white/40">
                        {log.timestamp?.toDate().toLocaleDateString()}
                      </td>
                      <td className="p-6 font-medium">{log.email}</td>
                      <td className="p-6 text-ngt-gold uppercase text-[10px] tracking-wider">{log.productId}</td>
                      <td className="p-6">{log.amount}€</td>
                      <td className="p-6">
                        <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${
                          log.status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === "quick-access" ? (
          /* Quick Access Panel */
          <div className="max-w-2xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-10 border border-ngt-gold/30 bg-ngt-dark-gray rounded-[2rem] shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <ShieldCheck size={120} className="text-ngt-gold" />
              </div>

              <h2 className="text-2xl font-serif italic gold-text mb-8">Donner un accès manuel</h2>
              <p className="text-ngt-white/50 text-sm mb-10 leading-relaxed">
                Utilisez ce panneau pour accorder manuellement l'accès à une formation ou un pack. 
                Cela mettra à jour le profil de l'élève et lui enverra un email avec son lien de connexion sécurisé.
              </p>

              <form onSubmit={handleGiveAccess} className="space-y-8">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-ngt-white/30 block mb-3 font-bold">Email de l'élève</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ngt-white/20" size={20} />
                    <input 
                      type="email" 
                      required
                      placeholder="exemple@email.com"
                      value={quickAccess.email}
                      onChange={(e) => setQuickAccess({ ...quickAccess, email: e.target.value })}
                      className="w-full bg-ngt-black/40 border border-ngt-white/10 p-4 pl-12 text-sm focus:border-ngt-gold outline-none text-ngt-white transition-all rounded-xl shadow-inner"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-ngt-white/30 block mb-3 font-bold">Produit à débloquer</label>
                  <select 
                    value={quickAccess.productId}
                    onChange={(e) => setQuickAccess({ ...quickAccess, productId: e.target.value })}
                    className="w-full bg-ngt-black/40 border border-ngt-white/10 p-4 text-sm focus:border-ngt-gold outline-none text-ngt-white transition-all rounded-xl appearance-none cursor-pointer"
                  >
                    <option value="psychology">Psychologie du Trading (70€)</option>
                    <option value="cameleon">Plan Caméléon (500€)</option>
                    <option value="algo_lifetime">Algorithme Caméléon - À vie (1490€)</option>
                    <option value="full_pack">Pack Complet (Formation + Algo)</option>
                  </select>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={isGivingAccess || !quickAccess.email}
                    className="w-full py-5 bg-ngt-gold text-ngt-black text-xs uppercase tracking-[0.3em] font-extrabold gold-gradient hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-3 shadow-lg shadow-ngt-gold/10 rounded-2xl"
                  >
                    {isGivingAccess ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Traitement en cours...
                      </>
                    ) : (
                      <>
                        Donner l'accès <ShieldCheck size={20} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        ) : (
          /* User Management Section */
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex gap-2 w-full md:max-w-xl">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ngt-white/20" size={18} />
                  <input 
                    type="text" 
                    placeholder="Rechercher par email ou matricule..."
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full bg-ngt-white/5 border border-ngt-white/10 py-3 pl-12 pr-10 text-sm focus:border-ngt-gold outline-none transition-colors"
                  />
                  {searchEmail && (
                    <button 
                      onClick={() => setSearchEmail("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-ngt-white/20 hover:text-ngt-white"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                <button 
                  onClick={handleSearch}
                  className="px-6 py-3 bg-ngt-gold/10 text-ngt-gold text-[10px] uppercase tracking-widest font-bold hover:bg-ngt-gold/20 transition-colors border border-ngt-gold/20"
                >
                  Rechercher
                </button>
              </div>

              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-ngt-gold text-ngt-black text-[10px] uppercase tracking-widest font-bold gold-gradient hover:scale-[1.02] transition-transform"
              >
                <UserPlus size={16} /> Ajouter un élève
              </button>
            </div>

            <div className="border border-ngt-white/10 bg-ngt-white/[0.01] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[10px] uppercase tracking-widest text-ngt-white/30 border-b border-ngt-white/10">
                      <th className="p-6">Élève</th>
                      <th className="p-6">Psychologie</th>
                      <th className="p-6">Caméléon</th>
                      <th className="p-6">Algorithme</th>
                      <th className="p-6">Statut Sniper</th>
                      <th className="p-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-20 text-center">
                          <div className="flex flex-col items-center gap-4 text-ngt-white/20">
                            <Users size={48} />
                            <p className="text-sm">Aucun élève trouvé.</p>
                            {searchEmail && (
                              <button 
                                onClick={() => setSearchEmail("")}
                                className="text-ngt-gold text-[10px] uppercase tracking-widest hover:underline"
                              >
                                Effacer la recherche
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => (
                      <tr key={u.id} className="border-b border-ngt-white/5 hover:bg-ngt-white/[0.02] transition-colors">
                        <td className="p-6">
                          <div className="font-medium">{u.displayName || "Sans nom"}</div>
                          <div className="text-xs text-ngt-white/30">{u.email}</div>
                          {u.matricule && (
                            <div className="mt-1 text-[10px] text-ngt-gold font-bold uppercase tracking-widest">{u.matricule}</div>
                          )}
                        </td>
                        <td className="p-6">
                          <button
                            onClick={() => toggleAccess(u.id, "hasAccessPsychology", !!u.hasAccessPsychology)}
                            className={`flex items-center gap-2 px-3 py-1.5 text-[8px] uppercase font-bold tracking-widest transition-all border ${
                              u.hasAccessPsychology 
                                ? "bg-green-500/10 text-green-500 border-green-500/20" 
                                : "bg-ngt-white/5 text-ngt-white/20 border-ngt-white/10"
                            }`}
                          >
                            {u.hasAccessPsychology ? <Unlock size={10} /> : <Lock size={10} />}
                            {u.hasAccessPsychology ? "Déverrouillé" : "Verrouillé"}
                          </button>
                        </td>
                        <td className="p-6">
                          <button
                            onClick={() => toggleAccess(u.id, "hasAccessCameleon", !!u.hasAccessCameleon)}
                            className={`flex items-center gap-2 px-3 py-1.5 text-[8px] uppercase font-bold tracking-widest transition-all border ${
                              u.hasAccessCameleon 
                                ? "bg-green-500/10 text-green-500 border-green-500/20" 
                                : "bg-ngt-white/5 text-ngt-white/20 border-ngt-white/10"
                            }`}
                          >
                            {u.hasAccessCameleon ? <Unlock size={10} /> : <Lock size={10} />}
                            {u.hasAccessCameleon ? "Déverrouillé" : "Verrouillé"}
                          </button>
                        </td>
                        <td className="p-6">
                          <button
                            onClick={() => toggleAccess(u.id, "hasAccessAlgo", !!u.hasAccessAlgo)}
                            className={`flex items-center gap-2 px-3 py-1.5 text-[8px] uppercase font-bold tracking-widest transition-all border ${
                              u.hasAccessAlgo 
                                ? "bg-green-500/10 text-green-500 border-green-500/20" 
                                : "bg-ngt-white/5 text-ngt-white/20 border-ngt-white/10"
                            }`}
                          >
                            {u.hasAccessAlgo ? <Unlock size={10} /> : <Lock size={10} />}
                            {u.hasAccessAlgo ? "Déverrouillé" : "Verrouillé"}
                          </button>
                        </td>
                        <td className="p-6">
                          <button
                            onClick={() => toggleAccess(u.id, "isSniper", !!u.isSniper)}
                            className={`px-3 py-1.5 text-[8px] uppercase font-bold tracking-widest transition-all border flex items-center gap-2 ${
                              u.isSniper 
                                ? "bg-ngt-gold/10 text-ngt-gold border-ngt-gold/20" 
                                : "bg-ngt-white/5 text-ngt-white/20 border-ngt-white/10"
                            }`}
                          >
                            <Target size={10} />
                            {u.isSniper ? "Sniper" : "Membre"}
                          </button>
                        </td>
                        <td className="p-6">
                          <button 
                            onClick={() => setEditingUser(u)}
                            className="p-2 hover:bg-ngt-gold/10 text-ngt-white/40 hover:text-ngt-gold transition-colors rounded"
                            title="Modifier les liens WhatsApp/Zoom"
                          >
                            <Edit2 size={16} />
                          </button>
                        </td>
                      </tr>
                    )))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Add User Modal */}
        <AnimatePresence>
          {isAddModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAddModalOpen(false)}
                className="absolute inset-0 bg-ngt-black/80 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-md bg-ngt-black border border-ngt-white/10 p-8 shadow-2xl"
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-serif italic gold-text">Ajouter un élève</h2>
                  <button onClick={() => setIsAddModalOpen(false)} className="text-ngt-white/40 hover:text-ngt-white">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleAddUser} className="space-y-6">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-ngt-white/30 block mb-2">Email</label>
                    <input 
                      type="email" 
                      required
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      className="w-full bg-ngt-white/5 border border-ngt-white/10 p-4 text-sm focus:border-ngt-gold outline-none text-ngt-white"
                      placeholder="votre@email.com"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-ngt-white/30 block mb-2">Nom (Optionnel)</label>
                    <input 
                      type="text" 
                      value={newUser.displayName}
                      onChange={(e) => setNewUser({ ...newUser, displayName: e.target.value })}
                      className="w-full bg-ngt-white/5 border border-ngt-white/10 p-4 text-sm focus:border-ngt-gold outline-none text-ngt-white"
                      placeholder="Nom de l'élève"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-ngt-gold text-ngt-black text-[10px] uppercase tracking-widest font-bold gold-gradient hover:scale-[1.02] transition-transform disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Ajouter l'élève"}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Edit User Modal */}
        <AnimatePresence>
          {editingUser && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setEditingUser(null)}
                className="absolute inset-0 bg-ngt-black/80 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-ngt-black border border-ngt-white/10 p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-serif italic gold-text">Modifier l'Élève</h2>
                  <button onClick={() => setEditingUser(null)} className="text-ngt-white/40 hover:text-ngt-white">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-8">
                  {/* Basic Info */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-ngt-white/30 block mb-2">Email</label>
                      <div className="p-3 bg-ngt-white/5 border border-ngt-white/10 text-sm text-ngt-white/50">{editingUser.email}</div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-ngt-white/30 block mb-2">Matricule</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={editingUser.matricule || ""}
                          onChange={(e) => setEditingUser({ ...editingUser, matricule: e.target.value })}
                          className="flex-1 bg-ngt-white/5 border border-ngt-white/10 p-3 text-sm focus:border-ngt-gold outline-none"
                          placeholder="Ex: Sniper J12"
                        />
                        <button 
                          onClick={() => setEditingUser({ ...editingUser, matricule: generateMatricule() })}
                          className="p-3 bg-ngt-gold/10 text-ngt-gold hover:bg-ngt-gold/20 transition-colors"
                          title="Générer un matricule"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Access Toggles */}
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-ngt-white/30 block mb-4">Accès Formations</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { key: "hasAccessPsychology", label: "Psychologie" },
                        { key: "hasAccessCameleon", label: "Caméléon" },
                        { key: "hasAccessAlgo", label: "Algo" },
                        { key: "isSniper", label: "Statut Sniper" }
                      ].map((item) => (
                        <button
                          key={item.key}
                          onClick={() => setEditingUser({ ...editingUser, [item.key]: !editingUser[item.key as keyof UserProfile] })}
                          className={`flex flex-col items-center justify-center gap-2 p-4 border text-[10px] uppercase tracking-widest font-bold transition-all ${
                            editingUser[item.key as keyof UserProfile] 
                              ? "border-ngt-gold bg-ngt-gold/10 text-ngt-gold" 
                              : "border-ngt-white/10 bg-ngt-white/5 text-ngt-white/30"
                          }`}
                        >
                          {item.key.startsWith('hasAccess') ? (
                            editingUser[item.key as keyof UserProfile] ? <Unlock size={16} /> : <Lock size={16} />
                          ) : (
                            <Target size={16} />
                          )}
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sniper Links */}
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest text-ngt-white/30 block mb-2">Liens Exclusifs Sniper</label>
                    <div className="space-y-4">
                      <input 
                        type="text" 
                        placeholder="Lien WhatsApp"
                        value={editingUser.whatsappLink || ""}
                        onChange={(e) => setEditingUser({ ...editingUser, whatsappLink: e.target.value })}
                        className="w-full bg-ngt-white/5 border border-ngt-white/10 p-3 text-sm focus:border-ngt-gold outline-none"
                      />
                      <input 
                        type="text" 
                        placeholder="Lien Zoom"
                        value={editingUser.zoomLink || ""}
                        onChange={(e) => setEditingUser({ ...editingUser, zoomLink: e.target.value })}
                        className="w-full bg-ngt-white/5 border border-ngt-white/10 p-3 text-sm focus:border-ngt-gold outline-none"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={() => handleUpdateUser(editingUser)}
                    className="w-full py-4 bg-ngt-gold text-ngt-black text-xs uppercase tracking-widest font-bold gold-gradient flex items-center justify-center gap-2"
                  >
                    <Check size={16} /> Enregistrer les modifications
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
