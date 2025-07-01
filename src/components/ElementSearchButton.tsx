import React, { useState } from 'react';
import { SimpleSearchDialog } from './SimpleSearchDialog';
import { SafeElementData } from '../utils/elementUtils';
import { Button } from './Button';
import ErrorBoundary from './ErrorBoundary';

interface ElementSearchButtonProps {
  onSelectElement?: (element: SafeElementData) => void;
  buttonText?: string;
  className?: string;
}

export function ElementSearchButton({ 
  onSelectElement, 
  buttonText = "🔍 Rechercher un élément", 
  className = "" 
}: ElementSearchButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSelectElement = (element: SafeElementData) => {
    try {
      onSelectElement?.(element);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de la sélection de l\'élément:', error);
    }
  };

  return (
    <ErrorBoundary>
      <Button 
        onClick={() => setIsDialogOpen(true)}
        className={className}
      >
        {buttonText}
      </Button>
      
      {isDialogOpen && (
        <SimpleSearchDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSelectElement={handleSelectElement}
        />
      )}
    </ErrorBoundary>
  );
}
