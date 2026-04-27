import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  fetchProducts, fetchCategories, 
  createProduct, updateProduct, deleteProduct,
  createCategory, updateCategory, deleteCategory,
  fetchOrders, deleteOrder
} from '../services/api';
import { 
  LayoutDashboard, Package, ListTree, ShoppingCart, Plus, 
  Trash2, Edit, Save, X, Database, Lock, Search, Filter,
  Globe, Languages, Image as ImageIcon, Tag, Beer
} from 'lucide-react';

const AdminDashboard = () => {
  const [auth, setAuth] = useState(false);
  const [token, setToken] = useState('');
  
  const [view, setView] = useState('products'); // 'products', 'categories', or 'orders'
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // --- Auth & Data Loading ---
  const handleLogin = (e) => {
    e.preventDefault();
    if (token === '123456') {
      setAuth(true);
    } else {
      alert("Invalid Admin Password");
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      if (view === 'products') {
        const data = await fetchProducts();
        setItems(data);
      } else if (view === 'categories') {
        const data = await fetchCategories();
        setItems(data);
      } else {
        const data = await fetchOrders(token);
        setItems(data);
      }
      
      const cats = await fetchCategories();
      setCategories(cats);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (auth) loadData();
  }, [auth, view]);

  // --- CRUD Handlers ---
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const isUpdate = !!formData._isUpdate;
      const dataPayload = { ...formData };
      delete dataPayload._isUpdate;

      if (typeof dataPayload.images === 'string') dataPayload.images = dataPayload.images.split(',').map(s=>s.trim());
      if (typeof dataPayload.tags === 'string') dataPayload.tags = dataPayload.tags.split(',').map(s=>s.trim());
      if (typeof dataPayload.flavors === 'string') dataPayload.flavors = dataPayload.flavors.split(',').map(s=>s.trim());

      if (view === 'products') {
        const formDataObj = new FormData();
        Object.keys(dataPayload).forEach(key => {
          if (Array.isArray(dataPayload[key])) {
            formDataObj.append(key, JSON.stringify(dataPayload[key]));
          } else {
            formDataObj.append(key, dataPayload[key] || '');
          }
        });
        
        selectedFiles.forEach(file => {
          formDataObj.append('images', file);
        });

        if (isUpdate) await updateProduct(dataPayload.id, formDataObj, token);
        else await createProduct(formDataObj, token);
      } else {
        if (isUpdate) await updateCategory(dataPayload.id, dataPayload, token);
        else await createCategory(dataPayload, token);
      }
      
      setIsEditing(false);
      setFormData(null);
      await loadData();
    } catch (err) {
      alert("Error saving: " + err.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure? This cannot be undone.")) return;
    setLoading(true);
    try {
      if (view === 'products') await deleteProduct(id, token);
      else if (view === 'categories') await deleteCategory(id, token);
      else await deleteOrder(id, token);
      await loadData();
    } catch (err) {
      alert("Error deleting: " + err.message);
    }
    setLoading(false);
  };

  const openForm = (item = null) => {
    if (item) {
      setFormData({ ...item, _isUpdate: true, images: item.images?.join(', '), tags: item.tags?.join(', '), flavors: item.flavors?.join(', ') });
    } else {
      setFormData({ _isUpdate: false });
    }
    setSelectedFiles([]);
    setIsEditing(true);
  };

  // --- RENDER LOGIN ---
  if (!auth) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6 pt-24">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-white p-12 rounded-[40px] shadow-2xl border border-gray-100">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-primary">
              <Lock size={40} />
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-secondary">Admin Login</h1>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">Restricted Command Center</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Access Key</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-gray-50 py-5 px-8 rounded-2xl outline-none focus:ring-2 focus:ring-primary border border-gray-100 transition-all text-center tracking-[0.5em] font-black text-xl"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                autoFocus
              />
            </div>
            <button className="w-full bg-secondary text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-primary transition-all shadow-xl shadow-secondary/20">
              Access Terminal
            </button>
          </form>
        </motion.div>
      </main>
    );
  }

  // --- RENDER DASHBOARD ---
  return (
    <main className="min-h-screen bg-gray-50 pt-28 pb-20 px-4 md:px-8 max-w-[1600px] mx-auto">
      
      {/* Premium Dashboard Header */}
      <div className="bg-secondary rounded-[40px] p-8 md:p-12 mb-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-primary backdrop-blur-md">
              <Database size={32} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic">Command <span className="text-primary">Center</span></h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/50">System Operational | Admin Session</p>
              </div>
            </div>
          </div>

          <div className="flex p-1.5 bg-white/5 rounded-2xl backdrop-blur-md border border-white/10">
            {[
              { id: 'products', icon: <Package size={18} />, label: 'Products' },
              { id: 'categories', icon: <ListTree size={18} />, label: 'Categories' },
              { id: 'orders', icon: <ShoppingCart size={18} />, label: 'Orders' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setView(tab.id)} 
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${view === tab.id ? 'bg-primary text-white shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading && !isEditing ? (
        <div className="flex flex-col items-center justify-center p-32 gap-6">
           <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
           <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Fetching Data...</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[40px] shadow-xl border border-gray-100 overflow-hidden">
          {/* Table Header Controls */}
          <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-secondary">{view}</h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">{items.length} records found in database</p>
            </div>
            {view !== 'orders' && (
              <button onClick={() => openForm()} className="bg-primary text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-[11px] hover:scale-105 transition-all shadow-xl shadow-primary/20">
                <Plus size={18} /> Add {view.slice(0, -1)}
              </button>
            )}
          </div>

          {/* Premium Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">ID Reference</th>
                  {view === 'orders' ? (
                    <>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Customer Details</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Contact</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Revenue</th>
                    </>
                  ) : (
                    <>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Catalog Item</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Metadata</th>
                    </>
                  )}
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <AnimatePresence>
                  {items.map((item, idx) => (
                    <motion.tr 
                      key={`${item.id}-${idx}`} 
                      layout 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }}
                      className="hover:bg-gray-50/30 transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <span className="bg-gray-100 text-gray-400 px-3 py-1 rounded-lg text-[9px] font-mono font-bold">
                          #{item.id}
                        </span>
                      </td>
                      
                      {view === 'orders' ? (
                        <>
                          <td className="px-8 py-6">
                            <div className="font-black text-secondary uppercase text-sm tracking-tighter">{item.full_name}</div>
                            <div className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">{item.city}</div>
                          </td>
                          <td className="px-8 py-6 text-[11px] font-bold text-gray-500">{item.phone}</td>
                          <td className="px-8 py-6 text-center">
                            <span className="text-primary font-black text-lg italic">{item.total} <small className="text-[10px] uppercase font-bold not-italic">DH</small></span>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-8 py-6">
                            <div className="font-black text-secondary uppercase text-sm tracking-tighter">{item.name_en}</div>
                            <div className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest flex items-center gap-2">
                               <Globe size={10} /> {item.name_ar} | {item.name_fr}
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            {view === 'products' ? (
                              <div className="flex flex-col gap-1">
                                <span className="text-primary font-black text-sm">{item.price} DH</span>
                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Stock: <b className={item.stock < 5 ? 'text-red-500' : 'text-green-500'}>{item.stock}</b></span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-primary">
                                  <span className="material-symbols-outlined text-sm">{item.icon}</span>
                                </div>
                                <span className="text-[10px] font-black text-gray-400">ORDER: {item.sort_order}</span>
                              </div>
                            )}
                          </td>
                        </>
                      )}

                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          {view !== 'orders' && (
                            <button 
                              onClick={() => openForm(item)} 
                              className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-secondary hover:text-white transition-all shadow-sm"
                            >
                              <Edit size={16} />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDelete(item.id)} 
                            className="p-3 bg-gray-50 text-red-300 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* RENDER MODAL FORM - SOLID BACKGROUNDS */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[1000] flex justify-center items-center p-4 md:p-8">
            {/* SOLID Overlay */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsEditing(false)}
              className="absolute inset-0 bg-secondary/95 backdrop-blur-md"
            />
            
            {/* SOLID Modal Content */}
            <motion.div 
              initial={{ y: 50, opacity: 0, scale: 0.95 }} 
              animate={{ y: 0, opacity: 1, scale: 1 }} 
              exit={{ y: 20, opacity: 0, scale: 0.95 }} 
              className="relative w-full max-w-5xl bg-white rounded-[40px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white">
                    {formData._isUpdate ? <Edit size={24} /> : <Plus size={24} />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight text-secondary">
                      {formData._isUpdate ? 'Modify' : 'Create'} {view.slice(0, -1)}
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Database Entry Control</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsEditing(false)} 
                  className="w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-100 transition-all shadow-sm"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
                <form onSubmit={handleSave} className="space-y-10">
                  
                  {/* Grid Layout for Main Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                        <Tag size={12} className="text-primary" /> Unique Identifier
                      </label>
                      <input 
                        disabled={formData._isUpdate} 
                        required 
                        type="text" 
                        placeholder="e.g. whey-isolate-premium"
                        className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-primary transition-all font-bold text-secondary" 
                        value={formData.id || ''} 
                        onChange={e => setFormData({...formData, id: e.target.value})} 
                      />
                    </div>
                    
                    {view === 'categories' && (
                      <>
                        <div className="space-y-2">
                           <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                             <ImageIcon size={12} className="text-primary" /> Icon Name (Material)
                           </label>
                           <input required type="text" className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-primary transition-all font-bold text-secondary" value={formData.icon || ''} onChange={e => setFormData({...formData, icon: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                           <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                             <Filter size={12} className="text-primary" /> Priority Sort
                           </label>
                           <input type="number" className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-primary transition-all font-bold text-secondary" value={formData.sort_order || 0} onChange={e => setFormData({...formData, sort_order: e.target.value})} />
                        </div>
                      </>
                    )}

                    {view === 'products' && (
                      <>
                        <div className="space-y-2">
                           <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                             <ListTree size={12} className="text-primary" /> Category
                           </label>
                           <select required className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-primary transition-all font-bold text-secondary appearance-none" value={formData.category_id || ''} onChange={e => setFormData({...formData, category_id: e.target.value})}>
                             <option value="">Select Category...</option>
                             {categories.map(c => <option key={c.id} value={c.id}>{c.name_en}</option>)}
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                             <Beer size={12} className="text-primary" /> Brand Name
                           </label>
                           <input required type="text" className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-primary transition-all font-bold text-secondary" value={formData.brand || ''} onChange={e => setFormData({...formData, brand: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                           <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                             <Save size={12} className="text-primary" /> Price (MAD)
                           </label>
                           <input required type="number" step="0.01" className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-primary transition-all font-bold text-secondary text-xl" value={formData.price || ''} onChange={e => setFormData({...formData, price: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                           <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                             <Package size={12} className="text-primary" /> Stock Level
                           </label>
                           <input required type="number" className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-primary transition-all font-bold text-secondary" value={formData.stock || 0} onChange={e => setFormData({...formData, stock: e.target.value})} />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Multilingual Names */}
                  <div className="bg-gray-50 rounded-[32px] p-8 border border-gray-100">
                    <h3 className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] mb-6 text-secondary">
                      <Languages size={16} className="text-primary" /> Multilingual Titles
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block ml-2">English Title</label>
                        <input required className="w-full bg-white border border-gray-200 p-4 rounded-xl outline-none focus:border-primary transition-all font-bold text-secondary" value={formData.name_en || ''} onChange={e => setFormData({...formData, name_en: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mr-2 text-right">العنوان بالعربية</label>
                        <input required className="w-full bg-white border border-gray-200 p-4 rounded-xl outline-none focus:border-primary transition-all font-bold text-secondary text-right" dir="rtl" value={formData.name_ar || ''} onChange={e => setFormData({...formData, name_ar: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block ml-2">Titre Français</label>
                        <input required className="w-full bg-white border border-gray-200 p-4 rounded-xl outline-none focus:border-primary transition-all font-bold text-secondary" value={formData.name_fr || ''} onChange={e => setFormData({...formData, name_fr: e.target.value})} />
                      </div>
                    </div>
                  </div>

                  {/* Descriptions and Arrays for Products */}
                  {view === 'products' && (
                    <div className="space-y-10">
                      <div className="bg-gray-50 rounded-[32px] p-8 border border-gray-100">
                        <h3 className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] mb-6 text-secondary">
                          <Edit size={16} className="text-primary" /> Product Descriptions
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <textarea placeholder="English Description" className="w-full bg-white border border-gray-200 p-4 rounded-xl outline-none focus:border-primary transition-all font-bold text-secondary h-32 text-sm" value={formData.description_en || ''} onChange={e => setFormData({...formData, description_en: e.target.value})} />
                          <textarea placeholder="الوصف بالعربية" className="w-full bg-white border border-gray-200 p-4 rounded-xl outline-none focus:border-primary transition-all font-bold text-secondary h-32 text-sm text-right" dir="rtl" value={formData.description_ar || ''} onChange={e => setFormData({...formData, description_ar: e.target.value})} />
                          <textarea placeholder="Description Français" className="w-full bg-white border border-gray-200 p-4 rounded-xl outline-none focus:border-primary transition-all font-bold text-secondary h-32 text-sm" value={formData.description_fr || ''} onChange={e => setFormData({...formData, description_fr: e.target.value})} />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-4">
                           <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                             <ImageIcon size={14} className="text-primary" /> Media Assets
                           </label>
                           <div className="p-6 bg-gray-50 rounded-[32px] border border-dashed border-gray-200 space-y-4">
                             <input 
                                type="file" 
                                multiple 
                                accept="image/*"
                                className="w-full text-xs font-bold text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-primary file:text-white hover:file:bg-primary-dark cursor-pointer" 
                                onChange={e => setSelectedFiles(Array.from(e.target.files))}
                             />
                             {selectedFiles.length > 0 && (
                               <div className="flex gap-2 flex-wrap">
                                 {selectedFiles.map((f, i) => (
                                   <span key={i} className="bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full">{f.name}</span>
                                 ))}
                               </div>
                             )}
                             <div className="space-y-2">
                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-300">Remote URL History</p>
                                <textarea className="w-full bg-white border border-gray-200 p-4 rounded-xl outline-none focus:border-primary transition-all font-mono text-[10px] text-gray-400" rows="3" value={formData.images || ''} onChange={e => setFormData({...formData, images: e.target.value})} placeholder="https://..." />
                             </div>
                           </div>
                        </div>

                        <div className="space-y-6">
                           <div className="space-y-2">
                             <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                               <Beer size={14} className="text-primary" /> Product Flavors
                             </label>
                             <input className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-primary transition-all font-bold text-secondary" placeholder="Vanilla, Chocolate, Strawberry..." value={formData.flavors || ''} onChange={e => setFormData({...formData, flavors: e.target.value})} />
                           </div>
                           <div className="space-y-2">
                             <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                               <Tag size={14} className="text-primary" /> Search Tags
                             </label>
                             <input className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-primary transition-all font-bold text-secondary" placeholder="Bestseller, Protein, Gainer..." value={formData.tags || ''} onChange={e => setFormData({...formData, tags: e.target.value})} />
                           </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Modal Footer */}
                  <div className="flex justify-end pt-8 border-t border-gray-50 gap-4">
                    <button 
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs text-gray-400 hover:text-secondary transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={loading} 
                      className="bg-primary text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-primary-dark transition-all flex items-center gap-3 shadow-2xl shadow-primary/30"
                    >
                      {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save size={20} />}
                      Commit Changes
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f9fafb; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
      `}} />
    </main>
  );
};

export default AdminDashboard;
