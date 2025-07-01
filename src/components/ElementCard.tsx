import React from 'react';
import { formatElementInfo, formatPrice, SafeElementData } from '../utils/elementUtils';

interface ElementCardProps {
  element: SafeElementData;
  onClick?: () => void;
  showSimilarity?: boolean;
  showPriceDifference?: boolean;
  className?: string;
}

export function ElementCard({ 
  element, 
  onClick, 
  showSimilarity = false, 
  showPriceDifference = false,
  className = "" 
}: ElementCardProps) {
  const info = formatElementInfo(element);
  const similarity = (element as any).similarity_score;
  const priceDiff = (element as any).price_difference_percent;

  return (
    <div
      className={`border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 pr-4">
          <h4 className="font-medium text-gray-900 mb-1">
            {info.designation}
          </h4>
          <p className="text-sm text-gray-600 mb-1">
            {info.projet} - {info.lot}
          </p>
          <p className="text-xs text-gray-500">
            Section: {info.section}
          </p>
          {info.date !== 'Date non spécifiée' && (
            <p className="text-xs text-gray-500">
              Date: {info.date}
            </p>
          )}
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-green-600 mb-1">
            {formatPrice(info.prix)} / {info.unite}
          </div>
          {showSimilarity && similarity !== undefined && (
            <div className="text-sm text-blue-600">
              Similarité: {similarity}%
            </div>
          )}
          {showPriceDifference && priceDiff !== undefined && (
            <div className={`text-sm ${
              priceDiff > 0 ? 'text-red-600' : 'text-green-600'
            }`}>
              {priceDiff > 0 ? '+' : ''}{priceDiff.toFixed(1)}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
