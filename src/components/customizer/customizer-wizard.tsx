'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useCustomizerStore } from '@/stores/customizer-store';

// Konva is loaded dynamically ONLY at runtime — never bundled into SSR
type KonvaModule = typeof import('react-konva');

interface Garment {
  id: string;
  name: string;
  basePrice: number | string;
  colors: Array<{ id: string; name: string; hexCode: string }>;
  sizes: Array<{ id: string; label: string }>;
  supportedPrintLocations: string[];
}

interface CustomizerWizardProps {
  garments: Garment[];
}

export function CustomizerWizard({ garments }: CustomizerWizardProps) {
  const router = useRouter();
  const store = useCustomizerStore();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [konvaReady, setKonvaReady] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Preload Konva only in browser after mount
    import('react-konva')
      .then(() => setKonvaReady(true))
      .catch((err) => {
        console.error('Failed to load Konva:', err);
      });
  }, []);

  if (!mounted) {
    return (
      <div className="py-16 text-center text-mv-muted">
        Loading custom studio...
      </div>
    );
  }

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
          store.selectedLocations.map((loc) => [loc, 0])
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

  const addToCart = async () => {
    if (
      !store.garmentId ||
      !store.garmentColorId ||
      !store.garmentSizeId ||
      store.selectedLocations.length === 0
    ) {
      toast({
        title: 'Error',
        description: 'Please complete all steps',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    try {
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
          assets: store.selectedLocations.map((loc) => ({
            printLocation: loc,
            imageUrl: store.assets[loc]?.imageUrl ?? '',
            fileName: store.assets[loc]?.fileName ?? 'design',
            fileSize: store.assets[loc]?.fileSize ?? 0,
            mimeType: store.assets[loc]?.mimeType ?? 'image/png',
            imageWidth: store.assets[loc]?.imageWidth,
            imageHeight: store.assets[loc]?.imageHeight,
            positionX: store.assets[loc]?.positionX ?? 50,
            positionY: store.assets[loc]?.positionY ?? 50,
            scale: store.assets[loc]?.scale ?? 0.5,
            rotation: store.assets[loc]?.rotation ?? 0,
          })),
        }),
      });
      const designResult = await designRes.json();
      if (!designRes.ok) throw new Error(designResult.error?.message);

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
        toast({
          title: 'Error',
          description: 'Failed to add to cart',
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to add to cart',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
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
          <Button
            onClick={nextStep}
            disabled={store.step === 1 && !store.garmentId}
          >
            Next
          </Button>
        ) : (
          <Button onClick={addToCart} disabled={loading || !konvaReady}>
            {loading ? 'Adding to cart...' : 'Add to Cart'}
          </Button>
        )}
      </div>

      <div>
        {/* Render step content only when Konva is ready */}
        {konvaReady ? (
          <StepContent
            step={store.step}
            garments={garments}
            selectedGarment={selectedGarment}
          />
        ) : (
          <div className="py-16 text-center text-mv-muted">
            Preparing editor...
          </div>
        )}
      </div>

      {store.step >= 4 && <CustomizationPrice onCalculate={calculatePrice} />}
    </div>
  );
}

// Separate component for step content — Konva components live here
function StepContent({
  step,
  garments,
  selectedGarment,
}: {
  step: number;
  garments: Garment[];
  selectedGarment: Garment | undefined;
}) {
  const [LoadedComponents, setLoadedComponents] = useState<{
    GarmentSelector: React.ComponentType<{ garments: Garment[] }>;
    ColorSelector: React.ComponentType<{ colors: Garment['colors'] }>;
    SizeSelector: React.ComponentType<{ sizes: Garment['sizes'] }>;
    PrintLocationSelector: React.ComponentType;
    DesignUploader: React.ComponentType;
    DesignCanvas: React.ComponentType;
    CustomizationSummary: React.ComponentType;
    CustomizationPrice: React.ComponentType<{ onCalculate: () => void }>;
  } | null>(null);

  useEffect(() => {
    Promise.all([
      import('./garment-selector'),
      import('./color-selector'),
      import('./size-selector'),
      import('./print-location-selector'),
      import('./design-uploader'),
      import('./design-canvas'),
      import('./customization-summary'),
      import('./customization-price'),
    ]).then(
      ([
        garment,
        color,
        size,
        printLoc,
        upload,
        canvas,
        summary,
        price,
      ]) => {
        setLoadedComponents({
          GarmentSelector: garment.GarmentSelector,
          ColorSelector: color.ColorSelector,
          SizeSelector: size.SizeSelector,
          PrintLocationSelector: printLoc.PrintLocationSelector,
          DesignUploader: upload.DesignUploader,
          DesignCanvas: canvas.DesignCanvas,
          CustomizationSummary: summary.CustomizationSummary,
          CustomizationPrice: price.CustomizationPrice,
        });
      }
    );
  }, []);

  if (!LoadedComponents) {
    return (
      <div className="py-16 text-center text-mv-muted">
        Loading components...
      </div>
    );
  }

  const {
    GarmentSelector,
    ColorSelector,
    SizeSelector,
    PrintLocationSelector,
    DesignUploader,
    DesignCanvas,
    CustomizationSummary,
  } = LoadedComponents;

  switch (step) {
    case 1:
      return <GarmentSelector garments={garments} />;
    case 2:
      return selectedGarment ? (
        <ColorSelector colors={selectedGarment.colors} />
      ) : null;
    case 3:
      return selectedGarment ? (
        <SizeSelector sizes={selectedGarment.sizes} />
      ) : null;
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
}

// CustomizationPrice is imported dynamically above — fallback for step >= 4
function CustomizationPrice({ onCalculate }: { onCalculate: () => void }) {
  const { estimatedPrice } = useCustomizerStore();

  return (
    <div className="flex items-center justify-between border-t border-mv-border pt-4">
      <div>
        {estimatedPrice ? (
          <>
            <p className="text-lg font-semibold">
              ₨ {estimatedPrice.unitPrice.toLocaleString()}{' '}
              <span className="text-sm font-normal">per item</span>
            </p>
            <p className="text-sm text-mv-muted">
              Total: ₨ {estimatedPrice.totalPrice.toLocaleString()}
            </p>
          </>
        ) : (
          <p className="text-mv-muted">Click calculate to see price</p>
        )}
      </div>
      <Button variant="outline" onClick={onCalculate}>
        Calculate Price
      </Button>
    </div>
  );
}