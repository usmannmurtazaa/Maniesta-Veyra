'use client';

import { useState } from 'react';
import { useCustomizerStore } from '@/stores/customizer-store';
import { GarmentSelector } from './garment-selector';
import { ColorSelector } from './color-selector';
import { SizeSelector } from './size-selector';
import { PrintLocationSelector } from './print-location-selector';
import { DesignUploader } from './design-uploader';
import { DesignCanvas } from './design-canvas';
import { CustomizationPrice } from './customization-price';
import { CustomizationSummary } from './customization-summary';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

interface CustomizerWizardProps {
  garments: any[];
}

export function CustomizerWizard({ garments }: CustomizerWizardProps) {
  const router = useRouter();
  const store = useCustomizerStore();
  const [loading, setLoading] = useState(false);
  const selectedGarment = garments.find((g) => g.id === store.garmentId);

  const nextStep = () => store.setStep(store.step + 1);
  const prevStep = () => store.setStep(store.step - 1);

  const calculatePrice = async () => {
    if (!store.garmentId || store.selectedLocations.length === 0) return;
    const response = await fetch('/api/custom/price', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        garmentId: store.garmentId,
        printLocations: store.selectedLocations,
        quantity: store.quantity,
        designSqInchesPerLocation: Object.fromEntries(
          store.selectedLocations.map((loc) => [loc, 0]) // we don't track sq inches yet; can be enhanced
        ),
      }),
    });
    const result = await response.json();
    if (response.ok) {
      store.setEstimatedPrice({
        unitPrice: Number(result.data.unitPrice),
        totalPrice: Number(result.data.totalPrice),
      });
    }
  };

  const uploadPreview = async (dataUrl: string): Promise<string> => {
    const blob = await (await fetch(dataUrl)).blob();
    const formData = new FormData();
    formData.append('file', blob, 'preview.png');
    const res = await fetch('/api/custom/preview', { method: 'POST', body: formData });
    const result = await res.json();
    return result.data.url;
  };

  const addToCart = async () => {
    if (!store.garmentId || !store.garmentColorId || !store.garmentSizeId || store.selectedLocations.length === 0) {
      toast({ title: 'Error', description: 'Please complete all steps', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      // Generate preview from canvas
      const canvas = document.querySelector('canvas');
      let previewUrl: string | undefined;
      if (canvas) {
        const dataUrl = canvas.toDataURL('image/png');
        previewUrl = await uploadPreview(dataUrl);
      }

      // Create design
      const designRes = await fetch('/api/custom/designs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          garmentId: store.garmentId,
          garmentColorId: store.garmentColorId,
          garmentSizeId: store.garmentSizeId,
          printLocations: store.selectedLocations,
          quantity: store.quantity,
          notes: store.notes,
          unitPrice: store.estimatedPrice?.unitPrice ?? 0,
          totalPrice: store.estimatedPrice?.totalPrice ?? 0,
          previewImageUrl: previewUrl,
          assets: store.selectedLocations.map((loc) => ({
            printLocation: loc,
            imageUrl: store.assets[loc]?.imageUrl,
            fileName: store.assets[loc]?.fileName || 'design',
            fileSize: store.assets[loc]?.fileSize || 0,
            mimeType: store.assets[loc]?.mimeType || 'image/png',
            imageWidth: store.assets[loc]?.imageWidth,
            imageHeight: store.assets[loc]?.imageHeight,
            positionX: store.assets[loc]?.positionX || 50,
            positionY: store.assets[loc]?.positionY || 50,
            scale: store.assets[loc]?.scale || 0.5,
            rotation: store.assets[loc]?.rotation || 0,
          })),
        }),
      });
      const designResult = await designRes.json();
      if (!designRes.ok) throw new Error(designResult.error?.message);

      // Add to cart
      const cartRes = await fetch('/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customDesignId: designResult.data.id,
          quantity: store.quantity,
        }),
      });
      if (cartRes.ok) {
        toast({ title: 'Added to cart' });
        router.push('/cart');
      } else {
        toast({ title: 'Error', description: 'Failed to add to cart', variant: 'destructive' });
      }
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to add to cart', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (store.step) {
      case 1:
        return <GarmentSelector garments={garments} />;
      case 2:
        return selectedGarment ? <ColorSelector colors={selectedGarment.colors} /> : null;
      case 3:
        return selectedGarment ? <SizeSelector sizes={selectedGarment.sizes} /> : null;
      case 4:
        return <PrintLocationSelector />;
      case 5:
        return <DesignUploader />;
      case 6:
        return <DesignCanvas />;
      case 7:
        return <CustomizationSummary />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={prevStep} disabled={store.step <= 1}>
          Back
        </Button>
        <p className="text-sm text-mv-muted">Step {store.step} of 7</p>
        {store.step < 7 ? (
          <Button onClick={nextStep} disabled={store.step === 1 && !store.garmentId}>
            Next
          </Button>
        ) : (
          <Button onClick={addToCart} disabled={loading}>
            {loading ? 'Adding to cart...' : 'Add to Cart'}
          </Button>
        )}
      </div>
      <div>{renderStep()}</div>
      {store.step >= 4 && <CustomizationPrice onCalculate={calculatePrice} />}
    </div>
  );
}