import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { Trash2, Upload, Loader2, Plus, Tag, ImageIcon, X, FileImage } from 'lucide-react';

interface Category {
  id: number;
  name: string;
}

interface GalleryImage {
  id: number;
  image_url: string;
  title: string;
  category_id: number;
  categories: { name: string } | null;
}

const ManageGallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  // Multiple Files State
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [photoTitle, setPhotoTitle] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | string>('');
  const [isDragging, setIsDragging] = useState(false);
  
  const [newCatName, setNewCatName] = useState('');
  const [showCatManager, setShowCatManager] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: catData } = await supabase.from('categories').select('*').order('name');
    const { data: imgData } = await supabase
      .from('gallery_images')
      .select('*, categories(name)')
      .order('created_at', { ascending: false });
      
    if (catData) setCategories(catData);
    if (imgData) setImages(imgData as any);
    setLoading(false);
  };

  // Drag & Drop Handlers
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addCategory = async () => {
    if (!newCatName.trim()) return;
    const { error } = await supabase.from('categories').insert([{ name: newCatName.trim() }]);
    if (error) alert(error.message);
    else {
      setNewCatName('');
      fetchData();
    }
  };

  const deleteCategory = async (id: number) => {
    if (!confirm("Removing this category will delete all associated photos. Proceed?")) return;
    await supabase.from('categories').delete().eq('id', id);
    fetchData();
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0 || !selectedCategoryId || !photoTitle) {
        alert("Please provide a title, category, and at least one image.");
        return;
    }
    setUploading(true);

    try {
      for (const file of selectedFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `portfolio/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('gallery')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('gallery')
          .getPublicUrl(filePath);

        const { error: dbError } = await supabase
          .from('gallery_images')
          .insert([{ 
              image_url: publicUrl, 
              category_id: Number(selectedCategoryId),
              title: selectedFiles.length > 1 ? `${photoTitle} (${file.name})` : photoTitle 
          }]);

        if (dbError) throw dbError;
      }

      alert(`Successfully uploaded ${selectedFiles.length} photos!`);
      setPhotoTitle('');
      setSelectedFiles([]);
      setSelectedCategoryId('');
      fetchData();
    } catch (error: any) {
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (id: number) => {
    if (!confirm("Delete this photo?")) return;
    await supabase.from('gallery_images').delete().eq('id', id);
    fetchData();
  };

  if (loading) return <div style={{color: 'white', padding: '2rem'}}>Loading Manager...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', color: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
            <h1 style={{ fontFamily: 'Playfair Display', fontSize: '2.5rem', margin: 0 }}>Gallery Management</h1>
            <p style={{ color: '#666', margin: '5px 0 0 0' }}>Upload multiple photos and manage categories.</p>
        </div>
        <button 
            onClick={() => setShowCatManager(!showCatManager)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#222', border: '1px solid #444', color: 'white', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}
        >
            <Tag size={18} /> {showCatManager ? "Close Editor" : "Manage Categories"}
        </button>
      </div>

      {/* CATEGORY PANEL */}
      {showCatManager && (
        <div style={{ background: '#0a0a0a', border: '1px solid #ff4757', padding: '25px', borderRadius: '12px', marginBottom: '30px' }}>
            <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}><Tag size={18} color="#ff4757"/> Category Editor</h3>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input 
                    style={{ flex: 1, background: '#000', border: '1px solid #333', padding: '12px', borderRadius: '8px', color: 'white' }}
                    placeholder="New Category Name..."
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                />
                <button onClick={addCategory} style={{ background: '#ff4757', border: 'none', color: 'white', padding: '0 20px', borderRadius: '8px', cursor: 'pointer' }}><Plus size={20}/></button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {categories.map(cat => (
                    <div key={cat.id} style={{ background: '#1a1a1a', border: '1px solid #333', padding: '6px 15px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                        {cat.name}
                        <X size={14} style={{ cursor: 'pointer', color: '#ff4757' }} onClick={() => deleteCategory(cat.id)} />
                    </div>
                ))}
            </div>
        </div>
      )}

      {/* MULTI-UPLOAD & DRAG-DROP FORM */}
      <div style={{ background: '#0a0a0a', border: '1px solid #222', padding: '30px', borderRadius: '12px', marginBottom: '40px' }}>
        <h3 style={{ margin: '0 0 25px 0', display: 'flex', alignItems: 'center', gap: '10px' }}><ImageIcon size={18} color="#ff4757"/> Add Photos</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          {/* Metadata Inputs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#666', display: 'block', marginBottom: '8px' }}>Photo Title (Used for all files if multiple)</label>
              <input 
                  style={{ width: '100%', background: '#000', border: '1px solid #333', padding: '12px', borderRadius: '8px', color: 'white' }}
                  placeholder="e.g. Kerala Wedding Highlights"
                  value={photoTitle}
                  onChange={e => setPhotoTitle(e.target.value)}
              />
            </div>

            <div>
               <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#666', display: 'block', marginBottom: '8px' }}>Select Category</label>
               <select 
                  value={selectedCategoryId} 
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  style={{ width: '100%', background: '#000', border: '1px solid #333', padding: '12px', borderRadius: '8px', color: 'white' }}
               >
                 <option value="">Choose...</option>
                 {categories.map(cat => (
                     <option key={cat.id} value={cat.id}>{cat.name}</option>
                 ))}
               </select>
            </div>

            <button 
              onClick={handleUpload}
              disabled={uploading || selectedFiles.length === 0}
              style={{ 
                  background: uploading || selectedFiles.length === 0 ? '#333' : '#ff4757', 
                  border: 'none', color: 'white', padding: '14px', borderRadius: '8px', 
                  cursor: uploading || selectedFiles.length === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontWeight: 'bold', marginTop: 'auto'
              }}
            >
              {uploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
              {uploading ? `Uploading ${selectedFiles.length} files...` : `Upload ${selectedFiles.length} Photos`}
            </button>
          </div>

          {/* Drag & Drop Area */}
          <div 
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            style={{
              border: `2px dashed ${isDragging ? '#ff4757' : '#333'}`,
              background: isDragging ? 'rgba(255, 71, 87, 0.05)' : '#000',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              transition: '0.3s',
              minHeight: '200px',
              position: 'relative'
            }}
          >
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              onChange={handleFileSelect}
              style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
            />
            <FileImage size={40} color={isDragging ? '#ff4757' : '#666'} style={{ marginBottom: '10px' }} />
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#888' }}>
              Drag & Drop images here or <span style={{ color: '#ff4757' }}>browse</span>
            </p>
            
            {selectedFiles.length > 0 && (
              <div style={{ marginTop: '20px', width: '100%', maxHeight: '100px', overflowY: 'auto', display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                {selectedFiles.map((file, i) => (
                  <div key={i} style={{ background: '#222', padding: '4px 10px', borderRadius: '4px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
                    <X size={12} style={{ cursor: 'pointer', color: '#ff4757' }} onClick={(e) => { e.stopPropagation(); removeSelectedFile(i); }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PORTFOLIO GRID */}
      <h3 style={{ marginBottom: '20px' }}>Current Portfolio ({images.length})</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '25px' }}>
        {images.map((img) => (
          <div key={img.id} style={{ position: 'relative', aspectRatio: '1', background: '#111', borderRadius: '12px', overflow: 'hidden', border: '1px solid #222' }}>
            <img src={img.image_url} alt={img.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
            <div 
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: '0.3s' }} 
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'} 
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
            >
                <p style={{ fontSize: '0.8rem', fontWeight: 'bold', margin: '0 0 10px 0', padding: '0 10px', textAlign: 'center' }}>{img.title}</p>
                <button onClick={() => handleDeletePhoto(img.id)} style={{ background: '#ff4757', border: 'none', color: 'white', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}>
                    <Trash2 size={16} />
                </button>
            </div>
            <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(255, 71, 87, 0.9)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                {img.categories?.name || 'Uncategorized'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageGallery;