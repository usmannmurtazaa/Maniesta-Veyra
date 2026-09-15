'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useCustomizerStore } from '@/stores/customizer-store';

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

function ComponentLoading() {
  return (
    <div className="py-16 text-center text-mv-muted">Loading…</div>
  );
}

// ---------------------------------------------------------------------------
// Dynamically imported steps
//
// Every step is client-only. `ssr: false` is not strictly required for the
// non-canvas steps, but keeping it consistent simplifies reasoning about
// bundle boundaries. DesignCanvas MUST use ssr:false — Konva depends on
// browser APIs that do not exist on the server.
// ---------------------------------------------------------------------------

const GarmentSelector = dynamic(
  () => import('./garment-selector').then((mod) => mod.GarmentSelector),
  { ssr: false, loading: () => <ComponentLoading /> }
);

const ColorSelector = dynamic(
  () => import('./color-selector').then((mod) => mod.ColorSelector),
  { ssr: false, loading: () => <ComponentLoading /> }
);

const SizeSelector = dynamic(
  () => import('./size-selector').then((mod) => mod.SizeSelector),
  { ssr: false, loading: () => <ComponentLoading /> }
);

const PrintLocationSelector = dynamic(
  () =>
    import('./print-location-selector').then(
      (mod) => mod.PrintLocationSelector
    ),
  { ssr: false, loading: () => <ComponentLoading /> }
);

const DesignUploader = dynamic(
  () => import('./design-uploader').then((mod) => mod.DesignUploader),
  { ssr: false, loading: () => <ComponentLoading /> }
);

const DesignCanvas = dynamic(
  () => import('./design-canvas').then((mod) => mod.DesignCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="py-16 text-center text-mv-muted">
        Preparing editor…
      </div>
    ),
  }
);

const CustomizationSummary = dynamic(
  () =>
    import('./customization-summary').then(
      (mod) => mod.CustomizationSummary
    ),
  { ssr: false, loading: () => <ComponentLoading /> }
);

const CustomizationPrice = dynamic(
  () =>
    import('./customization-price').then(
      (mod) => mod.CustomizationPrice
    ),
  {
    ssr: false,
    loading: () => (
      <div className="border-t border-mv-border pt-4">
        <div className="h-10 animate-pulse rounded bg-mv-muted/10" />
      </div>
    ),
  }
);

export function CustomizerWizard({ garments }: CustomizerWizardProps) {
  const router = useRouter();
  const store = useCustomizerStore();

  const [loading, setLoading] = useState(false);
  const [calculatingPrice, setCalculatingPrice] = useState(false);

  const selectedGarment = garments.find((g) => g.id === store.garmentId);

  function nextStep() {
    if (store.step < 7) store.setStep(store.step + 1);
  }

  function prevStep() {
    if (store.step > 1) store.setStep(store.step - 1);
  }

  // -------------------------------------------------------------------
  // Calculate price
  // -------------------------------------------------------------------
  async function calculatePrice() {
    if (!store.garmentId || store.selectedLocations.length === 0) {
      toast({
        title: 'Missing selection',
        description: 'Select a garment and at least one print location first.',
        variant: 'destructive',
      });
      return;
    }

    setCalculatingPrice(true);
    try {
      const response = await fetch('/api/custom/price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          garmentId: store.garmentId,
          printLocations: store.selectedLocations,
          quantity: store.quantity,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error?.message ?? 'Failed to calculate price'
        );
      }

      store.setEstimatedPrice({
        unitPrice: Number(result.data.unitPrice),
        totalPrice: Number(result.data.totalPrice),
      });
    } catch (error) {
      console.error('[customizer] price calculation failed:', error);
      toast({
        title: 'Could not calculate price',
        description:
          error instanceof Error
            ? error.message
            : 'Please try again in a moment.',
        variant: 'destructive',
      });
    } finally {
      setCalculatingPrice(false);
    }
  }

  // -------------------------------------------------------------------
  // Add to cart
  // -------------------------------------------------------------------
  async function addToCart() {
    // ---- 1. Basic selections ----
    if (
      !store.garmentId ||
      !store.garmentColorId ||
      !store.garmentSizeId ||
      store.selectedLocations.length === 0
    ) {
      toast({
        title: 'Incomplete design',
        description: 'Please complete every step before adding to cart.',
        variant: 'destructive',
      });
      return;
    }

    // ---- 2. Require artwork on every selected print location ----
    // The API rejects assets with an empty imageUrl, so we catch this
    // client-side and point at the specific missing location.
    const missingArtwork = store.selectedLocations.filter(
      (loc) => !store.assets[loc]?.imageUrl
    );
    if (missingArtwork.length > 0) {
      const names = missingArtwork
        .map((l) => l.replace(/_/g, ' ').toLowerCase())
        .join(', ');
      toast({
        title: 'Artwork missing',
        description: `Please upload a design for: ${names}.`,
        variant: 'destructive',
      });
      store.setStep(5); // jump back to the upload step
      return;
    }

    // ---- 3. Require a calculated price ----
    // If the user skipped "Calculate", run it now so the server records
    // the correct price. The /api/custom/designs endpoint recomputes
    // pricing anyway, but calling here keeps the UX honest.
    if (!store.estimatedPrice) {
      await calculatePrice();
    }

    setLoading(true);

    try {
      // ---- 4. Create the design (server computes prices) ----
      const designRes = await fetch('/api/custom/designs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          garmentId: store.garmentId,
          garmentColorId: store.garmentColorId,
          garmentSizeId: store.garmentSizeId,
          printLocations: store.selectedLocations,
          quantity: store.quantity,
          notes: store.notes || undefined,
          // NOTE: unitPrice / totalPrice are intentionally NOT sent.
          // The server recomputes them from the garment + print pricing.
          assets: store.selectedLocations.map((location) => {
            const asset = store.assets[location]!;
            return {
              printLocation: location,
              imageUrl: asset.imageUrl!,
              fileName: asset.fileName ?? 'design',
              fileSize: asset.fileSize ?? 0,
              mimeType: asset.mimeType ?? 'image/png',
              imageWidth: asset.imageWidth,
              imageHeight: asset.imageHeight,
              positionX: asset.positionX ?? 50,
              positionY: asset.positionY ?? 50,
              scale: asset.scale ?? 0.5,
              rotation: asset.rotation ?? 0,
            };
          }),
        }),
      });

      const designResult = await designRes.json();

      if (!designRes.ok) {
        throw new Error(
          designResult?.error?.message ?? 'Failed to create custom design'
        );
      }

      // ---- 5. Add the design to the cart ----
      const cartRes = await fetch('/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customDesignId: designResult.data.id,
          quantity: store.quantity,
        }),
      });

      if (!cartRes.ok) {
        const cartResult = await cartRes.json().catch(() => null);
        throw new Error(
          cartResult?.error?.message ?? 'Failed to add item to cart'
        );
      }

      toast({
        title: 'Added to cart',
        description: 'Your custom design is ready for checkout.',
      });

      router.push('/cart');
    } catch (error) {
      console.error('[customizer] add to cart failed:', error);
      toast({
        title: 'Could not add to cart',
        description:
          error instanceof Error
            ? error.message
            : 'Please try again in a moment.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  // -------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------
  return (
    <div className="space-y-8">
      {/* Step navigation */}
      <div className="flex items-center justify-between gap-2">
        <Button
          variant="ghost"
          onClick={prevStep}
          disabled={store.step <= 1 || loading}
        >
          Back
        </Button>

        <p className="text-sm text-mv-muted" aria-live="polite">
          Step {store.step} of 7
        </p>

        {store.step < 7 ? (
          <Button
            onClick={nextStep}
            disabled={
              loading ||
              (store.step === 1 && !store.garmentId) ||
              (store.step === 2 && !store.garmentColorId) ||
              (store.step === 3 && !store.garmentSizeId) ||
              (store.step === 4 && store.selectedLocations.length === 0)
            }
          >
            Next
          </Button>
        ) : (
          <Button onClick={addToCart} disabled={loading}>
            {loading ? 'Adding to cart…' : 'Add to Cart'}
          </Button>
        )}
      </div>

      {/* Step content */}
      <StepContent
        step={store.step}
        garments={garments}
        selectedGarment={selectedGarment}
      />

      {/* Price panel (visible from step 4 onward) */}
      {store.step >= 4 && (
        <CustomizationPrice
          onCalculate={calculatePrice}
          isCalculating={calculatingPrice}
        />
      )}
    </div>
  );
}

interface StepContentProps {
  step: number;
  garments: Garment[];
  selectedGarment: Garment | undefined;
}

function StepContent({
  step,
  garments,
  selectedGarment,
}: StepContentProps) {
  switch (step) {
    case 1:
      return <GarmentSelector garments={garments} />;

    case 2:
      if (!selectedGarment) {
        return (
          <div className="py-16 text-center text-mv-muted">
            Please select a garment first.
          </div>
        );
      }
      return <ColorSelector colors={selectedGarment.colors} />;

    case 3:
      if (!selectedGarment) {
        return (
          <div className="py-16 text-center text-mv-muted">
            Please select a garment first.
          </div>
        );
      }
      return <SizeSelector sizes={selectedGarment.sizes} />;

    case 4:
      return <PrintLocationSelector />;

    case 5:
      return <DesignUploader />;

    case 6:
      return <DesignCanvas />;

    case 7:
      return <CustomizationSummary garment={selectedGarment} />;

    default:
      return null;
  }
}