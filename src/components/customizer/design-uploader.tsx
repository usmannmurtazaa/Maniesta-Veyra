'use client';

import { useState, useRef } from 'react';
import { useCustomizerStore } from '@/stores/customizer-store';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

export function DesignUploader() {
  const { activeLocation, setAssetConfig } = useCustomizerStore();
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeLocation) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/custom/upload', { method: 'POST', body: formData });
      const result = await res.json();
      if (res.ok) {
        setAssetConfig(activeLocation, {
          imageUrl: result.data.url,
          fileName: result.data.fileName,
          fileSize: result.data.fileSize,
          mimeType: result.data.mimeType,
          imageWidth: result.data.dimensions?.width,
          imageHeight: result.data.dimensions?.height,
        });
      } else {
        alert(result.error?.message || 'Upload failed');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Upload Design for {activeLocation}</h2>
      <input ref={inputRef} type="file" accept=".png,.jpg,.jpeg,.webp,.svg" onChange={handleFileChange} className="hidden" />
      <Button onClick={() => inputRef.current?.click()} disabled={uploading}>
        <Upload className="h-4 w-4" /> {uploading ? 'Uploading...' : 'Upload Design'}
      </Button>
      <p className="text-sm text-mv-muted">PNG, JPG, WEBP, SVG (max 10 MB)</p>
    </div>
  );
}