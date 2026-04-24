import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  fetchProducts, fetchCategories, 
  createProduct, updateProduct, deleteProduct,
  createCategory, updateCategory, deleteCategory,
  fetchOrders, deleteOrder
} from '../services/api';

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
    if (token === '123456') { // Quick frontend simulation to unlock UI (Backend verifies security)
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
      
      // Always load categories for the product dropdown
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

      // Ensure arrays are parsed
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
    if(!window.confirm("Are you sure?")) return;
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
      <main className="min-h-screen flex items-center justify-center bg-background px-6 pt-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-surface-container-high p-8 rounded-3xl border border-white/10 shadow-2xl">
          <div className="text-center mb-8">
            <span className="material-symbols-outlined text-5xl text-primary mb-4">admin_panel_settings</span>
            <h1 className="text-3xl font-black uppercase tracking-tighter">Admin Portal</h1>
            <p className="text-on-surface-variant text-sm">Restricted Access (/hidden)</p>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input 
              type="password" 
              placeholder="Enter Admin Password" 
              className="bg-surface-container py-4 px-6 rounded-xl outline-none focus:ring-2 focus:ring-primary border border-white/5 transition-all text-center tracking-widest font-bold"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            <button className="bg-primary text-on-primary py-4 rounded-xl font-black uppercase tracking-widest hover:scale-105 transition-transform">
              Unlock Terminal
            </button>
          </form>
        </motion.div>
      </main>
    );
  }

  // --- RENDER DASHBOARD ---
  return (
    <main className="min-h-screen pt-32 pb-20 px-6 max-w-[1920px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-surface-container-low p-6 rounded-3xl border border-white/5 shadow-xl">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-5xl text-primary">database</span>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">Command Center</h1>
            <p className="text-on-surface-variant text-sm font-bold tracking-widest text-primary">AUTHORIZED SESSION</p>
          </div>
        </div>
        <div className="flex gap-4 p-2 bg-surface-container rounded-xl">
          <button onClick={() => setView('products')} className={`px-6 py-2 rounded-lg font-bold uppercase tracking-widest transition-colors ${view === 'products' ? 'bg-primary text-on-primary' : 'hover:bg-white/5'}`}>Products</button>
          <button onClick={() => setView('categories')} className={`px-6 py-2 rounded-lg font-bold uppercase tracking-widest transition-colors ${view === 'categories' ? 'bg-primary text-on-primary' : 'hover:bg-white/5'}`}>Categories</button>
          <button onClick={() => setView('orders')} className={`px-6 py-2 rounded-lg font-bold uppercase tracking-widest transition-colors ${view === 'orders' ? 'bg-primary text-on-primary' : 'hover:bg-white/5'}`}>Orders</button>
        </div>
      </div>

      {loading && !isEditing ? (
        <div className="flex justify-center p-20"><div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-surface-container-high rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
          {/* Table Header Controls */}
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <h2 className="text-xl font-black uppercase tracking-tight">{view} Table ({items.length})</h2>
            {view !== 'orders' && (
              <button onClick={() => openForm()} className="bg-secondary text-on-secondary px-6 py-3 rounded-lg flex items-center gap-2 font-bold uppercase hover:scale-105 transition-transform">
                <span className="material-symbols-outlined font-black">add</span> Add New
              </button>
            )}
          </div>

          {/* Table Graphics */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container font-black uppercase tracking-widest text-xs text-on-surface-variant">
                <tr>
                  <th className="p-4">ID</th>
                  {view === 'orders' ? (
                    <>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Contact</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Items</th>
                    </>
                  ) : (
                    <>
                      <th className="p-4">Name (EN/AR/FR)</th>
                      {view === 'products' && <th className="p-4">Price / Brand / Stock</th>}
                      {view === 'categories' && <th className="p-4">Icon / Order</th>}
                    </>
                  )}
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {items.map(item => (
                    <motion.tr key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                      <td className="p-4 font-mono text-sm text-primary">{item.id}</td>
                      
                      {view === 'orders' ? (
                        <>
                          <td className="p-4">
                            <div className="font-bold">{item.full_name}</div>
                            <div className="text-xs text-on-surface-variant">{item.city} | {item.address}</div>
                          </td>
                          <td className="p-4 text-sm">{item.phone}</td>
                          <td className="p-4 font-black text-secondary">{item.total} DH</td>
                          <td className="p-4">
                            <div className="max-h-20 overflow-y-auto space-y-1">
                              {item.items?.map((oi, idx) => (
                                <div key={idx} className="text-[10px] leading-tight">
                                  {oi.quantity}x {oi.product_name} ({oi.flavor || 'Universal'})
                                </div>
                              ))}
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="p-4 font-bold">
                            <div>{item.name_en}</div>
                            <div className="text-xs text-on-surface-variant">{item.name_ar} | {item.name_fr}</div>
                          </td>
                          {view === 'products' && (
                            <td className="p-4">
                              <div className="text-secondary font-black">{item.price} DH</div>
                              <div className="text-xs">{item.brand} | Stock: <span className="text-primary font-bold">{item.stock || 0}</span></div>
                            </td>
                          )}
                          {view === 'categories' && (
                            <td className="p-4">
                              <span className="material-symbols-outlined text-lg mr-2">{item.icon}</span> 
                              <span className="font-mono text-xs opacity-50">Sort: {item.sort_order}</span>
                            </td>
                          )}
                        </>
                      )}

                      <td className="p-4 text-right space-x-2">
                        {view !== 'orders' && (
                          <button onClick={() => openForm(item)} className="p-2 bg-surface-container rounded hover:text-white transition-colors"><span className="material-symbols-outlined text-sm">edit</span></button>
                        )}
                        <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-900/30 text-red-400 rounded hover:bg-red-500 hover:text-white transition-colors"><span className="material-symbols-outlined text-sm">delete</span></button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* RENDER MODAL FORM */}
      <AnimatePresence>
        {isEditing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex justify-center items-center p-6 bg-background/80 backdrop-blur-sm overflow-y-auto">
            <motion.div initial={{ y: 50, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.95 }} className="w-full max-w-4xl bg-surface-container-highest p-8 rounded-3xl border border-white/10 shadow-2xl my-auto">
              
              <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                <h2 className="text-2xl font-black uppercase">{formData._isUpdate ? 'Edit' : 'Create'} {view.slice(0, -1)}</h2>
                <button onClick={() => setIsEditing(false)} className="material-symbols-outlined hover:text-primary">close</button>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Common Fields */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Unique ID</label>
                    <input disabled={formData._isUpdate} required type="text" className="w-full bg-surface-container p-3 rounded-lg" value={formData.id || ''} onChange={e => setFormData({...formData, id: e.target.value})} />
                  </div>
                  
                  {view === 'categories' && (
                    <>
                      <div className="space-y-2">
                         <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Material Icon</label>
                         <input required type="text" className="w-full bg-surface-container p-3 rounded-lg" value={formData.icon || ''} onChange={e => setFormData({...formData, icon: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Sort Order (Int)</label>
                         <input type="number" className="w-full bg-surface-container p-3 rounded-lg" value={formData.sort_order || 0} onChange={e => setFormData({...formData, sort_order: e.target.value})} />
                      </div>
                    </>
                  )}

                  {view === 'products' && (
                    <>
                      <div className="space-y-2">
                         <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Category</label>
                         <select required className="w-full bg-surface-container p-3 rounded-lg" value={formData.category_id || ''} onChange={e => setFormData({...formData, category_id: e.target.value})}>
                           <option value="">Select Category...</option>
                           {categories.map(c => <option key={c.id} value={c.id}>{c.name_en}</option>)}
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Brand</label>
                         <input required type="text" className="w-full bg-surface-container p-3 rounded-lg" value={formData.brand || ''} onChange={e => setFormData({...formData, brand: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Price</label>
                         <input required type="number" step="0.01" className="w-full bg-surface-container p-3 rounded-lg" value={formData.price || ''} onChange={e => setFormData({...formData, price: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Stock Quantity</label>
                         <input required type="number" className="w-full bg-surface-container p-3 rounded-lg" value={formData.stock || 0} onChange={e => setFormData({...formData, stock: e.target.value})} />
                      </div>
                    </>
                  )}
                </div>

                {/* Multilingual Names */}
                <div className="bg-surface-container-high p-6 rounded-2xl border border-white/5 mt-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-primary">Localization (Name)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input required placeholder="English Name" className="bg-surface-container p-3 rounded-lg" value={formData.name_en || ''} onChange={e => setFormData({...formData, name_en: e.target.value})} />
                    <input required placeholder="الاسم بالعربية" className="bg-surface-container p-3 rounded-lg text-right" dir="rtl" value={formData.name_ar || ''} onChange={e => setFormData({...formData, name_ar: e.target.value})} />
                    <input required placeholder="Nom Français" className="bg-surface-container p-3 rounded-lg" value={formData.name_fr || ''} onChange={e => setFormData({...formData, name_fr: e.target.value})} />
                  </div>
                </div>

                {/* Products Specifically need Descriptions and Arrays */}
                {view === 'products' && (
                  <>
                    <div className="bg-surface-container-high p-6 rounded-2xl border border-white/5">
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-primary">Localization (Description)</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <textarea placeholder="English Description" className="bg-surface-container p-3 rounded-lg h-24 text-sm" value={formData.description_en || ''} onChange={e => setFormData({...formData, description_en: e.target.value})} />
                        <textarea placeholder="الوصف بالعربية" className="bg-surface-container p-3 rounded-lg h-24 text-sm text-right" dir="rtl" value={formData.description_ar || ''} onChange={e => setFormData({...formData, description_ar: e.target.value})} />
                        <textarea placeholder="Description Français" className="bg-surface-container p-3 rounded-lg h-24 text-sm" value={formData.description_fr || ''} onChange={e => setFormData({...formData, description_fr: e.target.value})} />
                      </div>
                    </div>

                    <div className="space-y-4 border-t border-white/10 pt-4">
                      <div className="space-y-2">
                         <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant flex gap-2">Upload New Images <span className="text-primary italic normal-case tracking-normal">Cloudinary direct</span></label>
                         <input 
                            type="file" 
                            multiple 
                            accept="image/*"
                            className="w-full bg-surface-container p-3 rounded-lg text-xs" 
                            onChange={e => setSelectedFiles(Array.from(e.target.files))}
                         />
                         {selectedFiles.length > 0 && (
                           <div className="text-[10px] text-primary font-bold">
                             {selectedFiles.length} files selected
                           </div>
                         )}
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant flex gap-2">Existing Image URLs <span className="text-primary italic normal-case tracking-normal">comma separated</span></label>
                         <textarea className="w-full bg-surface-container p-3 rounded-lg text-xs font-mono" rows="2" value={formData.images || ''} onChange={e => setFormData({...formData, images: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant flex gap-2">Flavors / النكهات <span className="text-primary italic normal-case tracking-normal">comma separated</span></label>
                         <input className="w-full bg-surface-container p-3 rounded-lg text-xs" placeholder="Chocolate, Strawbery, Vanilla" value={formData.flavors || ''} onChange={e => setFormData({...formData, flavors: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant flex gap-2">Tags <span className="text-primary italic normal-case tracking-normal">comma separated</span></label>
                         <input className="w-full bg-surface-container p-3 rounded-lg text-xs" placeholder="Bestseller, High Protein, Pre-workout" value={formData.tags || ''} onChange={e => setFormData({...formData, tags: e.target.value})} />
                      </div>
                    </div>
                  </>
                )}

                <div className="flex justify-end pt-6">
                  <button type="submit" disabled={loading} className="bg-primary text-on-primary px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2">
                    {loading ? <span className="material-symbols-outlined animate-spin">sync</span> : <span className="material-symbols-outlined">save</span>}
                    Commit to Database
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
};

export default AdminDashboard;
