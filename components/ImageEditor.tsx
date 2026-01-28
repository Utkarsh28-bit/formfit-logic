import React, { useState, useRef } from 'react';
import { ArrowLeft, Upload, Wand2, Loader2, Download, Image as ImageIcon, X } from 'lucide-react';
import { generateImageEdit } from '../services/geminiService';

interface Props {
  onBack: () => void;
}

const ImageEditor: React.FC<Props> = ({ onBack }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Basic validation
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // result is "data:image/jpeg;base64,....."
        setSelectedImage(result);
        setMimeType(file.type);
        setGeneratedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage || !prompt) return;
    setLoading(true);
    setGeneratedImage(null);
    try {
      // Extract base64 data (remove data:image/xxx;base64, prefix)
      const base64Data = selectedImage.split(',')[1];
      
      const resultBase64 = await generateImageEdit(base64Data, mimeType, prompt);
      setGeneratedImage(`data:image/png;base64,${resultBase64}`);
    } catch (error) {
      console.error(error);
      alert("Failed to process image. Ensure your API key is valid and supports Gemini 2.5 Flash Image.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setGeneratedImage(null);
    setPrompt('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="p-6 max-w-2xl mx-auto min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors">
           <ArrowLeft size={20} />
        </button>
        <div>
           <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
             AI Workout Studio
           </h2>
           <p className="text-xs text-slate-400">Powered by Gemini 2.5 Flash Image</p>
        </div>
      </div>

      <div className="flex-1 space-y-6">
        
        {/* Upload Area */}
        {!selectedImage ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700 rounded-2xl h-64 flex flex-col items-center justify-center cursor-pointer hover:border-violet-500 hover:bg-slate-800/50 transition-all group"
          >
            <div className="p-4 bg-slate-800 rounded-full mb-4 group-hover:scale-110 transition-transform">
              <Upload className="text-violet-400" size={32} />
            </div>
            <p className="text-slate-300 font-medium">Upload a workout photo</p>
            <p className="text-slate-500 text-sm mt-1">Tap to select</p>
            <input 
              ref={fileInputRef} 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Image Comparison / Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-black/50 aspect-square">
                 <img src={selectedImage} alt="Original" className="w-full h-full object-contain" />
                 <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded text-xs text-slate-300 font-bold">Original</div>
                 <button onClick={handleClear} className="absolute top-2 right-2 bg-red-500/80 p-1 rounded-full hover:bg-red-600">
                   <X size={14} />
                 </button>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-black/50 aspect-square flex items-center justify-center">
                 {loading ? (
                   <div className="flex flex-col items-center gap-2">
                     <Loader2 className="animate-spin text-violet-500" size={40} />
                     <span className="text-violet-400 text-sm font-medium animate-pulse">Generating...</span>
                   </div>
                 ) : generatedImage ? (
                   <>
                     <img src={generatedImage} alt="Generated" className="w-full h-full object-contain" />
                     <div className="absolute top-2 left-2 bg-violet-600/90 px-2 py-1 rounded text-xs text-white font-bold">Gemini Edit</div>
                     <a href={generatedImage} download="formfit-ai-edit.png" className="absolute bottom-4 right-4 bg-slate-900/80 hover:bg-black p-2 rounded-full text-white backdrop-blur-sm">
                       <Download size={20} />
                     </a>
                   </>
                 ) : (
                   <div className="text-slate-500 flex flex-col items-center text-sm">
                      <ImageIcon size={32} className="mb-2 opacity-50" />
                      Result will appear here
                   </div>
                 )}
              </div>
            </div>

            {/* Controls */}
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
               <label className="block text-sm font-medium text-slate-300 mb-2">
                 AI Command
               </label>
               <div className="flex gap-2">
                 <input 
                   type="text"
                   value={prompt}
                   onChange={(e) => setPrompt(e.target.value)}
                   placeholder="E.g., 'Add a retro gym filter', 'Make the background neon cyberpunk'..."
                   className="flex-1 bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition-all text-slate-100"
                   onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                 />
                 <button 
                   onClick={handleGenerate}
                   disabled={loading || !prompt}
                   className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 rounded-xl font-bold transition-all shadow-lg shadow-violet-900/30 active:scale-95 flex items-center gap-2"
                 >
                   <Wand2 size={20} />
                   <span className="hidden sm:inline">Generate</span>
                 </button>
               </div>
               
               <div className="mt-4 flex gap-2 flex-wrap">
                 {["Add a retro filter", "Cyberpunk background", "Sketch style", "Make it sunny"].map(suggestion => (
                   <button 
                     key={suggestion}
                     onClick={() => setPrompt(suggestion)}
                     className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1.5 rounded-full transition-colors"
                   >
                     {suggestion}
                   </button>
                 ))}
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageEditor;