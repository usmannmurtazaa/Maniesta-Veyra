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
  colors: Array<{
    id: string;
    name: string;
    hexCode: string;
  }>;
  sizes: Array<{
    id: string;
    label: string;
  }>;
  supportedPrintLocations: string[];
}

interface CustomizerWizardProps {
  garments: Garment[];
}

/*
 * Load each step independently.
 *
 * Important:
 * DesignCanvas uses react-konva, so it MUST NOT be rendered
 * during SSR. ssr:false keeps Konva completely client-side.
 */

const GarmentSelector = dynamic(
  () =>
    import('./garment-selector').then(
      (mod) => mod.GarmentSelector
    ),
  {
    ssr: false,
    loading: () => <ComponentLoading />,
  }
);

const ColorSelector = dynamic(
  () =>
    import('./color-selector').then(
      (mod) => mod.ColorSelector
    ),
  {
    ssr: false,
    loading: () => <ComponentLoading />,
  }
);

const SizeSelector = dynamic(
  () =>
    import('./size-selector').then(
      (mod) => mod.SizeSelector
    ),
  {
    ssr: false,
    loading: () => <ComponentLoading />,
  }
);

const PrintLocationSelector = dynamic(
  () =>
    import('./print-location-selector').then(
      (mod) => mod.PrintLocationSelector
    ),
  {
    ssr: false,
    loading: () => <ComponentLoading />,
  }
);

const DesignUploader = dynamic(
  () =>
    import('./design-uploader').then(
      (mod) => mod.DesignUploader
    ),
  {
    ssr: false,
    loading: () => <ComponentLoading />,
  }
);

/*
 * IMPORTANT:
 * This is the component that uses react-konva.
 *
 * Never SSR this component.
 */
const DesignCanvas = dynamic(
  () =>
    import('./design-canvas').then(
      (mod) => mod.DesignCanvas
    ),
  {
    ssr: false,
    loading: () => (
      <div className="py-16 text-center text-mv-muted">
        Preparing editor...
      </div>
    ),
  }
);

const CustomizationSummary = dynamic(
  () =>
    import('./customization-summary').then(
      (mod) => mod.CustomizationSummary
    ),
  {
    ssr: false,
    loading: () => <ComponentLoading />,
  }
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

function ComponentLoading() {
  return (
    <div className="py-16 text-center text-mv-muted">
      Loading...
    </div>
  );
}

export function CustomizerWizard({
  garments,
}: CustomizerWizardProps) {
  const router = useRouter();
  const store = useCustomizerStore();

  const [loading, setLoading] = useState(false);

  const selectedGarment = garments.find(
    (garment) => garment.id === store.garmentId
  );

  const nextStep = () => {
    if (store.step < 7) {
      store.setStep(store.step + 1);
    }
  };

  const prevStep = () => {
    if (store.step > 1) {
      store.setStep(store.step - 1);
    }
  };

  const calculatePrice = async () => {
    if (
      !store.garmentId ||
      store.selectedLocations.length === 0
    ) {
      toast({
        title: 'Error',
        description:
          'Please select a garment and at least one print location.',
        variant: 'destructive',
      });

      return;
    }

    try {
      const response = await fetch('/api/custom/price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          garmentId: store.garmentId,
          printLocations: store.selectedLocations,
          quantity: store.quantity,
          designSqInchesPerLocation: Object.fromEntries(
            store.selectedLocations.map((location) => [
              location,
              0,
            ])
          ),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error?.message ||
            'Failed to calculate price'
        );
      }

      store.setEstimatedPrice({
        unitPrice: Number(result.data.unitPrice),
        totalPrice: Number(result.data.totalPrice),
      });
    } catch (error) {
      console.error(
        'Price calculation failed:',
        error
      );

      toast({
        title: 'Error',
        description:
          'Failed to calculate the customization price.',
        variant: 'destructive',
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
        description: 'Please complete all steps.',
        variant: 'destructive',
      });

      return;
    }

    setLoading(true);

    try {
      /*
       * Create the custom design first.
       */
      const designRes = await fetch(
        '/api/custom/designs',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            garmentId: store.garmentId,
            garmentColorId: store.garmentColorId,
            garmentSizeId: store.garmentSizeId,
            printLocations: store.selectedLocations,
            quantity: store.quantity,
            notes: store.notes,

            unitPrice:
              store.estimatedPrice?.unitPrice ?? 0,

            totalPrice:
              store.estimatedPrice?.totalPrice ?? 0,

            assets: store.selectedLocations.map(
              (location) => ({
                printLocation: location,

                imageUrl:
                  store.assets[location]?.imageUrl ?? '',

                fileName:
                  store.assets[location]?.fileName ??
                  'design',

                fileSize:
                  store.assets[location]?.fileSize ?? 0,

                mimeType:
                  store.assets[location]?.mimeType ??
                  'image/png',

                imageWidth:
                  store.assets[location]?.imageWidth,

                imageHeight:
                  store.assets[location]?.imageHeight,

                positionX:
                  store.assets[location]?.positionX ??
                  50,

                positionY:
                  store.assets[location]?.positionY ??
                  50,

                scale:
                  store.assets[location]?.scale ??
                  0.5,

                rotation:
                  store.assets[location]?.rotation ??
                  0,
              })
            ),
          }),
        }
      );

      const designResult =
        await designRes.json();

      if (!designRes.ok) {
        throw new Error(
          designResult?.error?.message ||
            'Failed to create custom design'
        );
      }

      /*
       * Add the newly created design to cart.
       */
      const cartRes = await fetch(
        '/api/cart/items',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customDesignId:
              designResult.data.id,
            quantity: store.quantity,
          }),
        }
      );

      if (!cartRes.ok) {
        const cartResult =
          await cartRes.json().catch(() => null);

        throw new Error(
          cartResult?.error?.message ||
            'Failed to add item to cart'
        );
      }

      toast({
        title: 'Added to cart',
        description:
          'Your customized product has been added to the cart.',
      });

      router.push('/cart');
    } catch (error) {
      console.error(
        'Add to cart failed:',
        error
      );

      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to add to cart.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={prevStep}
          disabled={store.step <= 1 || loading}
        >
          Back
        </Button>

        <p className="text-sm text-mv-muted">
          Step {store.step} of 7
        </p>

        {store.step < 7 ? (
          <Button
            onClick={nextStep}
            disabled={
              loading ||
              (store.step === 1 &&
                !store.garmentId)
            }
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={addToCart}
            disabled={loading}
          >
            {loading
              ? 'Adding to cart...'
              : 'Add to Cart'}
          </Button>
        )}
      </div>

      {/* Step Content */}
      <StepContent
        step={store.step}
        garments={garments}
        selectedGarment={selectedGarment}
      />

      {/* Price */}
      {store.step >= 4 && (
        <CustomizationPrice
          onCalculate={calculatePrice}
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
      return (
        <GarmentSelector
          garments={garments}
        />
      );

    case 2:
      if (!selectedGarment) {
        return (
          <div className="py-16 text-center text-mv-muted">
            Please select a garment first.
          </div>
        );
      }

      return (
        <ColorSelector
          colors={selectedGarment.colors}
        />
      );

    case 3:
      if (!selectedGarment) {
        return (
          <div className="py-16 text-center text-mv-muted">
            Please select a garment first.
          </div>
        );
      }

      return (
        <SizeSelector
          sizes={selectedGarment.sizes}
        />
      );

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
